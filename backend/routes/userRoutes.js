const express = require('express');
const router = express.Router();
const { registerUser, loginUser, addToWatchlist, addToWatchedlist, getUserLists } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware')

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/watchlist', verifyToken, addToWatchlist);
router.post('/watchedlist', verifyToken, addToWatchedlist);
router.get('/userlists', verifyToken, getUserLists);

module.exports = router;
