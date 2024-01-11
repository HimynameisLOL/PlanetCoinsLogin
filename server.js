// server.js

const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection string (replace placeholders with your actual values)
const uri = 'mongodb+srv://admin:pass@cluster0.2fgjzjt.mongodb.net/?retryWrites=true&w=majority';

// Connect to MongoDB
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
  } else {
    console.log('Connected to MongoDB');

    // Define routes and implement logic here

    // Start the server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  }
});
