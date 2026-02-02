const express = require('express');
const upload = require('../middlewares/upload');
const { createItem, getItems, claimItem } = require('../controllers/item-controller');

const router = express.Router();

router.post('/report', upload.single('photo'), createItem);
router.get('/', getItems);
router.put('/:id/claim', claimItem);

module.exports = router;
