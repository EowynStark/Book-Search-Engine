const db = require('../config/connection');
const { User } = require('../models');
const userSeeds = require('./userSeeds.json');
const cleanDB = require('./cleanDB');

const seedDB = async () => {
    try {
      // Clean the database
      await User.deleteMany({});
      console.log('Database cleaned.');
      // Seed the database
      const userData = await User.insertMany(userSeeds);
      console.log('Database seeded.');
      } catch (err) {
      console.error('Error seeding database:', err);
      process.exit(1);
    }
  };
  
  module.exports = seedDB;