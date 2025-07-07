const express = require('express');
const Problem = require('../models/Problem');
const authMiddleware = require('../middleware/auth');
const cloudinary = require('../models/cloudinary');
const router = express.Router();

router.get('/trending', async (req, res) => {
    try {
        console.log('🔍 Trending route hit');
        const problems = await Problem.aggregate([
            {
                $addFields: {
                    interactions: {
                        $add: [
                            { $ifNull: ["$upvotes", 0] },
                            { $ifNull: ["$downvotes", 0] },
                            { $size: { $ifNull: ["$comments", []] } }
                        ]
                    }
                }
            },
            { $sort: { interactions: -1, createdAt: -1 } },
            { $limit: 5 }
        ]);

        res.json(problems);
    } catch (error) {
        console.error('Error fetching trending problems:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/', authMiddleware, async (req, res) => {

  try {
    const { title, description, tags, image } = req.body;

    const problem = new Problem({
      title,
      description,
      tags,
      image,
      user: req.user._id,
    });

    await problem.save();
    res.status(201).json(problem);
  } catch (error) {
    console.error('❌ Error creating problem:', error);
    res.status(500).json({ message: 'Problem creation failed' });
  }
});




router.get('/:id', async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id)
            .populate('user', 'name')  
            .populate('comments.user', 'name'); 
        if (!problem) return res.status(404).json({ message: 'Problem not found' });
        res.status(200).json(problem);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching problem' });
    }
});



router.post('/:id/comments', authMiddleware, async (req, res) => {
  const { comment } = req.body;

  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    problem.comments.push({ comment, user: req.user._id });
    await problem.save();

    const updatedProblem = await Problem.findById(req.params.id)
      .populate('comments.user', 'name');
    const newComment = updatedProblem.comments[updatedProblem.comments.length - 1];

    res.status(201).json(newComment);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ message: 'Error adding comment' });
  }
});



router.delete('/:problemId/comments/:commentId', authMiddleware, async (req, res) => {
  try {
    console.log('🔍 Deleting comment:', req.params);
    const { problemId, commentId } = req.params;
    const userId = req.user._id;

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    const comment = problem.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (
      comment.user.toString() !== userId.toString() &&
      problem.user.toString() !== userId.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

problem.comments = problem.comments.filter(c => c._id.toString() !== commentId);
await problem.save();
    

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/:id/vote', authMiddleware, async (req, res) => {
    const { type } = req.body;

    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) return res.status(404).json({ message: 'Problem not found' });

        const userId = req.user.id;
        const existingVote = problem.votedUsers.find(vote => vote.toString() === userId);

        if (existingVote) {
           
            if (type === 'upvote') {
                problem.upvotes -= 1;
            } else if (type === 'downvote') {
                problem.downvotes -= 1;
            }
            
            problem.votedUsers = problem.votedUsers.filter(vote => vote.toString() !== userId);
        } else {
         
            if (type === 'upvote') {
                problem.upvotes += 1;
            } else if (type === 'downvote') {
                problem.downvotes += 1;
            }
            
            problem.votedUsers.push(userId);
        }

        await problem.save();
        res.status(200).json({ upvotes: problem.upvotes, downvotes: problem.downvotes });
    } catch (err) {
        res.status(500).json({ message: 'Error voting on problem' });
    }
});


router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const problem = await Problem.findById(id);
        if (!problem) return res.status(404).json({ message: 'Problem not found' });
        if (problem.user.toString() !== userId.toString()) return res.status(403).json({ message: 'Not authorized' });

        await Problem.findByIdAndDelete(id);
        res.status(200).json({ message: 'Problem deleted successfully' });
    } catch (error) {
        console.error('Error deleting problem:', error);
        res.status(500).json({ message: 'Error deleting problem', error });
    }
});

// routes/problems.js
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search) {
      const regex = new RegExp(search, 'i'); // case-insensitive
      query = {
        $or: [
          { description: regex },
          { tags: { $in: [regex] } }
        ]
      };
    }

    const problems = await Problem.find(query);
    res.json(problems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});


module.exports = router;
