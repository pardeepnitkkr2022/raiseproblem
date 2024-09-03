const express = require('express');
const Problem = require('../models/Problem');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create a new problem
router.post('/', authMiddleware, async (req, res) => {
    const { title, description, tags } = req.body;

    try {
        const newProblem = new Problem({
            title,
            description,
            tags,
            user: req.user.id,
        });

        const savedProblem = await newProblem.save();
        res.status(201).json(savedProblem);
    } catch (err) {
        res.status(500).json({ message: 'Error creating problem' });
    }
});

// Get all problems
// router.get('/', async (req, res) => {
//     try {
//         const problems = await Problem.find().populate('user', 'name');
//         res.status(200).json(problems);
//     } catch (err) {
//         res.status(500).json({ message: 'Error fetching problems' });
//     }
// });


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

        problem.comments.push({ comment, user: req.user.id });
       
        await problem.save();

        res.status(201).json(problem);
    } catch (err) {
        res.status(500).json({ message: 'Error adding comment' });
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
router.get('/',  async (req, res) => {
    try {
        const { tag } = req.query;
        const filter = tag ? { tags: { $in: tag.split(',') } } : {};
        const problems = await Problem.find(filter);
        res.json(problems);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch problems' });
    }
});

module.exports = router;
