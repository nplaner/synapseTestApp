import React, { useState, useReducer } from "react";

const InputField = () => {
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
    fetch(`http://localhost:3000/api/message/`, {
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
  };
  return (
    <form>
      <input
        autoComplete="off"
        className="message"
        name="message"
        type="text"
        placeholder="message"
        value={newPost.message}
        onChange={handleChange}
      />
      <input
        autoComplete="off"
        className="message"
        name="tag_name"
        type="text"
        placeholder="tag"
        value={newPost.tag_name}
        onChange={handleChange}
      />
      <button type="submit" onClick={handleSubmit}>
        Post!
      </button>
    </form>
  );
};

export default InputField;
