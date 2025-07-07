const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    pictureUrl: { type: String },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
verificationCode: String,
resetCode: String,

});

module.exports = mongoose.model('User', UserSchema);
