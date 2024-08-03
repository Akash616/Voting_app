const mongoose = require('mongoose');
require('dotenv').config();

// Define the MongoDB connection URL
//const mongoURL = process.env.MONGODB_URL_LOCAL // Replace 'mydatabase' with your database name
const mongoURL = process.env.MONGODB_URL;

// Set up MongoDB connection
mongoose.connect(mongoURL)
    .then(() => console.log('Connected to MongoDB server'))
    .catch(err => console.error('MongoDB connection error:', err));

// Get the default connection
const db = mongoose.connection;

// Define event listeners for database connection
db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Handle process termination and gracefully close the MongoDB connection
process.on('SIGINT', async () => {
    await mongoose.disconnect();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
});

// Export the database connection
module.exports = db;
