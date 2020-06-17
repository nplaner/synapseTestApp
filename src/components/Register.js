import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

const Register = (props) => {
  const [input, setInput] = useState({ username: "", password: "" });
  const [isRegistered, setIsRegistereds] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };
  const handleSubmit = (e) => {
    setIsRegistereds(true);
    e.preventDefault();
    fetch(`/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
      credentials: "include",
    })
      .then((data) => {
        if (data.status === 201) {
          setIsRegistereds(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setInput({ username: "", password: "" });
  };
  if (isRegistered) return <Redirect to="/login" />;

  return (
    <div
      style={{
        fontFamily: "Verdana",
        width: "500px",
        height: "250px",
        position: "relative",
        margin: "60px auto 30px",
        padding: "10px",
        overflow: "hidden",
        background: "#15252e",
        borderRadius: "0.4em",
        border: "1px solid #191919",
        outline: "none",
      }}
    >
      <span
        style={{
          fontSize: "3em",
          display: "flex",
          justifyContent: "center",
          marginBottom: "35px",
        }}
      >
        Sign Up!
      </span>
      <input
        style={{
          marginLeft: "35px",
          width: "80%",
          justifyContent: "center",
          marginBottom: "10px",
          paddingTop: "5px",
          paddingBottom: "5px",
          border: "1px solid #191919",
          outline: "none",

          borderRadius: "8px",
          paddingLeft: "22px",
        }}
        autoComplete="off"
        type="text"
        onChange={handleChange}
        name="username"
        placeholder="username"
        value={input.username}
      />
      <input
        style={{
          marginLeft: "35px",
          width: "80%",
          justifyContent: "center",
          paddingTop: "5px",
          paddingBottom: "5px",
          marginBottom: "35px",
          border: "1px solid #191919",
          borderRadius: "8px",
          paddingLeft: "22px",
        }}
        autoComplete="off"
        type="password"
        onChange={handleChange}
        name="password"
        placeholder="password"
        value={input.password}
      />
      <button
        onClick={handleSubmit}
        type="button"
        style={{
          width: "20%",
          display: "flex",
          position: "relative",
          right: "-200px",
          border: "1px solid #73c6f5",
          borderRadius: "8px",
          background: "#73c6f5",
          color: "white",
          padding: "5px 5px",
          justifyContent: "center",
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default Register;
