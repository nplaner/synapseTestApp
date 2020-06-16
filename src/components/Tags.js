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
  const [relations, setRelations] = useState({});
  useEffect(() => {
    const queries = {};
    const listeners = {};
    const ws = new WebSocket(`ws://localhost:3000/api`);
    console.log("WS connection is now open!");
    webSocket.current = {
      request: (path, data = {}, callback = null) => {
        const message = {
          [path]: data,
        };
        ws.send(JSON.stringify(message));
        if (callback) queries[path] = callback;
      },
      listen: (path, callback) => {
        listeners[path] = callback;
      },
      unlisten: (path) => {
        delete listeners[path];
      },
    };
    ws.onmessage = (event) => {
      console.log("Incoming WS message!");
      const data = JSON.parse(event.data);
      const [key, payload] = Object.entries(data)[0];
      if (queries[key]) {
        queries[key](payload);
        delete queries[key];
      } else if (listeners[key]) {
        listeners[key](payload);
      }
    };
    ws.onopen = (e) => {
      console.log("WS connection is now open!");
    };
    ws.onclose = (event) => {
      console.log("WebSocket connection is closed!");
    };
  }, []);

  const handleChange = (e) => {
    setTag(e.target.value);
  };
  const subscribeToTag = (e) => {
    if (!tag.length) return;
    webSocket.current.request(`SUBSCRIBE /message/${tag}`, {}, (result) => {
      const { query } = result;
      const { payload } = result;
      setRelations({ ...relations, [tag]: query });
      setPosts({ ...posts, [query]: payload });
      webSocket.current.listen(query, (newState) => {
        setPosts({ ...posts, [query]: newState });
      });
    });
    setTag("");
    setTags([...tags, tag]);
  };
  const unsubscribeFromTag = (name) => {
    const query = relations[name];
    webSocket.current.request(`UNSUBSCRIBE ${query}`);
    webSocket.current.unlisten(query);
    delete posts[query];
    delete relations[name];
    setRelations({ ...relations });
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
