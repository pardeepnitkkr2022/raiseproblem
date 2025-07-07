const express = require('express');
const Problem = require('../models/Problem');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();


const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const problems = await Problem.find({ user: req.user.id });

    res.json({
      user,
      problems,
      pictureUrl: user.pictureUrl
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/picture', auth, async (req, res) => {
  try {
    const { pictureUrl } = req.body;
    if (!pictureUrl) return res.status(400).json({ msg: 'Picture URL is required' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.pictureUrl = pictureUrl;
    await user.save();

    res.json({ pictureUrl: user.pictureUrl });
  } catch (err) {
    console.error('Error saving picture URL:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
