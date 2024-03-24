const db = require('../config/connection');
const { User, Book } = require('../models');
const userSeeds = require('./userSeeds.json');
const bookSeeds = require('./bookSeeds.json');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
    try {
        await cleanDB('User', 'users');
        await cleanDB('Book', 'books');
        await User.create(userSeeds);
        await Book.create(bookSeeds);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('Seeding complete!');
    process.exit(0);
});