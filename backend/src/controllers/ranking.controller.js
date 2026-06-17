const candidateLoader = require("../services/candidateLoader");
const scoringService = require("../services/scoringService");
const csvGenerator = require("../services/csvGenerator");

exports.generateRanking = async (req, res) => {
  try {
    const candidates = await candidateLoader.loadCandidates();
    const ranked = scoringService.rankCandidates(candidates);
    const csvCount = await csvGenerator.createCSV(ranked);

    res.json({
      success: true,
      count: ranked.length,
      csvRecords: csvCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
};