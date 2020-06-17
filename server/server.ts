import { v4 as uuidv4 } from "uuid";

const express = require("express");
const cookieParser = require("cookie-parser");
const { synapse } = require("synapse");
const path = require("path");
const enableWs = require("express-ws");

const app = express();
const port = 3000;
const api = synapse(path.resolve(__dirname, "./resources"));

api.use((req, res) => {
  res.status(res.locals.$status()).json(res.locals.render());
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.cookie("client_id", req.cookies.client_id || uuidv4());
  next();
});
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    res.set({
      "Access-Control-Allow-Origin": "http://localhost:8080",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
      "Access-Control-Allow-Credentials": true,
    });
    next();
  });
}

enableWs(app);
app.ws("/api", api.ws);
app.use("/api", api.http);
app.get("/main.js", (req, res, next) => {
  res.sendFile(path.resolve(__dirname, "..", "main.js"));
});
app.use("*", (request, response) => {
  response.sendFile(path.resolve(__dirname, "..", "index.html"));
});

app.use((err, req, res, next) => {
  const defErr = {
    log: "Express error handler caught unknown middleware error",
    status: 400,
    message: "An error occurred",
  };
  const errorObj = { ...defErr, ...err };
  res.status(errorObj.status).json(errorObj.message);
});
app.listen(port, () => console.log(`App listening on port ${port}!`));
