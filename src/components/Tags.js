/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useRef } from "react";
import Feed from "./Feed";

const Tags = () => {
  const [tag, setTag] = useState("");
  const [posts, setPosts] = useState({});
  const [tags, setTags] = useState([]);
  const webSocket = useRef(null);
  useEffect(() => {
    webSocket.current = new WebSocket(`ws://localhost:3000/api`);
  }, []);

  useEffect(() => {
    webSocket.current.onopen = (e) => {
      console.log("WS connection is now open!");
    };
    webSocket.current.onmessage = (event) => {
      console.log("Incoming WS message!");
      const payload = JSON.parse(event.data);
      const [, data] = Object.entries(payload)[0];
      console.log(payload);
      const tagQuery = data.$.query;
      if (tagQuery !== null) {
        const arrayOfMessages = data.resources;
        setPosts({ ...posts, [tagQuery]: arrayOfMessages });
      }
    };
    webSocket.current.onclose = (event) => {
      console.log("WebSocket connection is closed!");
    };
  });

  const handleChange = (e) => {
    setTag(e.target.value);
  };
  const subscribeToTag = (e) => {
    const message = {
      [`SUBSCRIBE /message/${tag}`]: {},
    };
    webSocket.current.send(JSON.stringify(message));
    setTag("");
    setTags([...tags, tag]);
  };
  const unsubscribeFromTag = (name) => {
    webSocket.current.send(
      JSON.stringify({ [`UNSUBSCRIBE /message/${name}?tag_name=${name}`]: {} })
    );
    delete posts[`/message/${name}?tag_name=${name}`];
    setPosts({ ...posts });
    setTags(tags.filter((elem) => elem !== name));
  };
  const arrayOfTags = tags.map((subTag, index) => {
    return (
      <div className="tag" key={`tag${index}`}>
        {subTag}
        <button style={{ margin: "5px" }} type="button" onClick={() => unsubscribeFromTag(subTag)}>
          x
        </button>
      </div>
    );
  });
  return (
    <div>
      <input value={tag} onChange={handleChange} placeholder="Find a tag..." type="text" required />
      <button type="button" onClick={subscribeToTag}>
        Subscribe!
      </button>
      <div style={{ display: "flex", flexDirection: "column" }}>{arrayOfTags}</div>
      <Feed posts={posts} />
    </div>
  );
};
export default Tags;
