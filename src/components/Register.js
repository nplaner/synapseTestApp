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
    fetch(`http://localhost:3000/api/user`, {
      method: "POST",
      body: JSON.stringify(input),
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
    <div>
      Sign Up!!
      <input
        type="text"
        onChange={handleChange}
        name="username"
        placeholder="username"
        value={input.username}
      />
      <input
        type="password"
        onChange={handleChange}
        name="password"
        placeholder="username"
        value={input.password}
      />
      <button onClick={handleSubmit}>Sign Up!</button>
    </div>
  );
};

export default Register;
