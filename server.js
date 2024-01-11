const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MongoDB connection string
const mongoUri = 'mongodb+srv://admin:pass@cluster0.2fgjzjt.mongodb.net/planetcoins?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

// Create a mongoose schema and model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  balance: Number,
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());

// Validate user credentials
app.get('/validate', async (req, res) => {
  const { username, password } = req.query;

  try {
    const user = await User.findOne({ username, password });
    res.json(user);
  } catch (error) {
    console.error('Error validating user:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
