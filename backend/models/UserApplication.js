const mongoose = require('mongoose');

const userApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  scheme: { type: String, required: true },
  status: { type: String, enum: ['accepted', 'rejected', 'pending'], required: true }
});

const UserApplication = mongoose.model('UserApplication', userApplicationSchema);

module.exports = UserApplication;
