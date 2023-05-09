const mongoose = require('mongoose');


const url = process.env.MONGODB_URL;
const dbName = 'oauth'


mongoose.connect(url, {dbName, useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected successfully to MongoDB'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

module.exports = mongoose;