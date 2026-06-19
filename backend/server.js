const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Razorpay = require("razorpay");

dotenv.config();

const rankingRoutes = require("./src/routes/ranking.routes");
const authRoutes = require("./src/routes/auth.routes");

require("./src/config/db");

const app = express();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.use(cors());
app.use(express.json());

app.use("/api/rank", rankingRoutes);
app.use("/api/auth", authRoutes);

const PORT = 5000;

app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "USD",
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Order creation failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
