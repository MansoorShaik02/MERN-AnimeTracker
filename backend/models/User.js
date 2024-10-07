const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Anime' }],
    watchedlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Anime' }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
