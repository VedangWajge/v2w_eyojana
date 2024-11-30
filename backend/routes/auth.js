const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post(
  "/createuser",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
    check("username", "Username is required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, username, phone_number, state, gender } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        email,
        password,
        username,
        phone_number,
        state,
        gender,
      });

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Create and return JWT token
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "yourSecretKey", 
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          res.json({ authToken: token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// POST: Login
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // Create and return JWT token
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "yourSecretKey", // Replace with your secret key
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          res.json({ authToken: token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.get('/email', async (req, res) => {
  const { email } = req.query; // Get email from query
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Example API endpoint in your Express app
router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    console.log(user)
    if (user) {
      return res.json({ user_id: user._id }); // Return the user_id
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/profile/:email', async (req, res) => {
  const email = req.params.email;

  try {
    // Find user by email
    const user = await User.findOne({ email: email });
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send back user data (exclude password or sensitive information)
    res.json({
      username: user.username,
      email: user.email,
      phoneNo: user.phone_number,
      gender: user.gender,
      state: user.state,
      photo: user.photo
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/update/:email', async (req, res) => {
  const { email } = req.params;
  const { username, phoneNo, gender, state } = req.body;

  try {
    // Find the user by email and update their details
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { username, phoneNo, gender, state },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser); // Send the updated user data back to the frontend
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
