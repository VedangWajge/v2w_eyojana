const mongoose = require('mongoose');
const { Schema } = mongoose;
const mime = require('mime-types');

const SchemeDocumentsSchema = new Schema({
  scheme_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scheme',
    required: true
  },
  document_name: {
    type: String,
    maxlength: 255
  },
  document: {
    type: Buffer,
    required: true,
    validate: {
      validator: function(value) {
        const mimeType = mime.lookup(this.document_name);  
        return mimeType === 'application/pdf' || mimeType === 'image/png';  // Allow only PDF or PNG
      },
      message: 'Uploaded file must be a PDF or PNG.'
    }
  }
});

module.exports = mongoose.model('SchemeDocuments', SchemeDocumentsSchema);
