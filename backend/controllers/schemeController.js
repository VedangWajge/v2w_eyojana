// controllers/schemeController.js

const Scheme = require('../models/Scheme');

// Controller for creating or updating a scheme
exports.createOrUpdateScheme = async (req, res) => {
  try {
    const { schemename, user_id, email, status, category } = req.body;

    const documents = req.files.map(file => ({
      document_name: file.originalname,
      file_path: file.path
    }));

    const schemeData = {
      schemename,
      user_id,
      email,
      status,
      category,
      documents
    };

    // Find existing application by user and scheme name, or create a new one
    let scheme = await Scheme.findOne({ schemename, user_id });
    if (scheme) {
      // Update existing application
      scheme = await Scheme.findOneAndUpdate({ schemename, user_id }, schemeData, { new: true });
      res.status(200).json({ message: "Application updated successfully", scheme });
    } else {
      // Create new application
      const newScheme = new Scheme(schemeData);
      await newScheme.save();
      res.status(201).json({ message: "Application submitted successfully", newScheme });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
