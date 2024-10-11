const express = require('express');
const router = express.Router();
const { registerUser, loginUser, addToWatchlist, addToDroplist, addToWatchedlist, getUserLists, addComment, getComments, verifyEmail, forgetpassword, resetpassword } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware')

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify-email/:token', verifyEmail);

router.post('/watchlist', verifyToken, addToWatchlist);
router.post('/watchedlist', verifyToken, addToWatchedlist);
router.post('/droplist', verifyToken, addToDroplist);
router.get('/userlists', verifyToken, getUserLists);
router.post('/comments', verifyToken, addComment);
router.get('/comments/:animeId', getComments);
router.post('/reset-password/:token', resetpassword)
router.post('/forgot-password', forgetpassword)



module.exports = router;
