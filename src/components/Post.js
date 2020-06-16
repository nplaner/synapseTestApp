/* eslint-disable react/prop-types */
import React, { useState } from "react";

const Post = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const { info } = props;

  const handleDelete = (e) => {
    e.preventDefault();
    const { message_id } = info;
    fetch(`http://localhost:3000/api/message/${message_id}`, {
      method: "DELETE",
    }).catch((err) => console.log(err));
  };
  const toggleEditor = (e) => {
    e.preventDefault();
    setEditMode(!editMode);
    setMessage("");
  };
  const handleChange = (e) => {
    e.preventDefault();
    setMessage(e.target.value);
  };
  const handlePatch = (e) => {
    e.preventDefault();
    const { message_id } = info;
    fetch(`http://localhost:3000/api/message/${message_id}`, {
      method: "PATCH",
      body: JSON.stringify({ message }),
    }).catch((err) => console.log(err));
    setEditMode(false);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "5px",
        border: "solid 1px grey",
      }}
    >
      <span>Post: {info.message}</span>
      <span>Tag: {info.tag_name}</span>
      <span>Author: {info.username}</span>
      <button name="PATCH" onClick={toggleEditor} type="button">
        Edit
      </button>
      {editMode && (
        <form>
          <input value={message} placeholder="Edit message..." onChange={handleChange} />
          <button type="button" onClick={handlePatch}>
            Submit!
          </button>
        </form>
      )}
      <button name="DELETE" onClick={handleDelete} type="button">
        Delete
      </button>
    </div>
  );
};
export default Post;
