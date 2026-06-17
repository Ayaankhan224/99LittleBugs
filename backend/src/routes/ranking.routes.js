const express = require("express");
const router = express.Router();

const {
  generateRanking
} = require("../controllers/ranking.controller");

router.get("/", generateRanking);

module.exports = router;