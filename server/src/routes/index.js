const express = require('express');
const router = express.Router();

// Import route modules
const userRouter = require('./user-route');
const lostRouter = require('./lost-routes');
const foundRouter = require('./found-routes');
const itemRouter = require('./item-routes');

// Mount routes
router.use('/user', userRouter);
router.use('/lost', lostRouter);
router.use('/found', foundRouter);
router.use('/items', itemRouter); // Keep for backward compatibility

module.exports = router;
