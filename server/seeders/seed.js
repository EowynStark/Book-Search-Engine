const db = require('../config/connection');
const { User } = require('../models');
const userSeeds = require('./userSeeds.json');
const cleanDB = require('./cleanDB');

const seedDB = async () => {
    try {
      await User.deleteMany({});
  
      for (const user of userData) {
        const newUser = await User.create(user);
        console.log(`User ${newUser.username} created with books.`);
      }
  
      console.log('Database seeded successfully.');
    } catch (err) {
      console.error('Error seeding database:', err);
      process.exit(1);
    }
  };
  
  module.exports = seedDB;