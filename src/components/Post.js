/* eslint-disable react/prop-types */
import React, { useState } from "react";

const Post = (props) => {
  const style = {
    backgroundColor: "#15252e",
    border: "solid 1px #73c6f5",
    fontSize: "15px",
    padding: "5px",
    color: "#73c6f5",
    margin: "2px",
    borderRadius: "5px",
    width: "25%",
  };
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const { info, userId } = props;
  const [hover, setHover] = useState(false);
  const owner = userId === info.posted_by;
  // const owner = true;
  const s = new Date(info.created_at);
  const time = `${s.getHours()}:${s.getMinutes()} ${s.toDateString()}`;
  const handleDelete = (e) => {
    e.preventDefault();
    const { message_id } = info;
    fetch(`/api/message/${message_id}`, {
      method: "DELETE",
      credentials: "include",
    }).catch((err) => console.log(err));
  };
  const toggleEditor = (e) => {
    setMessage(info.message);
    e.preventDefault();
    setEditMode(!editMode);
    // setMessage("");
  };
  const handleChange = (e) => {
    console.log(e.target.value);
    e.preventDefault();
    setMessage(e.target.value);
  };
  const handlePatch = (e) => {
    e.preventDefault();
    const { message_id } = info;
    fetch(`/api/message/${message_id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({ message }),
      credentials: "include",
    }).catch((err) => console.log(err));
    setEditMode(false);
  };
  const toggleHover = () => {
    setHover(!hover);
  };
  return (
    <div
      className="post"
      style={{
        fontFamily: "Arial",
        backgroundColor: "#15252e",
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        margin: "7px",
        border: "solid 1px #73c6f5",
        padding: "10px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <span
          onMouseEnter={toggleHover}
          onMouseLeave={toggleHover}
          style={
            hover
              ? {
                  margin: "5px",
                  color: "",
                  fontWeight: "bold",
                  textDecoration: "underline",
                  fontFamily: "Verdana",
                }
              : { color: "#73c6f5", margin: "5px", fontWeight: "bold", fontFamily: "Verdana" }
          }
        >
          {info.username}
        </span>
        <span style={{ color: "#6e6e6e", fontSize: "12px" }}>{time}</span>
      </div>

      <span style={{ wordWrap: "break-word" }}>{info.message}</span>
      <span style={{ color: "#6e6e6e", fontFamily: "Verdana" }}># {info.tag_name}</span>
      {editMode && (
        <form>
          <input
            style={{
              outline: "none",
              padding: "5px",
              width: "50%",
              margin: "5px",
              border: "solid 1px grey",
              borderRadius: "5px",
            }}
            value={message}
            placeholder="Edit message..."
            onChange={handleChange}
          />
          <button style={style} type="button" onClick={handlePatch}>
            Submit!
          </button>
        </form>
      )}
      {owner && !editMode && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            padding: "5px",
          }}
        >
          <button style={style} name="PATCH" onClick={toggleEditor} type="button">
            Edit
          </button>
          <button style={style} name="DELETE" onClick={handleDelete} type="button">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
export default Post;
