const express = require("express");
const cors = require("cors");
const router = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", router);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
