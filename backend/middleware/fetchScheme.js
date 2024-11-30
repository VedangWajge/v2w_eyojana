const multer = require('multer');
const path = require('path');

// Define storage for the uploaded files
const storage = multer.memoryStorage();

// Filter function to validate file types
const fileFilter = (req, file, cb) => {
  const mimeType = file.mimetype;

  if (mimeType === 'application/pdf' || mimeType === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and PNG files are allowed!'), false);
  }
};

// Initialize multer with storage and file filter
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
