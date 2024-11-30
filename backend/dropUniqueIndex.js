const mongoose = require('mongoose');
require('dotenv').config(); 
async function dropUniqueIndex() {
  try {
    const mongoURI = process.env.MONGODB_URI; 
    // Connect to your MongoDB instance using Mongoose
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Get the Scheme model or directly interact with the collection
    const Scheme = mongoose.connection.collection('schemes');

    // Drop the unique index on the email field
    await Scheme.dropIndex({ email: 1 });

    console.log('Unique index on email field dropped successfully');
  } catch (error) {
    console.error('Error dropping index:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
  }
}

dropUniqueIndex();
