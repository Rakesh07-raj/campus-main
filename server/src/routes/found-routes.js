const express = require('express');
const router = express.Router();
const foundController = require('../controllers/found-controller');
const handleCheckAuthentication = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Public routes - Anyone can view
router.get('/', foundController.getAllFoundItems);
router.get('/search', foundController.searchFoundItems);
router.get('/:id', foundController.getFoundItemById);

// Protected routes - Require authentication
router.post('/', handleCheckAuthentication, upload.array('images', 5), foundController.createFoundItem);
router.put('/:id', handleCheckAuthentication, upload.array('images', 5), foundController.updateFoundItem);
router.delete('/:id', handleCheckAuthentication, foundController.deleteFoundItem);
router.patch('/:id/claim', handleCheckAuthentication, foundController.claimFoundItem);
router.patch('/:id/mark-returned', handleCheckAuthentication, foundController.markAsReturned);

// User-specific routes
router.get('/user/:userId', handleCheckAuthentication, foundController.getUserFoundItems);

module.exports = router;
