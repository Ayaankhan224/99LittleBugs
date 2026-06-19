const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middleware/auth.middleware");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  }
});

const {
  generateRanking,
  downloadCSV
} = require("../controllers/ranking.controller");

router.get("/", authMiddleware, generateRanking);
router.post("/", authMiddleware, upload.any(), generateRanking);
router.get("/download", authMiddleware, downloadCSV);

module.exports = router;