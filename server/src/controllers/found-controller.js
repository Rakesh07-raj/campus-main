const FoundItem = require('../models/Founditem');

// Get all found items
exports.getAllFoundItems = async (req, res) => {
  try {
    const foundItems = await FoundItem.find()
      .populate('userId', 'name email')
      .populate('claimedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(foundItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching found items', error: error.message });
  }
};

// Get found items by user
exports.getUserFoundItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const foundItems = await FoundItem.find({ userId })
      .populate('claimedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(foundItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user found items', error: error.message });
  }
};

// Get single found item by ID
exports.getFoundItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const foundItem = await FoundItem.findById(id)
      .populate('userId', 'name email phone')
      .populate('claimedBy', 'name email phone');

    if (!foundItem) {
      return res.status(404).json({ message: 'Found item not found' });
    }

    res.status(200).json(foundItem);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching found item', error: error.message });
  }
};

// Create new found item
exports.createFoundItem = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    console.log('Request user:', req.user);

    // Process form data
    const foundItemData = {
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      dateFound: req.body.dateFound,
      timeFound: req.body.timeFound || null,
      location: req.body.location,
      condition: req.body.condition || 'good',
      userId: req.user._id, // From auth middleware (finder)
      images: req.files ? req.files.map(file => file.path) : [],
      contactEmail: req.body.email || req.user.email,
      contactPhone: req.body.phone || null,
      handoverLocation: req.body.handoverLocation || null,
    };

    console.log('Processed foundItemData:', foundItemData);

    const foundItem = new FoundItem(foundItemData);
    await foundItem.save();

    res.status(201).json({
      message: 'Found item reported successfully',
      foundItem,
    });
  } catch (error) {
    console.error('Error creating found item:', error);
    res.status(500).json({ msg: 'Error creating found item', error: error.message });
  }
};

// Update found item
exports.updateFoundItem = async (req, res) => {
  try {
    const { id } = req.params;
    const foundItem = await FoundItem.findById(id);

    if (!foundItem) {
      return res.status(404).json({ message: 'Found item not found' });
    }

    // Check if user owns this item
    if (foundItem.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    Object.assign(foundItem, req.body);

    if (req.files && req.files.length > 0) {
      foundItem.images = req.files.map(file => file.path);
    }

    await foundItem.save();

    res.status(200).json({
      message: 'Found item updated successfully',
      foundItem,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating found item', error: error.message });
  }
};

// Delete found item
exports.deleteFoundItem = async (req, res) => {
  try {
    const { id } = req.params;
    const foundItem = await FoundItem.findById(id);

    if (!foundItem) {
      return res.status(404).json({ message: 'Found item not found' });
    }

    // Check if user owns this item
    if (foundItem.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await FoundItem.findByIdAndDelete(id);

    res.status(200).json({ message: 'Found item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting found item', error: error.message });
  }
};

// Claim found item
exports.claimFoundItem = async (req, res) => {
  try {
    const { id } = req.params;
    const foundItem = await FoundItem.findById(id);

    if (!foundItem) {
      return res.status(404).json({ message: 'Found item not found' });
    }

    if (foundItem.status !== 'available') {
      return res.status(400).json({ message: 'Item is not available for claiming' });
    }

    foundItem.claimedBy = req.user._id;
    foundItem.status = 'claimed';
    await foundItem.save();

    res.status(200).json({
      message: 'Item claimed successfully',
      foundItem,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error claiming item', error: error.message });
  }
};

// Mark as returned
exports.markAsReturned = async (req, res) => {
  try {
    const { id } = req.params;
    const foundItem = await FoundItem.findById(id);

    if (!foundItem) {
      return res.status(404).json({ message: 'Found item not found' });
    }

    // Only the finder can mark as returned
    if (foundItem.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    foundItem.status = 'returned';
    await foundItem.save();

    res.status(200).json({
      message: 'Item marked as returned',
      foundItem,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};

// Search found items
exports.searchFoundItems = async (req, res) => {
  try {
    const { query, category, location, status } = req.query;

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

    if (status) {
      filter.status = status;
    } else {
      // By default, only show available items
      filter.status = 'available';
    }

    const foundItems = await FoundItem.find(filter)
      .populate('userId', 'name email')
      .populate('claimedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(foundItems);
  } catch (error) {
    res.status(500).json({ message: 'Error searching found items', error: error.message });
  }
};
