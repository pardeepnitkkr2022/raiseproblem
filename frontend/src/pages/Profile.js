import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Typography,
  Box,
  Button,
  Grid,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getProfile, updateProfilePicture } from '../api';
import './Profile.css';

const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

const Profile = () => {
  const [profileData, setProfileData] = useState({ user: {}, problems: [] });
  const [image, setImage] = useState('/default-avatar.png');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data } = await getProfile();
        setProfileData(data);
        setImage(data.pictureUrl || '/default-avatar.png');
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfileData();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    setLoading(true);

    try {
      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const cloudData = await cloudRes.json();
      const { data } = await updateProfilePicture({ pictureUrl: cloudData.secure_url });

      setProfileData((prev) => ({ ...prev, pictureUrl: data.pictureUrl }));
      setImage(data.pictureUrl);
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="profile-wrapper">
      <div className="profile-card">
        {loading ? (
          <CircularProgress size={80} />
        ) : (
          <Avatar alt="Profile" src={image} sx={{ width: 100, height: 100 }} />
        )}

        <div className="profile-details">
          <Typography className="profile-name">👤 {profileData.user.name}</Typography>
          <Typography className="profile-email">📧 {profileData.user.email}</Typography>
          <Button variant="outlined" component="label" className="upload-button">
            {loading ? 'Uploading...' : 'Upload New Picture'}
            <input hidden type="file" onChange={handleImageUpload} />
          </Button>
        </div>
      </div>

      <Typography variant="h5" className="section-heading">
        Your Problems
      </Typography>

      <Grid container spacing={4}>
        {profileData.problems.map((problem) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={problem._id}>
            <Link to={`/problems/${problem._id}`} className="problem-card-link">
              <div className="modern-problem-card">
                <div className="problem-card-top">
                  <h3 className="problem-title-text">{problem.title}</h3>
                  <p className="problem-desc-text">{problem.description}</p>
                </div>
                <div className="problem-card-meta">
                  <div className="problem-tags">
                    {problem.tags?.slice(0, 3).map((tag, i) => (
                      <span key={i} className="problem-tag">#{tag}</span>
                    ))}
                  </div>
                  <div className="problem-votes">
                    <span>⬆ {problem.upvotes}</span>
                    <span>⬇ {problem.downvotes}</span>
                  </div>
                </div>
              </div>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Profile;
