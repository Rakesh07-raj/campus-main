const Item = require('../models/Item');

exports.createItem = async (req, res) => {
    try {
        const { title, description, category, location, dateLost } = req.body;

        // Handle image upload (assuming single file for now or array logic handled by middleware/parsing)
        let images = [];
        if (req.file) {
            images.push(req.file.path);
        }

        // Assuming req.user is populated by auth middleware
        const lost_userid = req.user ? req.user.id : null;

        // Fallback for development if auth not fully ready
        // const lost_userid = req.body.userId || "temp_user_id";

        if (!lost_userid) {
            // Ideally return 401 if not auth, but for now check if passed in body
            // return res.status(401).json({ message: "User must be logged in" });
        }

        const newItem = new Item({
            title,
            description,
            category,
            location,
            dateLost: dateLost || new Date(),
            images,
            lost_userid: lost_userid || "65bb742969960251341c2100", // Temporary hardcode if auth missing
            status: 'reported'
        });

        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        console.error("Error creating item:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.getItems = async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.claimItem = async (req, res) => {
    try {
        const { id } = req.params;
        const founder_user_id = req.user ? req.user.id : "65bb742969960251341c2100"; // Temp fallback

        const item = await Item.findByIdAndUpdate(
            id,
            { founder_user_id, status: 'claimed' },
            { new: true }
        );

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
