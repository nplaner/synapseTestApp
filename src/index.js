import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import styles from "./styles.css";

<<<<<<< HEAD
ReactDOM.render(<h1>Helloqweqwe, world!</h1>, document.getElementById("root"));
=======
ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
>>>>>>> 202656c43371ae1a221132cdb0dae2dc1b9ed2e1
