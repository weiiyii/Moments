// dependency imports
const { ApolloServer, PubSub } = require("apollo-server-express");
// object-relational mapper (ORM library), interface with mongoDB database
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require("path");

// relative imports
const typeDefs = require("./graphql/typeDefs");
// combined reslvers are in index so we do need to specify
const resolvers = require("./graphql/resolvers");
const { MONGODB } = require("./config.js");

const app = express();
app.use(cors);

app.use(express.static("public"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

const pubsub = new PubSub();

const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  // infers on its own if the key and value are the same, otherwise: typeDefs: value
  typeDefs,
  resolvers,
  // context takes a call back, we get anything that's passed before the apollo server
  // forward the request, take the request body, forward it to the context
  // so that we can access the request body in the context
  context: ({ req }) => ({ req, pubsub }),
  introspection: true,
  playground: true,
});

server.applyMiddleware({
  path: "/graphql",
  app,
});

// returns a promise, need a "then"
mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB Connected");
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch((err) => {
    console.error(err);
  });
