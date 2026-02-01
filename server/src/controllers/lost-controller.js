const LostItem = require('../models/lostitem');

// Get all lost items
exports.getAllLostItems = async (req, res) => {
  try {
    const lostItems = await LostItem.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(lostItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lost items', error: error.message });
  }
};

// Get lost items by user
exports.getUserLostItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const lostItems = await LostItem.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json(lostItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user lost items', error: error.message });
  }
};

// Get single lost item by ID
exports.getLostItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const lostItem = await LostItem.findById(id)
      .populate('userId', 'name email phone');

    if (!lostItem) {
      return res.status(404).json({ message: 'Lost item not found' });
    }

    res.status(200).json(lostItem);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lost item', error: error.message });
  }
};

// Create new lost item
exports.createLostItem = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    console.log('Request user:', req.user);

    // Process form data
    const lostItemData = {
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      dateLost: req.body.dateLost,
      timeLost: req.body.timeLost || null,
      location: req.body.location,
      reward: req.body.reward === 'yes' || req.body.reward === true,
      rewardAmount: req.body.value ? Number(req.body.value) : null,
      userId: req.user._id, // From auth middleware
      images: req.files ? req.files.map(file => file.path) : [],
      contactEmail: req.body.contactEmail || req.user.email,
      contactPhone: req.body.contactPhone || null,
    };

    console.log('Processed lostItemData:', lostItemData);

    const lostItem = new LostItem(lostItemData);
    await lostItem.save();

    res.status(201).json({
      message: 'Lost item reported successfully',
      lostItem,
    });
  } catch (error) {
    console.error('Error creating lost item:', error);
    res.status(500).json({ msg: 'Error creating lost item', error: error.message });
  }
};

// Update lost item
exports.updateLostItem = async (req, res) => {
  try {
    const { id } = req.params;
    const lostItem = await LostItem.findById(id);

    if (!lostItem) {
      return res.status(404).json({ message: 'Lost item not found' });
    }

    // Check if user owns this item
    if (lostItem.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    Object.assign(lostItem, req.body);

    if (req.files && req.files.length > 0) {
      lostItem.images = req.files.map(file => file.path);
    }

    await lostItem.save();

    res.status(200).json({
      message: 'Lost item updated successfully',
      lostItem,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating lost item', error: error.message });
  }
};

// Delete lost item
exports.deleteLostItem = async (req, res) => {
  try {
    const { id } = req.params;
    const lostItem = await LostItem.findById(id);

    if (!lostItem) {
      return res.status(404).json({ message: 'Lost item not found' });
    }

    // Check if user owns this item
    if (lostItem.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await LostItem.findByIdAndDelete(id);

    res.status(200).json({ message: 'Lost item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lost item', error: error.message });
  }
};

// Mark as found
exports.markAsFound = async (req, res) => {
  try {
    const { id } = req.params;
    const lostItem = await LostItem.findById(id);

    if (!lostItem) {
      return res.status(404).json({ message: 'Lost item not found' });
    }

    lostItem.status = 'found';
    await lostItem.save();

    res.status(200).json({
      message: 'Item marked as found',
      lostItem,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};

// Search lost items
exports.searchLostItems = async (req, res) => {
  try {
    const { query, category, location } = req.query;

    let filter = {};

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    const lostItems = await LostItem.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(lostItems);
  } catch (error) {
    res.status(500).json({ message: 'Error searching lost items', error: error.message });
  }
};
