// this provider will export a jsx element: an apollo provider that wraps the entire app
import React from "react";
import App from "./App";
import { ApolloClient } from "@apollo/client";
import { InMemoryCache } from "@apollo/client";
import { createHttpLink } from "apollo-link-http";
// jsx element
import { ApolloProvider } from "@apollo/client";
import { setContext } from "apollo-link-context";

const httpLink = createHttpLink({
  // purpose of uri: locate a resource on the server
  // pointing to the graphql server, the endpoint of the server
  uri: "http://localhost:5000",
});

// add the token to the request header
// setContext takes a request and a previous context that we can get data from
// to edit and forward to the next operation, but in this case we dont need it
const authLink = setContext((req, pre) => {
  const token = localStorage.getItem("jwtToken");
  // this will modify the current request
  return {
    // this will merge the existing header of the request
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  // concat authLink with httpLink
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
