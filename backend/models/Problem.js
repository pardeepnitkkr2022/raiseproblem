const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: {type:String},
    comments: [{ comment: String, user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    votedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Problem', ProblemSchema);
