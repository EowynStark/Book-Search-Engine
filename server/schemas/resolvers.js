const { User } = require('../models');
const {signToken, AuthenticationError} = require('../utils/auth');

const resolvers = {
    Query: {
        // get all users
        // get a single user by either their id or their username
        getSingleUser: async(_, { id }, context) => {
            try {
                const foundUser = await User.findById(id);
                if (!foundUser) {
                    throw new AuthenticationError('User not found!');
                }
                return foundUser;
            } catch (err) {
                console.log(err);
                throw new AuthenticationError('Something went wrong!');
            }
        }
    }, 
    Mutation: {
        // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
        createUser: async(_, {username, email, password}, context) => {
            try {
                const user = await User.create({username, email, password});
                const token = signToken(user);
                return {token, user};
            } catch (err) {
                console.log(err);
                throw new AuthenticationError('Something went wrong!');
            }
    },
    // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
    login: async(_, {body}, context) => {
        try {
            const user = await User.findOne({$or: [{username: body.username}, {email: body.email}]});
            if (!user) {
                throw new AuthenticationError('No user found with this email address!');
            }
            const correctPw = await user.isCorrectPassword(body.password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect password!');
            }
            const token = signToken(user);
            return {token, user};
        } catch (err) {
            console.log(err);
            throw new AuthenticationError('Something went wrong!');
        }
    }, 
    // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
    saveBook: async(_, {user, body}, context) => {
        try {
            const updatedUser = await User.findOneAndUpdate(
                {_id: user._id},
                {$addToSet: {savedBooks: body}},
                {new: true, runValidators: true}
            );
            return updatedUser;
        } catch (err) {
            console.log(err);
            throw new AuthenticationError('Something went wrong!');
        }
    }, 
    // remove a book from `savedBooks`
    deleteBook: async(_, {bookId}, context) => {
        try {
            const {user} = context;
            const updatedUser = await User.findOneAndUpdate(
                {_id: user._id},
                {$pull: {savedBooks: {bookId}}},
                {new: true}
            );
            if (!updatedUser) {
                throw new AuthenticationError('No user found with this id!');
            }
            return updatedUser;
        } catch (err) {
            console.log(err);
            throw new AuthenticationError('Something went wrong!');
        }
    }
    }
};

module.exports = resolvers;