import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import { getProblems } from '../api';
import './ProblemList.css';

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await getProblems();
        setProblems(data);
        setFilteredProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };
    fetchProblems();
  }, []);

  useEffect(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) {
      setFilteredProblems(problems);
      return;
    }

    const filtered = problems.filter((problem) => {
      const descriptionMatch = problem.description.toLowerCase().includes(keyword);
      const tagMatch = problem.tags.some((tag) => tag.toLowerCase().includes(keyword));
      return descriptionMatch || tagMatch;
    });

    setFilteredProblems(filtered);
  }, [searchKeyword, problems]);

  return (
    <Box className="problem-list-wrapper">
      <Box className="problem-header-box">
  <Typography className="problem-list-heading">
    ✨ Curated Community Problems
  </Typography>
  <Typography className="problem-subtitle">
    Discover, solve, and grow with real-world coding issues shared by peers.
  </Typography>
</Box>

      <Box className="search-box">
        <TextField
          fullWidth
          placeholder="Search by tags, keywords, or description..."
          variant="outlined"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="search-input"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: '#9aa0a6' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {filteredProblems.length > 0 ? (
        <Grid container spacing={4} className="problem-grid">
          {filteredProblems.map((problem) => (
            <Grid item key={problem._id} xs={12} sm={6} md={4} lg={3}>
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
      ) : (
        <Typography className="no-problems-text" align="center">
          😞 No problems match your search.
        </Typography>
      )}
    </Box>
  );
};

export default ProblemList;
