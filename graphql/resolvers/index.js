// this is to combine all the resolvers together
const postsResolvers = require('./posts');
const userResolvers = require('./users');
const commentResolvers = require('./comments');

module.exports = {
    // count number of likes and comments
    // if we send any type of query or notation that returns a post, 
    // it will go throught this Post modifier and add these properties
    Post: {
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length
    },
    Query: {
        // spread operator
        ...postsResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentResolvers.Mutation
    },
    Subscription: {
        ...postsResolvers.Subscription
    }
};