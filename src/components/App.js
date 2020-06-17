import React, { useState, useEffect, useContext } from "react";
import { Link, Route, Redirect, Switch } from "react-router-dom";
import { WaveLoading } from "react-loadingg";

import Cookies from "js-cookie";

import Home from "./Home";
import PrivateRoute from "./PrivateRoute";
import Register from "./Register";
import Login from "./Login";
import NotFount from "./NotFound";
import { AuthContext } from "./Auth";

function App() {
  const cookie = Cookies.get("client_id");
  const [isLoading, setLoading] = useState(false);
  const existingTokens = JSON.parse(localStorage.getItem("session_token"));
  const [authTokens, setAuthTokens] = useState(existingTokens);
  const setTokens = (data) => {
    localStorage.setItem("session_token", JSON.stringify(data));
    setAuthTokens(data);
  };

  useEffect(() => {
    setLoading(true);
    if (authTokens === cookie) {
      setLoading(false);
      return;
    }
    fetch("/api/session", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 200) {
          setTokens(cookie);
          return res.json();
        }
        setTimeout(() => {
          setLoading(false);
        }, 650);
      })
      .catch((err) => console.log(err));
  }, []);

  if (isLoading) return <WaveLoading />;
  return (
    <div>
      <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/login">
            <Login />
          </Route>
          <PrivateRoute exact path="/" component={Home} />
          <NotFount />
        </Switch>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
