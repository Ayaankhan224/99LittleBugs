const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "anker_jwt_secret_key_99_little_bugs";

const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters long" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const userCheck = await pool.query("SELECT * FROM users WHERE username = $1", [username.toLowerCase().trim()]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      "INSERT INTO users (username, password, plan) VALUES ($1, $2, 'free') RETURNING id, username, plan",
      [username.toLowerCase().trim(), hashedPassword]
    );

    const newUser = result.rows[0];

    const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      username: newUser.username,
      plan: newUser.plan,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username.toLowerCase().trim()]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Logged in successfully",
      token,
      username: user.username,
      plan: user.plan || "free",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

const updatePlan = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user.id;

    if (!plan || !["free", "premium", "enterprise"].includes(plan)) {
      return res.status(400).json({ message: "Invalid plan selection" });
    }

    const result = await pool.query(
      "UPDATE users SET plan = $1 WHERE id = $2 RETURNING id, username, plan",
      [plan, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Plan updated successfully",
      username: result.rows[0].username,
      plan: result.rows[0].plan,
    });
  } catch (error) {
    console.error("Update plan error:", error);
    res.status(500).json({ message: "Server error during plan update" });
  }
};

module.exports = {
  signup,
  login,
  updatePlan,
};
