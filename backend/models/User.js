const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100
  },
  password: {
    type: String,
    required: true,
    maxlength: 255
  },
  phone_number: {
    type: String,
    required: true,
    match: /^[7-9][0-9]{9}$/  
  },
  state: {
    type: String,
    required: true,
    maxlength: 50
  },
  gender: {
    type: String,
    required: true,
    maxlength: 25
  }
});

module.exports = mongoose.model('User', UserSchema);
