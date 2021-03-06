const { AuthenticationError } = require('apollo-server');

// use the json web token to decode the web token we got
const jwt = require('jsonwebtoken');
// need secret key since we encoded the token using it
const { SECRET_KEY } = require('../config');

module.exports = (context) => {
    // context = { ... headers }
    const authHeader = context.req.headers.authorization;
    // check in case header was not sent
    if(authHeader){
        // convention to send header: Bearer token
        // split returns an array of strings 
        const token = authHeader.split('Bearer ')[1];
        if(token){
            try{
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            }catch(err){
                throw new AuthenticationError('Invalid/Expired token');
            }
        }
        throw new Error('Authentication token must be \'Bearer [token]');
    }
    throw new Error('Authorization header must be provided');
}