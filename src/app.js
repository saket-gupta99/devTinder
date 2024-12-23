const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("Hello from the test server!");
});
app.use("/hello", (req, res) => {
  res.send("Hello from the Hello server!");
});
app.use((req, res) => {
  res.send("Hello from the server!");
});

app.listen(3000, () => {
  console.log("Server is listening...");
});
