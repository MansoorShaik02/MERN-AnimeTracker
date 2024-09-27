const User = require('../models/User');
const Anime = require('../models/Anime');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ username, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id } };

        jwt.sign(payload, '60D2DB614461D5182989B338489C82FFA92ECBB3C3FA68D2AE9F5B32DD942541', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
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

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials no match' });

        const payload = { user: { id: user.id } };

        jwt.sign(payload, '60D2DB614461D5182989B338489C82FFA92ECBB3C3FA68D2AE9F5B32DD942541', { expiresIn: '1h' }, (err, token) => {
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
        const user = await User.findById(req.user.id).populate('watchlist');
        let anime = await Anime.findOne({ mal_id });

        if (!anime) {
            anime = new Anime({ mal_id, title, image_url });
            await anime.save();
        }

        if (!user.watchlist.some(animeItem => animeItem._id.equals(anime._id))) {
            user.watchlist.push(anime);
            await user.save();
        }

        res.json(user.watchlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


// Add anime to watched list
const addToWatchedlist = async (req, res) => {
    const { mal_id, title, image_url } = req.body;

    try {
        const user = await User.findById(req.user.id).populate('watchedlist');
        let anime = await Anime.findOne({ mal_id });

        if (!anime) {
            anime = new Anime({ mal_id, title, image_url });
            await anime.save();
        }

        if (!user.watchedlist.some(animeItem => animeItem._id.equals(anime._id))) {
            user.watchedlist.push(anime);
            await user.save();
        }

        res.json(user.watchedlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
// Fetch user's watchlist and watched list
const getUserLists = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('watchlist watchedlist');
        res.json({ watchlist: user.watchlist, watchedlist: user.watchedlist, username: user.username, email: user.email });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = { registerUser, loginUser, addToWatchlist, addToWatchedlist, getUserLists };
