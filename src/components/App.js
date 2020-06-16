import React, { useState, useEffect, useContext } from "react";
import { Link, Route, Redirect, Switch } from "react-router-dom";
import Home from "./Home";
import PrivateRoute from "./PrivateRoute";
import Register from "./Register";
import Login from "./Login";
import NotFount from "./NotFound";
import { AuthContext } from "./Auth";

function App() {
  const existingTokens = JSON.parse(localStorage.getItem("session_token"));
  const [authTokens, setAuthTokens] = useState(existingTokens);
  const setTokens = (data) => {
    localStorage.setItem("session_token", JSON.stringify(data));
    setAuthTokens(data);
  };
  useEffect(() => {
    fetch("http://localhost:3000/api/session").then((data) => {
      console.log(data);
    });
  }, []);
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
