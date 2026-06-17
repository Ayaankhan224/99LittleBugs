const express = require("express");
const cors = require("cors");

const rankingRoutes = require("./src/routes/ranking.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/rank", rankingRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
