const express = require('express');
const router = express.Router();
const lostController = require('../controllers/lost-controller');
const handleCheckAuthentication = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Public routes
router.get('/', lostController.getAllLostItems);
router.get('/search', lostController.searchLostItems);

// User-specific routes (MORE SPECIFIC)
router.get('/user/:userId', handleCheckAuthentication, lostController.getUserLostItems);

// Single item route (LEAST SPECIFIC)
router.get('/:id', lostController.getLostItemById);

// Protected routes
router.post(
    '/',
    handleCheckAuthentication,
    upload.array('images', 5),
    lostController.createLostItem
);

router.put(
    '/:id',
    handleCheckAuthentication,
    upload.array('images', 5),
    lostController.updateLostItem
);

router.delete(
    '/:id',
    handleCheckAuthentication,
    lostController.deleteLostItem
);

router.patch(
    '/:id/mark-found',
    handleCheckAuthentication,
    lostController.markAsFound
);

module.exports = router;
