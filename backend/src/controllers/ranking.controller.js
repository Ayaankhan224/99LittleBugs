const fs = require("fs");
const path = require("path");
const pool = require("../config/db");
const candidateLoader = require("../services/candidateLoader");
const scoringService = require("../services/scoringService");
const csvGenerator = require("../services/csvGenerator");

exports.generateRanking = async (req, res) => {
  try {
    const userResult = await pool.query("SELECT plan FROM users WHERE id = $1", [req.user.id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const userPlan = userResult.rows[0].plan || "free";

    if (userPlan === "free" && req.files && req.files.length > 5) {
      return res.status(400).json({
        success: false,
        message: "Free plan is limited to a maximum of 5 resume uploads. Please upgrade to Premium for unlimited uploads."
      });
    }

    let candidates = [];
    if (req.files && req.files.length > 0) {
      candidates = await candidateLoader.loadCandidatesFromFiles(req.files);
    } else {
      candidates = await candidateLoader.loadCandidates();
    }

    if (candidates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No candidates loaded or parsed. Please check if your files are valid."
      });
    }

    const { experience, limit } = req.body;

    const finalLimit = userPlan === "free" ? 5 : Number(limit || 5);

    const ranked = scoringService.rankCandidates(candidates, { experience, limit: finalLimit });
    const csvCount = await csvGenerator.createCSV(ranked);

    res.json({
      success: true,
      count: ranked.length,
      csvRecords: csvCount,
      candidates: ranked.map((c, index) => ({
        rank: index + 1,
        candidate_id: c.candidate_id,
        name: c.profile.anonymized_name,
        title: c.profile.current_title,
        experience: c.profile.years_of_experience,
        company: c.profile.current_company,
        score: Number(c.score.toFixed(2))
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
};

exports.downloadCSV = async (req, res) => {
  try {
    const userResult = await pool.query("SELECT plan FROM users WHERE id = $1", [req.user.id]);
    const userPlan = userResult.rows[0]?.plan || "free";

    if (userPlan === "free") {
      return res.status(403).json({
        success: false,
        message: "Exporting reports is a Premium feature. Please upgrade to download CSV reports."
      });
    }

    const filePath = path.resolve("./output/submission.csv");
    if (fs.existsSync(filePath)) {
      res.download(filePath, "ranked_candidates.csv");
    } else {
      res.status(404).json({
        success: false,
        message: "No shortlist CSV has been generated yet. Please run ranking first."
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};