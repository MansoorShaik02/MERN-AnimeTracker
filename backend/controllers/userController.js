const User = require('../models/User');
const Anime = require('../models/Anime');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Comment = require('../models/Comment');
const sendVerificationEmail = require('../sendVerificationEmail');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const addComment = async (req, res) => {
    const { animeId, text } = req.body;
    try {
        const comment = new Comment({
            animeId,
            user: req.user.id,
            text
        });
        await comment.save();
        res.status(201).json(comment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const getComments = async (req, res) => {
    const { animeId } = req.params;
    try {
        const comments = await Comment.find({ animeId }).populate('user', ['username']);
        res.json(comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Register a new user
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    console.log('Request Body:', req.body);

    if (!email) {
        return res.status(400).json({ msg: 'Please enter email fields' });
    }
    if (!username) {
        return res.status(400).json({ msg: 'Please enter username field' });
    }

    if (!password) {
        return res.status(400).json({ msg: 'Please enter password fields' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            if (!user.isVerified) {
                sendVerificationEmail(user, req, res);
                return res.status(200).json({ msg: 'Email already registered but not verified. Verification email resent.' });
            }
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ username, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        sendVerificationEmail(user, req, res);

        const payload = { user: { id: user.id } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const verifyEmail = async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });
        if (!user) return res.status(400).json({ msg: 'Invalid token' });

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({ msg: 'Email verified successfully!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials no user' });

        if (!user.isVerified) return res.status(400).json({ msg: 'Your email is not verified. Please check your email to verify your account.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials no match' });

        const payload = { user: { id: user.id } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


const addToWatchlist = async (req, res) => {
    const { mal_id, title, image_url } = req.body;

    try {
        const user = await User.findById(req.user.id)
            .populate('watchlist')
            .populate('droplist')
            .populate('watchedlist');

        // Check if the anime is already in any list
        if (user.watchlist.some(animeItem => animeItem.mal_id === mal_id) ||
            user.droplist.some(animeItem => animeItem.mal_id === mal_id) ||
            user.watchedlist.some(animeItem => animeItem.mal_id === mal_id)) {
            return res.status(400).json({ msg: 'Anime already added to a list' });
        }

        let anime = await Anime.findOne({ mal_id });
        if (!anime) {
            anime = new Anime({ mal_id, title, image_url });
            await anime.save();
        }

        user.watchlist.push(anime);
        await user.save();

        res.json(user.watchlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const addToDroplist = async (req, res) => {
    const { mal_id, title, image_url } = req.body;

    try {
        const user = await User.findById(req.user.id)
            .populate('watchlist')
            .populate('droplist')
            .populate('watchedlist');

        // Check if the anime is already in any list
        if (user.watchlist.some(animeItem => animeItem.mal_id === mal_id) ||
            user.droplist.some(animeItem => animeItem.mal_id === mal_id) ||
            user.watchedlist.some(animeItem => animeItem.mal_id === mal_id)) {
            return res.status(400).json({ msg: 'Anime already added to a list' });
        }

        let anime = await Anime.findOne({ mal_id });
        if (!anime) {
            anime = new Anime({ mal_id, title, image_url });
            await anime.save();
        }

        user.droplist.push(anime);
        await user.save();

        res.json(user.droplist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const deletedatadb = async (req, res) => {
    const { listType, id } = req.params;
    const validLists = ['watchlist', 'watchedlist', 'droplist'];

    if (!validLists.includes(listType)) {
        return res.status(400).json({ msg: 'Invalid list type' });
    }

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user[listType] = user[listType].filter(anime => anime.mal_id !== parseInt(id));

        await user.save();
        res.status(200).json(user[listType]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const addToWatchedlist = async (req, res) => {
    const { mal_id, title, image_url } = req.body;

    try {
        const user = await User.findById(req.user.id)
            .populate('watchlist')
            .populate('droplist')
            .populate('watchedlist');

        // Check if the anime is already in any list
        if (user.watchlist.some(animeItem => animeItem.mal_id === mal_id) ||
            user.droplist.some(animeItem => animeItem.mal_id === mal_id) ||
            user.watchedlist.some(animeItem => animeItem.mal_id === mal_id)) {
            return res.status(400).json({ msg: 'Anime already added to a list' });
        }

        let anime = await Anime.findOne({ mal_id });
        if (!anime) {
            anime = new Anime({ mal_id, title, image_url });
            await anime.save();
        }

        user.watchedlist.push(anime);
        await user.save();

        res.json(user.watchedlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
const forgetpassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Email does not exist' });
        }

        const token = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();
        console.log('Email:', process.env.EMAIL);
        console.log('Email Password:', process.env.EMAIL_PASSWORD);
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }

        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Password Reset',
            text: `Please click on the following link, or paste it into your browser to reset your password: http://localhost:3000/reset-password\/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).json({ msg: 'Error sending email' });
            }
            res.status(200).json({ msg: 'Password reset email sent' });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Fetch user's watchlist and watched list
const getUserLists = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('watchlist watchedlist droplist');
        res.json({ watchlist: user.watchlist, watchedlist: user.watchedlist, username: user.username, email: user.email, droplist: user.droplist });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const resetpassword = async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ msg: 'Password reset token is invalid or has expired' });
        }

        const { password } = req.body;

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ msg: 'Password has been reset' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}


const deleteFromList = async (req, res) => {
    const { listType, animeId } = req.params;
    const validLists = ['watchlist', 'watchedlist', 'droplist'];

    if (!validLists.includes(listType)) {
        return res.status(400).json({ msg: 'Invalid list type' });
    }

    try {
        const user = await User.findById(req.user.id).populate(listType);
        const listIndex = user[listType].findIndex(animeItem => animeItem._id.toString() === animeId);

        if (listIndex === -1) {
            return res.status(404).json({ msg: 'Anime not found in the list' });
        }

        user[listType].splice(listIndex, 1); // Remove anime from list
        await user.save();

        res.status(200).json({ msg: 'Anime removed from list', list: user[listType] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = { registerUser, deleteFromList, deletedatadb, addToDroplist, loginUser, addToWatchlist, addToWatchedlist, resetpassword, getUserLists, addComment, getComments, verifyEmail, forgetpassword };
