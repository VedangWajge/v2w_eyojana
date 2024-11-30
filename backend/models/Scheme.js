// models/Scheme.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the embedded schema for documents
const DocumentSchema = new Schema({
  document_name: {
    type: String,
    maxlength: 255
  },
  document: {
    type: Buffer,
    required: true
  }
});

// Define the main Scheme schema
const SchemeSchema = new Schema({
  schemename: {
    type: String,
    required: true,
    maxlength: 100,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100  
  },
  status: {
    type: String,
    required: true,
    default: 'pending'
  },
  category: {
    type: String,
    required: true,
    maxlength: 255
  },
  documents: [DocumentSchema] // Embed the DocumentSchema
});

module.exports = mongoose.model('Scheme', SchemeSchema);
