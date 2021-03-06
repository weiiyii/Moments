const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput }= require('../../util/validators');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');

// create a token for the user
// jwt.sign() take some info to encode into token
function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username
        },
        SECRET_KEY, { expiresIn: '1h' }
    );
}

module.exports = {
    Mutation: {
        async login(
            _,
            { username, password }
        ){
            const { errors, valid } = validateLoginInput(username, password);
            // check if the input is valid
            if(!valid){
                // when to use deconstructor when not?????
                throw new UserInputError('Errors', { errors });
            }
            // see if username exists / get this user from db
            const user = await User.findOne({ username });
            // if username not exists
            if(!user){
                // since here is not the problem with invalid input, create an error.general
                errors.general = 'User not found';
                throw new UserInputError('User not found', { errors });
            }
            // see if password matches: string, hash string
            const match = await bcrypt.compare(password, user.password);
            if(!match){
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong credentials', { errors });
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            };
        },
        // register(parent, args, context, info)
        // use args for the most of the time
        // parent gives the result of input from the last step
        // used in case of having multiple resolvers and data
        // goes from one to another resolver, when undefined: _
        // args in this case: RegisterInput, 4 fields
        // info: general info, meta data, etc
        async register(
            _, 
            { registerInput: { username, email, password, confirmPassword } }
            ){
            // Validate user data
            const { valid, errors } = validateRegisterInput(
                username,
                email,
                password,
                confirmPassword
            );
            if(!valid){
                // name: errors, payload: errors with its value in it
                throw new UserInputError('Errors', { errors });
            }
            // TODO: Validation: Make sure user doesn't already exist
            const user = await User.findOne({ username });
            // if there is a user, this will not be null, and vice versa
            if(user){
                // add a payload: errors object
                // it will be used later on the frontend to display the error on the form
                throw new UserInputError('Username is taken', {
                    errors:{
                        username: 'This username is taken'
                    }
                })
            }

            // TODO: hash password and create an auth token
            password = await bcrypt.hash(password, 12);

            // form user object
            const newUser = new User({
                email,
                username,
                password,
                // convert the date to a string
                createdAt: new Date().toISOString()
            });

            // save user info to the database
            const res = await newUser.save();

            const token = generateToken(res);

            return{
                // where the doc is stored
                ...res._doc,
                id: res._id,
                token
            };
        }
    }
};