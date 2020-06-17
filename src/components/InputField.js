import React, { useState, useReducer } from "react";

const InputField = () => {
  const style = {
    fontFamily: "Verdana",
    color: "white",
    outline: "none",
    borderRadius: "5px",
    alignSelf: "center",
    width: "50%",
    margin: "5px",
    padding: "5px",
    height: "35px",
    backgroundColor: "#15252e",
    border: "solid 1px #73c6f5",
  };
  const [isClicked, setClicked] = useState(false);
  const [newPost, setNewPost] = useReducer((state, newState) => ({ ...state, ...newState }), {
    message: "",
    tag_name: "",
  });
  const handleChange = (e) => {
    const { name } = e.target;
    const newValue = e.target.value;
    setNewPost({ [name]: newValue });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/message/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(newPost),
    })
      .then((res) => res.json())
      .catch((error) => {
        console.log(error);
      });
    setNewPost({
      message: "",
      tag_name: "",
    });
    setClicked(false);
  };
  return (
    <div style={{ minHeight: "50px", padding: "20px", width: "27%" }}>
      {!isClicked && (
        <button style={style} onClick={() => setClicked(!isClicked)} type="button">
          New Post
        </button>
      )}
      {isClicked && (
        <form
          style={{ display: "flex", flexDirection: "column", maxWidth: "80%", height: "300px" }}
        >
          <textarea
            style={{
              color: "white",
              fontFamily: "Verdana",

              backgroundColor: "#15252e",
              border: "solid 1px #73c6f5",
              padding: "10px",
              margin: "5px",
              resize: "none",
              height: "150px",
              outline: "none",
              borderRadius: "5px",
            }}
            autoComplete="off"
            className="message"
            name="message"
            type="text"
            placeholder="Type your post..."
            value={newPost.message}
            onChange={handleChange}
          />
          <input
            style={{
              color: "white",

              backgroundColor: "#15252e",
              border: "solid 1px #73c6f5",
              padding: "5px",
              margin: "5px",
              outline: "none",
              borderRadius: "5px",
            }}
            autoComplete="off"
            className="message"
            name="tag_name"
            type="text"
            placeholder="Tag"
            value={newPost.tag_name}
            onChange={handleChange}
          />
          <button style={style} type="submit" onClick={handleSubmit}>
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default InputField;
