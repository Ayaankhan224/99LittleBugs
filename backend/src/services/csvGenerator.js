const createCsvWriter = require("csv-writer").createObjectCsvWriter;

exports.createCSV = async (candidates) => {
  const writer = createCsvWriter({
    path: "./output/submission.csv",

    header: [
      {
        id: "candidate_id",
        title: "candidate_id",
      },
      {
        id: "rank",
        title: "rank",
      },
      {
        id: "score",
        title: "score",
      },
      {
        id: "reasoning",
        title: "reasoning",
      },
    ],
  });

  const rows = candidates.map((candidate, index) => {
    const profile = candidate.profile || {};

    const skills = candidate.skills || [];

    const signals = candidate.redrob_signals || {};

    const historyText = (candidate.career_history || [])
      .map((h) => h.description || "")
      .join(" ")
      .toLowerCase();

    const strengths = [];

    if (
      historyText.includes("search engine") ||
      historyText.includes("semantic search") ||
      historyText.includes("vector search")
    )
      strengths.push("production search systems");

    if (historyText.includes("retrieval")) strengths.push("retrieval systems");

    if (
      historyText.includes("learning to rank") ||
      historyText.includes("candidate ranking") ||
      historyText.includes("relevance ranking")
    )
      strengths.push("ranking models");

    if (historyText.includes("recommendation"))
      strengths.push("recommendation systems");

    if (historyText.includes("embedding"))
      strengths.push("embedding-based retrieval");

    if (historyText.includes("rag")) strengths.push("RAG applications");

    if (historyText.includes("vector")) strengths.push("vector search");

    if (historyText.includes("learning to rank"))
      strengths.push("learning-to-rank pipelines");

    const reasoning = `${profile.years_of_experience || 0} years experience as ${profile.current_title} at ${profile.current_company}. Demonstrated experience in ${strengths.slice(0, 3).join(", ") || "machine learning systems"}. Recruiter response rate ${Math.round((signals.recruiter_response_rate || 0) * 100)}% and profile completeness ${signals.profile_completeness_score || 0}%.`;

    return {
      candidate_id: candidate.candidate_id,

      rank: index + 1,

      score: candidate.score.toFixed(2),

      reasoning,
    };
  });

  await writer.writeRecords(rows);

  return rows.length;
};
