const { model, Schema } = require('mongoose');

const postSchema = new Schema({
    body: String,
    username: String,
    createdAt: String,
    comments: [
        // curly braces for objects
        {
            body: String,
            username: String,
            createdAt: String
        }
    ],
    likes: [
        {
            username: String,
            createdAt: String
        }
    ],
    // tho mongodb is schemaless, orm itself has relations between each model
    // link data models
    // refer to another schema object
    // allow us to later use mongoose to automatically populate the user field
    // if we want to use some mongoose methods
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = model('Post', postSchema);