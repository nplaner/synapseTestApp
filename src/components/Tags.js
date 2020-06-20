/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useRef, useReducer } from "react";
import Feed from "./Feed";

const MemoFeed = React.memo(Feed);
const Tags = () => {
  const reducer = (state, [method, data]) => {
    const { query, payload } = data;
    switch (method) {
      case "add": {
        return { ...state, [query]: payload };
      }
      case "remove": {  
        const copy = { ...state };
        delete copy[query];
        return { ...copy };
      }
      default:
        return state;
    }
  };
  const [posts, setPosts] = useReducer(reducer, {});
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState({});
  const webSocket = useRef(null);
  const [relations, setRelations] = useState({});
  useEffect(() => {
    const queries = {};
    const listeners = {};
    const ws = new WebSocket(`ws://${location.host}/api`);
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
    if (tags[tag]) {
      setTag("");
      return;
    }
    if (!tag.length) return;
    webSocket.current.request(`SUBSCRIBE /message/${tag}`, {}, (result) => {
      const { query } = result;
      // const { payload } = result;
      setRelations({ ...relations, [tag]: query });
      setPosts(["add", result]);
      webSocket.current.listen(query, (newState) => {
        setPosts(["add", { query, payload: newState }]);
      });
    });
    setTag("");
    setTags({ ...tags, [tag]: true });
  };
  const unsubscribeFromTag = (name) => {
    const query = relations[name];
    webSocket.current.request(`UNSUBSCRIBE ${query}`);
    webSocket.current.unlisten(query);
    delete posts[query];
    delete relations[name];
    setRelations({ ...relations });
    setPosts(["remove", { query: name, payload: null }]);
    delete tags[name];
    setTags({ ...tags });
  };
  const arrayOfTags = Object.keys(tags).map((subTag, index) => {
    return (
      <div
        style={{ marginRight: "5px", fontSize: "20px", fontFamily: "Verdana" }}
        className="tag"
        key={`tag${index}`}
      >
        <span style={{ marginRight: "5px" }}> {subTag} </span>
        <button
          style={{
            marginLeft: "3px",
            backgroundColor: "#15252e",
            border: "solid 1px #73c6f5",
            fontSize: "13px",
            padding: "3px",
            color: "#73c6f5",
            margin: "2px",
            borderRadius: "5px",
          }}
          type="button"
          onClick={() => unsubscribeFromTag(subTag)}
        >
          Remove
        </button>
      </div>
    );
  });
  return (
    <div style={{ flexGrow: "2", display: "flex", flexDirection: "row", width: "66%" }}>
      <div
        className="home"
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "50%",
        }}
      >
        <input
          style={{
            color: "white",
            backgroundColor: "#15252e",
            border: "solid 1px #73c6f5",
            outline: "none",
            padding: "5px",
            width: "28%",
            margin: "5px",

            borderRadius: "5px",
          }}
          value={tag}
          onChange={handleChange}
          placeholder="Find a tag..."
          type="text"
          required
        />
        <button
          style={{
            fontFamily: "Verdana",
            backgroundColor: "#15252e",
            border: "solid 1px #73c6f5",
            outline: "none",
            color: "white",
            borderRadius: "5px",
            alignSelf: "center",
            width: "30%",
            margin: "5px",
            padding: "5px",
            height: "35px",
          }}
          type="button"
          onClick={subscribeToTag}
        >
          Subscribe!
        </button>
        <MemoFeed posts={posts} />
      </div>
      <div
        style={{ display: "flex", flexWrap: "wrap", height: "50px", width: "50%", padding: "20px" }}
      >
        {arrayOfTags}
      </div>
    </div>
  );
};
export default Tags;
