// Note: mongodb is schemaless, but with mongoose we can
// specify a schema to have more safety when working with server code
const { model, Schema } = require('mongoose');

// using graphql as middle man, we will say these
// fields are required on the graphql layer
const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String
});

module.exports = model('User', userSchema);
