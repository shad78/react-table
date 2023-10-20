const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const dataPath = `${__dirname}/data/date.json`;

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/data", (req, res) => {
  const rawData = fs.readFileSync(dataPath);
  const data = JSON.parse(rawData);
  res.status(200).json({
    status: "success",
    data,
  });
});

app.post("/api/data", (req, res) => {
  const newEntry = req.body;
  const rawData = fs.readFileSync(dataPath);
  const data = JSON.parse(rawData);
  data.push(newEntry);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  res.status(201).json({
    status: "success",
    data: newEntry,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
