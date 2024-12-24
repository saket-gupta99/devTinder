const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({ firstName: "Saket", lastName: "Gupta" });
});
app.post("/user", (req, res) => {
  res.send("Data saved to DB");
});
app.delete("/user", (req, res) => {
  res.send("deleted successfully");
});
app.patch("/user", (req, res) => {
  res.send("updating some part of the resource");
});
//'use' matches all HTTP methods
app.use("/test", (req, res) => {
  res.send("Hello from the test server!");
});

app.listen(3000, () => {
  console.log("Server is listening...");
});
