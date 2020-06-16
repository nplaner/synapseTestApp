/* eslint-disable react/prop-types */
import React from "react";
import Post from "./Post";

const Feed = (props) => {
  const { posts } = props;
  const parseMessage = (obj, index, i) => {
    return <Post key={`${index}${i}`} info={obj} />;
  };
  const parseQuery = (array, index) => {
    return array.map((e, i) => parseMessage(e, index, i));
  };
  const toRender = Object.keys(posts).map((key, index) => parseQuery(posts[key], index));
  return <div>{toRender}</div>;
};
export default Feed;
