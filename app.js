const express = require("express");
const cors = require("cors")
const previewRoutes = require("./router/ogs.js");


const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
}))
// Simple test route
app.get("/", (req, res) => {
  res.send("This is post back-end");
});

app.use("/api", previewRoutes);

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
