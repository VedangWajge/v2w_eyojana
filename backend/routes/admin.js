const express = require("express");
const Admin = require("../models/Admin");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchAdmin = require('../middleware/fetchAdmin'); // Import the fetchAdmin middleware
const router = express.Router();
const JWT_SECRET = "Shravaniisagood$girl"; // Secret key for JWT signing

// Middleware to parse JSON bodies
router.use(express.json());

// Route 1: Create an admin using: POST "/api/admin/createadmin"
router.post(
  "/createadmin",
  [
    body("adminname", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a password of at least 7 characters").isLength({
      min: 7,
    }),
    body("phone_number", "Enter a valid 10-digit phone number").isLength({
      min: 10,
      max: 10,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { adminname, email, password, phone_number } = req.body;

    try {
      let admin = await Admin.findOne({ email });
      if (admin) {
        return res.status(400).json({ errors: [{ msg: "Admin already exists" }] });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);

      admin = new Admin({
        adminname,
        email,
        password: secPass,
        phone_number,
      });

      await admin.save();

      const data = {
        admin: {
          id: admin.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// Route 2: Authenticate an admin using: POST "/api/admin/login"
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
      }

      const passwordCompare = await bcrypt.compare(password, admin.password);
      if (!passwordCompare) {
        return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
      }

      const data = {
        admin: {
          id: admin.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// Route 3: Get admin details using POST "/api/admin/getadmin". Requires admin authentication
router.get('/getadmin', fetchAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json(admin);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;
