import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "./Auth";

const Login = (props) => {
  const cookie = Cookies.get("client_id");
  const [input, setInput] = useState({ username: "", password: "" });
  const { setAuthTokens } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };
  const handleSubmit = (e) => {
    setAuthTokens(cookie);
    setIsLoggedIn(true);
    e.preventDefault();
    fetch(`http://localhost:3000/api/session/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(input),
    }).then((data) => {
      if (data.status === 201) {
        setAuthTokens(cookie);
        setIsLoggedIn(true);
      }
      setInput({ username: "", password: "" });
    });
  };
  if (isLoggedIn) return <Redirect to="/" />;
  return (
    <div>
      Login!
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
      <button onClick={handleSubmit}>Login!</button>
      <Link to="/register">Sign Up!</Link>
    </div>
  );
};

export default Login;
