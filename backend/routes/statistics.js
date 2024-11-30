const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Scheme = require('../models/Scheme');

// Route to get total users
router.get('/users/count', async (req, res) => {
    try {
        const userCount = await User.countDocuments({});
        res.json({ userCount });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user count' });
    }
});

// Route to get schemes and their application count
router.get('/schemes/count', async (req, res) => {
    try {   
        const schemes = await Scheme.aggregate([
            { 
                $group: {
                    _id: "$schemename", 
                    appliedUsers: { $sum: 1 } // Counting how many users applied per scheme
                }
            }
        ]);
        res.json(schemes);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching schemes count' });
    }
});

// Route to get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}); // Fetch all user data
        res.json(users); // Return the user data
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});



router.get('/filterscheme', async (req, res) => {
    try {
        // Extract query parameters for filtering
        const { user_id, status } = req.query; // Use user_id to match frontend query

        // Build the filter object
        const filter = {};
        if (user_id) {
            filter.user_id = user_id; // Correct field name for user ID
        }
        if (status) {
            filter.status = status; // Add status to the filter if provided
        }

        // Fetch schemes with relevant details based on filters
        const schemes = await Scheme.find(filter).select('_id schemename user_id status'); // Ensure field names match your schema
        res.json(schemes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error', message: error.message }); // More informative error response
    }
});




module.exports = router;
