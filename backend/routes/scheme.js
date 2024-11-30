const express = require('express');
const router = express.Router();
const Scheme = require('../models/Scheme');
const upload = require('../middleware/fetchScheme');
router.post('/', upload.array('documents'), async (req, res) => {
  try {
    const { schemename, user_id, email, status, category } = req.body;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No documents uploaded.' });
    }

    const documents = req.files.map((file, index) => {
      const documentName = req.body[`document_name_${index}`] || file.originalname; 
      return {
        document_name: documentName,
        document: file.buffer, 
      };
    });
    const newScheme = new Scheme({
      schemename,
      user_id,
      email,
      status,
      category,
      documents,
    });
    await newScheme.save();
    res.status(201).json(newScheme);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
router.get('/', async (req, res) => {
  try {
    const schemes = await Scheme.find();
    res.status(200).json(schemes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
router.get('/:schemeId/documents/:documentName', async (req, res) => {
  try {
    const { schemeId, documentName } = req.params;
    const scheme = await Scheme.findById(schemeId);

    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }

    const document = scheme.documents.find(doc => doc.document_name === documentName);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.set('Content-Type', 'image/jpeg'); // Adjust based on your image type (jpeg, png, etc.)
    res.send(document.document); // Send the image data
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



// PATCH route to update scheme status by email and scheme name
router.patch('/update-status/:email/:schemename', async (req, res) => {
  try {
    const { email, schemename } = req.params;
    const { status } = req.body;

    // Find the scheme by email and scheme name
    const scheme = await Scheme.findOne({ email, schemename });

    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found for the provided email and scheme name' });
    }

    // Update the scheme's status
    scheme.status = status;
    await scheme.save();

    res.status(200).json({ message: 'Status updated successfully', scheme });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:email', async (req, res) => {
  const email = req.params.email;
  console.log('Received request for email:', email);

  try {
    const schemes = await Scheme.find({ email }); 
    if (!schemes || schemes.length === 0) {
      return res.status(404).json({ message: 'No schemes found for this email.' });
    }
    res.json(schemes);
  } catch (error) {
    console.error('Error fetching schemes:', error);
    res.status(500).json({ message: 'Server error while fetching schemes.' });
  }
});

router.post('/get-scheme', async (req, res) => {
  const email = req.params.email;
  console.log('Received request for scheme:', email);

  try {
    const schemes = await Scheme.find({ email }); 
    if (!schemes || schemes.length === 0) {
      return res.status(404).json({ message: 'No applied schemes found for this email.' });
    }
    res.json(schemes);
  } catch (error) {
    console.error('Error fetching schemes:', error);
    res.status(500).json({ message: 'Server error while fetching schemes.' });
  }
});

router.post('/check', async (req, res) => {
  try {
    const { email, schemename } = req.body;

    // Find if a scheme exists for the given email and scheme name
    const scheme = await Scheme.findOne({ email, schemename });

    if (scheme) {
      return res.status(200).json({ exists: true, message: 'Scheme already applied.' });
    } else {
      return res.status(200).json({ exists: false, message: 'No existing application found.' });
    }
  } catch (error) {
    console.error('Error checking scheme:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/updatedoc/user/:userId/:schemename', async (req, res) => {
  try {
    const { userId, schemename } = req.params; // Extract both userId and schemename from the request parameters
    
    // Find applications that match the userId and schemename
    const applications = await Scheme.find({
      user_id: userId,
      schemename: schemename // Assuming 'schemename' is a field in your Scheme model
    });

    // Check if applications were found
    if (!applications.length) {
      return res.status(404).json({ message: 'No applications found for this user and scheme name.' });
    }

    // Send the applications back in the response
    res.json(applications);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Existing imports and setup...

router.get('/document/:email/:schemename/:documentName', async (req, res) => {
  try {
    const { email, schemename, documentName } = req.params;

    // Find the scheme using the provided email and scheme name
    const scheme = await Scheme.findOne({ email, schemename });

    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found for the provided email and scheme name' });
    }

    // Find the specified document within the scheme's documents
    const document = scheme.documents.find(doc => doc.document_name === documentName);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.set('Content-Type', 'image/jpeg'); // Adjust based on your image type (jpeg, png, etc.)
    res.send(document.document); // Send the image data
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Existing routes...

module.exports = router;


module.exports = router;
