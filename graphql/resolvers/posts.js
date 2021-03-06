const { AuthenticationError, UserInputError } = require("apollo-server");

// use post model to fetch post
const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    // async await syntax
    async getPosts() {
      console.log("getPosts");
      // if query fails, might stop server, safer to have try/catch
      try {
        // find() without specifying will fetch all of them
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }) {
      console.log("getPost");
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createPost(_, { body }, context) {
      // see how many times these queries were actually sent to server side instead of client side cache
      console.log("createPost");
      // the way the protected resolvers work:
      // user login, get an authentication token
      // put it in an authorization header and send the header with the request
      // get the token and decode it, and get information from it
      // make sure it is authenticated, then create the post
      const user = checkAuth(context);

      if (body.trim() === "") {
        throw new Error("Post body must not be empty");
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      context.pubsub.publish("NEW_POST", {
        newPost: post,
      });

      return post;
    },
    async deletePost(_, { postId }, context) {
      console.log("deletePost");
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return "Post deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async likePost(_, { postId }, context) {
      console.log("likePost");
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        // make sure likes exist, function returns an object, if not found, return undefined
        if (post.likes.find((like) => like.username === username)) {
          // post liked, unlike it
          //////////// NOTE THIS FUNCTION!!
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          // not liked, like post
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }

        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_POST"),
    },
  },
};
