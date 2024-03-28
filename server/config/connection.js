const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://eowynstark:harley2008forest@cluster0.ukmdd2z.mongodb.net/googlebooks?retryWrites=true&w=majority&appName=Cluster0');

module.exports = mongoose.connection;
