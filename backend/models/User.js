const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Anime' }],
    watchedlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Anime' }],
    droplist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Anime' }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
