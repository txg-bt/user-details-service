const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.set("port", process.env.PORT || 3002);

app.use("/api/v1/adresses", require("./src/routes/adresses"));
app.use("/api/v1/favourites", require("./src/routes/favourites"));
app.use("/api/v1/userDetails", require("./src/routes/userDetails"));
app.use("/api/v1/cards", require("./src/routes/cards"));

app.get("*", async (req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(app.get("port"), function () {
  console.log(`Starting server on port ${app.get("port")}`);
});
