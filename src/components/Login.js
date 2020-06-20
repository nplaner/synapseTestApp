import React, { useEffect, useState } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from "mdbreact";
import { Link, Redirect } from "react-router-dom";
import { WaveLoading } from "react-loadingg";

import Cookies from "js-cookie";
import { useAuth } from "./Auth";

const Login = (props) => {
  const cookie = Cookies.get("client_id");
  const [isLoading, setLoading] = useState(false);
  const [input, setInput] = useState({ username: "", password: "" });
  const { setAuthTokens, authTokens } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };
  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    fetch(`/api/session/`, {
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
      setTimeout(() => {
        setLoading(false);
      }, 650);
      setInput({ username: "", password: "" });
      return data.json();
    });
  };
  if (isLoading) return <WaveLoading />;

  if (authTokens === cookie) {
    return <Redirect to="/" />;
  }
  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

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
      }}
    >
      <div
        className="loginContainer"
        style={{
          display: "flex",
          flexDirection: "column",
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
          Login!
        </span>
        <input
          style={{
            width: "80%",
            margin: "0 auto",
            marginBottom: "10px",
            paddingTop: "5px",
            paddingBottom: "5px",
            border: "1px solid #191919",
            borderRadius: "8px",
            autocomplete: "off",
            paddingLeft: "20px",
            outline: "none",
          }}
          autoComplete="off"
          type="text"
          onChange={handleChange}
          name="username"
          placeholder="username"
        />
        <input
          style={{
            width: "80%",
            margin: "0 auto",
            paddingTop: "5px",
            paddingBottom: "5px",
            marginBottom: "35px",
            border: "1px solid #191919",
            outline: "none",
            borderRadius: "8px",
            autocomplete: "off",
            paddingLeft: "20px",
          }}
          autoComplete="off"
          type="password"
          onChange={handleChange}
          name="password"
          placeholder="password"
          value={input.password}
        />
        <button
          type="button"
          onClick={handleSubmit}
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
        <Link
          to="/register"
          style={{
            textDecoration: "none",
            position: "relative",
            right: "-415px",
            bottom: "-10px",
            color: "#73c6f5",
          }}
        >
          Sign Up!
        </Link>
      </div>
    </div>
  );
};
export default Login;
