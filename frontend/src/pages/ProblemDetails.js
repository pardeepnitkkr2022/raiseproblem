import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Alert,
  TextField,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getProblem,
  addComment,
  voteProblem,
  deleteProblem,
  generateAiSolution,
  deleteComment,
} from '../api';
import './ProblemDetails.css';

const ProblemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [comment, setComment] = useState('');
  const [voteType, setVoteType] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [aiSolution, setAiSolution] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await getProblem(id);
        setProblem(data);
      } catch (error) {
        console.error('Error fetching problem:', error);
        setError('Error fetching problem. Please try again later.');
      }
    };
    fetchProblem();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: newComment } = await addComment(id, { comment });
      setComment('');
      setProblem((prev) => ({
        ...prev,
        comments: [...prev.comments, newComment],
      }));
    } catch (error) {
      setError('Error adding comment. Please try again later.');
    }
  };

  const handleVote = async (type) => {
    try {
      const { data } = await voteProblem(id, type);
      setVoteType(voteType === type ? null : type);
      setProblem((prev) => ({
        ...prev,
        upvotes: data.upvotes,
        downvotes: data.downvotes,
      }));
    } catch (error) {
      setError('Error voting on problem. Please try again later.');
    }
  };

  const handleDeleteProblem = async () => {
    try {
      await deleteProblem(id);
      navigate('/problems');
    } catch (error) {
      setError('Error deleting problem. Please try again later.');
    }
  };

const handleGenerateAiSolution = async () => {
  setShowModal(true);

  try {
    const response = await generateAiSolution(id);

    // Backend returns: { solution: bestSolution }
    setAiSolution(response.data.solution);

  } catch (error) {
    console.log("Frontend Error:", error);

    const backendError =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Failed to generate AI solution.";

    setAiSolution(backendError);
  }
};

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(id, commentId);
      setProblem((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c._id !== commentId),
      }));
    } catch (error) {
      setError('Failed to delete comment');
    }
  };

  if (!problem) return <Typography p={4}>Loading...</Typography>;

  return (
    <Box className="details-container">
      <Card className="details-card" elevation={1}>
        <CardContent>
          <Typography variant="h5" className="problem-title">
            {problem.title}
          </Typography>

          {problem.image && (
            <Box
              component="img"
              src={problem.image}
              alt="Problem"
              className="problem-image"
            />
          )}

          <Typography variant="body1" className="problem-description">
            {problem.description}
          </Typography>

          <Box className="tag-wrapper">
            {problem.tags?.map((tag, index) => (
              <Chip key={index} label={`#${tag}`} className="tag-chip" />
            ))}
          </Box>

          <Typography variant="subtitle2" className="posted-by">
            Posted by: {problem.user?.name || 'Unknown'}
          </Typography>

          <Box className="action-btns">
            <Button
              variant="contained"
              startIcon={<ThumbUpIcon />}
              onClick={() => handleVote('upvote')}
              disabled={voteType === 'downvote'}
              className="vote-btn upvote"
            >
              {problem.upvotes || 0}
            </Button>
            <Button
              variant="contained"
              startIcon={<ThumbDownIcon />}
              onClick={() => handleVote('downvote')}
              disabled={voteType === 'upvote'}
              className="vote-btn downvote"
            >
              {problem.downvotes || 0}
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteProblem}
              className="delete-problem"
            >
              Delete Problem
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Box className="comments-section">
        <Typography variant="h6">Comments</Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <List className="comment-list">
          {problem.comments?.map((c) => (
            <ListItem
              key={c._id}
              className="comment-item"
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDeleteComment(c._id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={c.comment || '[No comment provided]'}
                secondary={`- ${c.user?.name || 'Unknown'}`}
              />
            </ListItem>
          ))}
        </List>

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <TextField
            fullWidth
            label="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" className="submit-comment">
            Add Comment
          </Button>
        </form>
      </Box>

      <Box mt={4}>
        <Button variant="contained" onClick={handleGenerateAiSolution} className="ai-btn">
          Generate AI Solution
        </Button>
      </Box>

      <Dialog open={showModal} onClose={() => setShowModal(false)} fullWidth maxWidth="md">
        <DialogTitle>
          AI Generated Solution
          <IconButton
            edge="end"
            onClick={() => setShowModal(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography whiteSpace="pre-line">{aiSolution || 'Generating...'}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProblemDetails;
