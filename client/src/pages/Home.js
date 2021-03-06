import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Transition, Grid } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../util/graphql";

// function name must be capitalized
function Home() {
  const { user } = useContext(AuthContext);

  // posts are in getPosts object in data
  const { loading, data: { getPosts: posts } = {} } = useQuery(
    FETCH_POSTS_QUERY
  );

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          // post won't work because we haven't provide authorization header
          // we need to set up the apollo client in such a way that once we have a token locally / in storage
          // we need to get it and add it as an authorization header automatically without having to add it each time we send a request
          // use apollo link context
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading posts...</h1>
        ) : (
          // check if we have any post first
          <Transition.Group>
            {posts &&
              posts.map((post) => (
                // iterate through the posts array,
                // in react, when iterate through, we need to give a key value/attribute to the top most component
                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
