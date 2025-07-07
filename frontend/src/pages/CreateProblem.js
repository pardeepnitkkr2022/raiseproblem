import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createProblem } from '../api';
import './CreateProblem.css';

const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

const CreateProblem = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';

      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!cloudRes.ok) {
          throw new Error(`Upload failed with status ${cloudRes.status}`);
        }

        const cloudData = await cloudRes.json();
        if (!cloudData.secure_url) throw new Error('Upload failed');

        imageUrl = cloudData.secure_url;
      }

      await createProblem({
        title,
        description,
        tags: tags.split(',').map((t) => t.trim()),
        image: imageUrl,
      });

      navigate('/problems');
    } catch (error) {
      console.error('Error creating problem:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="create-wrapper">
      <Container maxWidth="md">
        <Card className="create-card" elevation={0}>
          <CardContent>
            <Typography variant="h4" align="center" className="create-title">
              📝 Submit a New Problem
            </Typography>

            <form onSubmit={handleSubmit} className="create-form">
              <TextField
                label="Title"
                fullWidth
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                margin="normal"
                className="input-field"
              />
              <TextField
                label="Description"
                fullWidth
                required
                multiline
                minRows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                margin="normal"
                className="input-field"
              />
              <TextField
                label="Tags (comma separated)"
                fullWidth
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                margin="normal"
                className="input-field"
              />

              <Button
                variant="outlined"
                component="label"
                className="upload-btn"
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Upload Image'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </Button>

              {image && !loading && (
                <Typography variant="body2" className="image-name">
                  {image.name}
                </Typography>
              )}

              <Box mt={2}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Problem'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default CreateProblem;
