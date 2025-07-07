
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('passport');
const crypto = require('crypto');
const sendEmail =require('../utils/sendEmail');
const router = express.Router();

const TEMP_USERS = {}; 

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    TEMP_USERS[email] = { name, email, password: hashed, verificationCode };

    await sendEmail(email, 'Verify Your Email', `<p>Your verification code is <b>${verificationCode}</b></p>`);

    res.status(201).json({ message: 'Verification email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/verify-email', async (req, res) => {
  const { email, code } = req.body;
  try {
    const tempUser = TEMP_USERS[email];
    if (!tempUser || tempUser.verificationCode !== code)
      return res.status(400).json({ message: 'Invalid code or email' });

    const user = new User({ name: tempUser.name, email, password: tempUser.password, isVerified: true });
    await user.save();

    delete TEMP_USERS[email];

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const resetCode = crypto.randomInt(100000, 999999).toString();
    user.resetCode = resetCode;
    await user.save();

    await sendEmail(email, 'Reset Password', `<p>Your reset code is <b>${resetCode}</b></p>`);
    res.status(200).json({ message: 'Reset code sent' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.resetCode !== code)
      return res.status(400).json({ message: 'Invalid reset code' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetCode = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});



router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  async (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  }
);

module.exports = router;
