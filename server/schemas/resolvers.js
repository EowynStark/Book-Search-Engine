const {User, Thought} = require('../models');
const {signToken, AuthenticationError} = require('../utils/auth');

const resolvers = {
    Query: {
        getSingleUser: async(_, {user, params}, context) => {
            try {
                const foundUser = await User.findOne({
                    $or: [{_id: user ? user._id : params.id}, {username: params.username}],
                });
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
        createUser: async(_, {body}, context) => {
            try {
                const user = await User.create(body);
                const token = signToken(user);
                return {token, user};
            } catch (err) {
                console.log(err);
                throw new AuthenticationError('Something went wrong!');
            }
    },
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
    deleteBook: async(_, {user, params}, context) => {
        try {
            const updatedUser = await User.findOneAndUpdate(
                {_id: user._id},
                {$pull: {savedBooks: {bookId: params.bookId}}},
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