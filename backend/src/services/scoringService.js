exports.rankCandidates = (candidates) => {
  const ranked = candidates.map((candidate) => {
    let score = 0;

    const profile = candidate.profile || {};
    const skills = candidate.skills || [];
    const history = candidate.career_history || [];
    const signals = candidate.redrob_signals || {};

    const skillNames = skills.map((s) => s.name.toLowerCase());

    const historyText = history
      .map((h) => h.description || "")
      .join(" ")
      .toLowerCase();

    const eliteKeywords = [
      "learning to rank",
      "ltr",
      "vector search",
      "semantic search",
      "retrieval augmented generation",
      "ann search",
      "candidate ranking",
      "relevance ranking",
      "search relevance",
    ];

    eliteKeywords.forEach((keyword) => {
      if (historyText.includes(keyword)) score += 120;
    });

    const title = (profile.current_title || "").toLowerCase();

    const eliteTitles = [
      "search engineer",
      "recommendation systems engineer",
      "recommender systems engineer",
      "ranking engineer",
      "retrieval engineer",
    ];

    if (eliteTitles.some((t) => title.includes(t))) {
      score += 300;
    }

    const yoe = profile.years_of_experience || 0;

    if (yoe >= 5 && yoe <= 9) {
      score += 120;
    } else if (yoe > 9 && yoe <= 12) {
      score += 80;
    } else if (yoe > 12) {
      score += 20;
    } else if (yoe >= 3) {
      score += 40;
    }

    if (title.includes("search")) score += 80;

    if (title.includes("recommendation")) score += 80;

    if (title.includes("ml")) score += 40;

    if (title.includes("machine learning")) score += 40;

    if (title.includes("ai engineer")) score += 50;

    if (title.includes("nlp")) score += 40;

    if (title.includes("applied scientist")) score += 60;

    if (title.includes("staff machine learning")) score += 60;

    if (title.includes("senior machine learning")) score += 50;

    if (title.includes("analyst")) score -= 30;

    if (title.includes("etl")) score -= 30;

    if (title.includes("analytics")) score -= 25;


    if (historyText.includes("retrieval")) score += 200;

    if (historyText.includes("search")) score += 200;

    if (historyText.includes("rag")) score += 200;

    if (historyText.includes("ranking")) score += 200;

    if (historyText.includes("recommendation")) score += 200;

    if (historyText.includes("embedding")) score += 180;

    if (
      historyText.includes("ndcg") ||
      historyText.includes("mrr") ||
      historyText.includes("map")
    ) {
      score += 150;
    }

    const vectorDBs = ["milvus", "pinecone", "qdrant", "weaviate", "faiss"];

    vectorDBs.forEach((db) => {
      if (historyText.includes(db)) score += 60;
      else if (skillNames.includes(db)) score += 20;
    });

    if (historyText.includes("python")) score += 50;

    if (skillNames.includes("fine-tuning llms")) score += 40;

    if (skillNames.includes("lora")) score += 20;

    const badCompanies = [
      "infosys",
      "tcs",
      "wipro",
      "accenture",
      "cognizant",
      "capgemini",
      "mindtree",
    ];

    const currentCompany = (profile.current_company || "").toLowerCase();

    if (!badCompanies.some((c) => currentCompany.includes(c))) {
      score += 40;
    }

    if (signals.open_to_work_flag) score += 40;

    score += (signals.recruiter_response_rate || 0) * 100;

    score += (signals.github_activity_score || 0) * 5;

    score += (signals.profile_completeness_score || 0) * 0.5;

    const notice = signals.notice_period_days || 0;

    if (notice > 120) score -= 120;
    else if (notice > 90) score -= 80;
    else if (notice > 60) score -= 40;

    if (signals.last_active_date) {
      const daysInactive = Math.floor(
        (new Date() - new Date(signals.last_active_date)) /
          (1000 * 60 * 60 * 24),
      );

      if (daysInactive > 180) score -= 120;
      else if (daysInactive > 90) score -= 60;
      else if (daysInactive > 60) score -= 20;
    }

    return {
      ...candidate,
      score,
    };
  });

  ranked.sort((a, b) => b.score - a.score);

  return ranked.slice(0, 100);
};
