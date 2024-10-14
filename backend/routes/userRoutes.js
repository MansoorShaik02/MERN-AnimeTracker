const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { registerUser, loginUser, addToWatchlist, addToDroplist, deletedatadb, addToWatchedlist, getUserLists, addComment, getComments, deleteFromList, verifyEmail, forgetpassword, resetpassword } = require('../controllers/userController');
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
// router.delete('/:listType/:id', verifyToken, deletedatadb)
router.delete('/list/:listType/:animeId', verifyToken, deleteFromList);
const auth = require('../middleware/authMiddleware');



module.exports = router;
