const express = require("express"); // Used to set up a server
const cors = require("cors"); // Used to prevent errors when working locally

const app = express(); // Initialize express as an app variable
app.set("port", process.env.PORT || 3050); // Set the port
app.use(express.json()); // Enable the server to handle JSON requests
app.use(cors()); // Dont let local development give errors

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

const userRoute = require("./routes/userRoute");
const projectRoute = require("./routes/projectRoute");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/" + "index.html");
});

app.use("/users", userRoute);
app.use("/projects", projectRoute);

app.listen(app.get("port"), () => {
  console.log(`Listening for calls on port ${app.get("port")}`);
  console.log("Press Ctrl+C to exit server");
});

app.use(express.static("public"));
module.exports = {
  devServer: {
    Proxy: "*",
  },
};
