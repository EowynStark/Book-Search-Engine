const { User } = require('../models');

const cleanDB = async () => {
  try {
    await User.updateMany({}, { $set: { savedBooks: [] } });
    console.log('All books removed from users.');
  } catch (err) {
    console.error('Error removing books from users:', err);
    process.exit(1);
  }
};

module.exports = cleanDB;