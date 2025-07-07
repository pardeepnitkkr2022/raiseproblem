import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getTrendingProblems } from '../api';
import './TrendingProblems.css';

const TrendingProblems = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await getTrendingProblems();
        setProblems(data);
      } catch (error) {
        console.error('Error fetching trending problems:', error);
      }
    };
    fetchTrending();
  }, []);

  return (
    <Box className="trending-container">
      <Box className="trending-header-box">
        <Typography className="trending-title">
          🔥 Trending Problems
        </Typography>
        <Typography className="trending-subtitle">
          The most discussed and upvoted problems right now!
        </Typography>
      </Box>

      {problems.length > 0 ? (
        <Grid container spacing={4} className="trending-grid">
          {problems.map((problem) => (
            <Grid item key={problem._id} xs={12} sm={6} md={4} lg={3}>
              <Link to={`/problems/${problem._id}`} className="trending-link">
                <Card className="trending-card">
                  <CardContent className="trending-card-content">
                    <Typography className="problem-title">
                      {problem.title} <span>🔥</span>
                    </Typography>

                    <Typography className="problem-description">
                      {problem.description}
                    </Typography>

                    <Box className="tag-box">
                      {problem.tags?.slice(0, 3).map((tag, i) => (
                        <Chip key={i} label={`#${tag}`} className="tag-chip" />
                      ))}
                    </Box>
                  </CardContent>

                  <Box className="vote-bar">
                    <span>⬆ {problem.upvotes}</span>
                    <span>⬇ {problem.downvotes}</span>
                  </Box>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography className="no-problems" align="center">
          😕 No trending problems available.
        </Typography>
      )}
    </Box>
  );
};

export default TrendingProblems;
