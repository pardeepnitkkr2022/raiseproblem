// const express = require('express');
// const Problem = require('../models/Problem');
// const User=require('../models/User');

// const authMiddleware = require('../middleware/auth');

// const router = express.Router();
// router.get('/profile', authMiddleware, async (req, res) => {
//     try {
//         const user = await User.findById(req.user.id);
//         const problems = await Problem.find({ user: req.user.id });
        
//         res.json({ user, problems });
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });
const express = require('express');
const Problem = require('../models/Problem');
const User=require('../models/User');

const auth = require('../middleware/auth');

const router = express.Router();

const multer = require('multer');
const path = require('path');
// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
  });
const upload = multer({ storage });






router.get('/profile', auth, async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            const problems = await Problem.find({ user: req.user.id });
            
            res.json({ user,
                 problems ,
                 pictureUrl:user.pictureUrl});
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }); 
router.post('/picture', auth,[
    upload.single('profilePicture'),
    async (req, res) => {
      try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
  
        user.pictureUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        await user.save();
  
        res.json({ pictureUrl:user.pictureUrl });
      } catch (err) {
        res.status(500).json({ msg: 'Server error' });
      }
    }
  ]);

module.exports = router;
