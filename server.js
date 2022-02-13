require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('./routes'));

// attempt to connect to MongoDB
const connection = mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/thoughtbook',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

if (connection) {
  app.listen(PORT, () =>
    console.log(`Server listening at http://localhost:${PORT}`)
  );
} else {
  console.log('Connection to the database failed.');
}
