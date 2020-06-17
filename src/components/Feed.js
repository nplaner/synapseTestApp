/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import Post from "./Post";

const style = {
  display: "flex",
  flexDirection: "column",
  alignContent: "center",
  width: "100%",
  padding: "10px",
};

const Feed = (props) => {
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    fetch("/api/session", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((data) => data.json())
      .then((res) => {
        setUserId(res.user_id);
      });
  });
  const { posts } = props;
  const arrayOfPosts = [];
  Object.values(posts).forEach((array) => {
    array.forEach((post) => arrayOfPosts.push(post));
  });
  const sorted = arrayOfPosts.sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });
  const toRender = sorted.map((elem, index) => {
    return <Post key={`post${index}$`} info={elem} userId={userId} />;
  });

  return (
    <div style={style} className="feed">
      {toRender}
    </div>
  );
};
export default Feed;
