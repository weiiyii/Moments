const { UserInputError, AuthenticationError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Mutation: {
        // another syntax of async function
        createComment: async(_, { postId, body }, context) => {
            const { username } = checkAuth(context);

            if(body.trim() === ''){
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'Comment body must not be empty'
                    }
                })
            }

            const post = await Post.findById(postId);

            if(post){
                // mongoose turn the data models into js objects, so we can access comments like this:
                // unshift: add the comment on the top of other comments
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save();
                return post;
            }
            else{
                throw new UserInputError('Post not found')
            }
        },
        async deleteComment(_, { postId, commentId }, context){
            const { username } = checkAuth(context);

            // get the post, go to Post model
            const post = await Post.findById(postId);

            if(post){
                // findIndex function: of comment c, where c.id is commentId
                const commentIndex = post.comments.findIndex(c => c.id === commentId);

                if(post.comments[commentIndex].username === username){
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                }
                else{
                    // throw an error without sending a payload with errors cuz we don't need to show this on the client, cuz there will never be a delete button for a user that doesn't own that comment
                    // this is just a safety check / net
                    throw new AuthenticationError('Action not allowed')
                }
            }
            else{
                throw new UserInputError('Post not found');
            }

        }
    }
}