const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const path = require("path");
//const AppError = require("./util/appError");
//const globalErrorHandler = require("./controller/errorController");

// load dotenv file
dotenv.config({ path: "./config/config.env" });

// route files
//const userRoute = require("./route/userRoute");
//const gameRoute = require("./route/gameRoute");

// connection to db
connectDB();



const app = express();
app.use(express.json()); // body parser
app.use(express.urlencoded({ extended: false }));

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,Content-type,X-auth-token"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

// adding morgan logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}


// mount routes
//app.use("/api/v1/users", userRoute);

// error handling middleware
//app.use(globalErrorHandler);

// setting up the server
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// handle unhanled promise rejections
process.on("unhandledRejection", (err, Promise) => {
  console.log(`Error: ${err.message}`);
  // close server

  server.close(() => process.exit(1));
});
