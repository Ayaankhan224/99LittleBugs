const express = require("express");
const router = express.Router();
const { signup, login, updatePlan } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/signup", signup);

router.post("/login", login);

router.put("/plan", authMiddleware, updatePlan);

module.exports = router;
