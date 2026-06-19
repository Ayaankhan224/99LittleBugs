const fs = require("fs");
const readline = require("readline");
const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");
const AdmZip = require("adm-zip");
const csv = require("csv-parser");
const { Readable } = require("stream");

exports.loadCandidates = async () => {
  const candidates = [];
  const rl = readline.createInterface({
    input: fs.createReadStream("./data/candidates.jsonl")
  });

  for await (const line of rl) {
    candidates.push(JSON.parse(line));
  }
  return candidates;
};

async function parseCSV(buffer) {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(buffer);
    stream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

function mapCSVRowToCandidate(row, index) {
  const candidate_id = row.candidate_id || row.id || `CAND_CSV_${Date.now()}_${index}`;
  const name = row.anonymized_name || row.name || row.full_name || `Candidate ${index + 1}`;
  const current_title = row.current_title || row.title || row.job_title || "Software Engineer";
  let years_of_experience = parseFloat(row.years_of_experience || row.experience || row.yoe || "3");
  if (isNaN(years_of_experience)) {
    years_of_experience = 3;
  }
  const current_company = row.current_company || row.company || "Unknown Company";

  let skills = [];
  const skillsRaw = row.skills || row.skill_names || "";
  if (skillsRaw) {
    if (typeof skillsRaw === "string") {
      skills = skillsRaw.split(/[;,]/).map(s => ({ name: s.trim() })).filter(s => s.name.length > 0);
    } else if (Array.isArray(skillsRaw)) {
      skills = skillsRaw.map(s => ({ name: typeof s === 'object' ? s.name : String(s) }));
    }
  }
  let career_history = [];
  const historyRaw = row.career_history || row.history || row.description || row.summary || "";
  if (historyRaw) {
    career_history = [{ description: String(historyRaw) }];
  }
  const redrob_signals = {
    profile_completeness_score: parseFloat(row.profile_completeness_score || row.profile_completeness || "90"),
    open_to_work_flag: String(row.open_to_work_flag || row.open_to_work || "true").toLowerCase() === "true",
    github_activity_score: parseFloat(row.github_activity_score || row.github_score || "0"),
    recruiter_response_rate: parseFloat(row.recruiter_response_rate || "0.8"),
    notice_period_days: parseInt(row.notice_period_days || row.notice_period || "0", 10),
    last_active_date: row.last_active_date || new Date().toISOString().split("T")[0]
  };

  return {
    candidate_id,
    profile: {
      anonymized_name: name,
      current_title,
      years_of_experience,
      current_company
    },
    skills,
    career_history,
    redrob_signals
  };
}

function parseResumeText(text, filename) {
  const lowerText = text.toLowerCase();

  const baseName = filename.replace(/\.[^/.]+$/, "");
  const name = baseName
    .replace(/[_-]/g, " ")
    .replace(/\b(resume|cv|file)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim() || "Candidate";

  const candidate_id = `CAND_${baseName.replace(/[^a-zA-Z0-9]/g, "_")}`;

  const eliteTitles = [
    "recommendation systems engineer", "recommender systems engineer",
    "search engineer", "ranking engineer", "retrieval engineer",
  ];
  const otherTitles = [
    "staff machine learning", "senior machine learning", "machine learning engineer", "ml engineer",
    "ai engineer", "applied scientist", "nlp engineer", "software engineer",
    "developer", "analyst", "etl", "analytics"
  ];
  let current_title = "";
  for (const t of [...eliteTitles, ...otherTitles]) {
    if (lowerText.includes(t)) {
      current_title = t.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      break;
    }
  }
  if (!current_title) {
    if (lowerText.includes("engineer") || lowerText.includes("developer")) {
      current_title = "Software Engineer";
    } else {
      current_title = "Candidate";
    }
  }

  const yoeRegex = /(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs)\b/gi;
  let match;
  let years_of_experience = 3.0;
  let maxYears = 0;
  while ((match = yoeRegex.exec(text)) !== null) {
    const val = parseFloat(match[1]);
    if (val > maxYears && val < 50) {
      maxYears = val;
    }
  }
  if (maxYears > 0) {
    years_of_experience = maxYears;
  }

  const badCompanies = [
    "infosys", "tcs", "wipro", "accenture", "cognizant", "capgemini", "mindtree"
  ];
  const topCompanies = [
    "google", "meta", "facebook", "apple", "microsoft", "amazon", "netflix"
  ];
  let current_company = "Unknown Company";
  for (const c of [...badCompanies, ...topCompanies]) {
    if (lowerText.includes(c)) {
      current_company = c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }

  const skillsToSearch = [
    "milvus", "pinecone", "qdrant", "weaviate", "faiss", "python",
    "fine-tuning llms", "lora", "nlp", "image classification",
    "speech recognition", "weights & biases", "tts", "apache beam",
    "aws", "flask", "bentoml", "gcp", "react", "typescript", "javascript",
    "sql", "spark", "airflow"
  ];
  const skills = [];
  skillsToSearch.forEach(skill => {
    if (lowerText.includes(skill)) {
      const displayName = skill.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      skills.push({ name: displayName });
    }
  });

  const career_history = [{ description: text }];

  const redrob_signals = {
    profile_completeness_score: 95,
    open_to_work_flag: lowerText.includes("open to work") || lowerText.includes("actively looking") || lowerText.includes("immediate joiner"),
    github_activity_score: lowerText.includes("github.com") ? 50 : 0,
    recruiter_response_rate: 0.85,
    notice_period_days: lowerText.includes("notice period") ? 30 : 0,
    last_active_date: new Date().toISOString().split("T")[0]
  };

  return {
    candidate_id,
    profile: {
      anonymized_name: name,
      current_title,
      years_of_experience,
      current_company
    },
    skills,
    career_history,
    redrob_signals
  };
}

async function parsePdfBuffer(buffer, filename) {
  const originalWarn = console.warn;
  console.warn = () => {};

  try {
    const parser = new PDFParse(new Uint8Array(buffer));
    const textResult = await parser.getText();
    return parseResumeText(textResult.text, filename);
  } catch (pdfErr) {
    const textContent = buffer.toString("utf8");
    const isBinary = /[\x00-\x08\x0E-\x1F\x80-\xFF]/.test(textContent.slice(0, 100));
    if (!isBinary && textContent.trim().length > 0) {
      console.log(`Failed to parse ${filename} as PDF; falling back to parsing as plain text.`);
      return parseResumeText(textContent, filename);
    } else {
      throw pdfErr;
    }
  } finally {
    console.warn = originalWarn;
  }
}

async function parseDocxBuffer(buffer, filename) {
  try {
    const docxData = await mammoth.extractRawText({ buffer });
    return parseResumeText(docxData.value, filename);
  } catch (docxErr) {
    const textContent = buffer.toString("utf8");
    const isBinary = /[\x00-\x08\x0E-\x1F\x80-\xFF]/.test(textContent.slice(0, 100));
    if (!isBinary && textContent.trim().length > 0) {
      console.log(`Failed to parse ${filename} as DOCX; falling back to parsing as plain text.`);
      return parseResumeText(textContent, filename);
    } else {
      throw docxErr;
    }
  }
}

exports.loadCandidatesFromFiles = async (files) => {
  const candidates = [];

  for (const file of files) {
    const filename = file.originalname;
    const buffer = file.buffer;
    const lowerName = filename.toLowerCase();

    try {
      if (lowerName.endsWith(".zip")) {
        const zip = new AdmZip(buffer);
        const zipEntries = zip.getEntries();

        for (const entry of zipEntries) {
          if (!entry.isDirectory) {
            const entryName = entry.entryName;
            const innerFilename = entryName.split("/").pop();
            const innerLowerName = innerFilename.toLowerCase();
            const entryBuffer = entry.getData();

            try {
              if (innerLowerName.endsWith(".pdf")) {
                const cand = await parsePdfBuffer(entryBuffer, innerFilename);
                candidates.push(cand);
              } else if (innerLowerName.endsWith(".docx")) {
                const cand = await parseDocxBuffer(entryBuffer, innerFilename);
                candidates.push(cand);
              } else if (innerLowerName.endsWith(".csv")) {
                const csvRows = await parseCSV(entryBuffer);
                csvRows.forEach((row, index) => {
                  candidates.push(mapCSVRowToCandidate(row, index));
                });
              }
            } catch (innerErr) {
              console.error(`Error processing file ${entryName} inside ZIP:`, innerErr);
            }
          }
        }
      } else if (lowerName.endsWith(".pdf")) {
        const cand = await parsePdfBuffer(buffer, filename);
        candidates.push(cand);
      } else if (lowerName.endsWith(".docx")) {
        const cand = await parseDocxBuffer(buffer, filename);
        candidates.push(cand);
      } else if (lowerName.endsWith(".csv")) {
        const csvRows = await parseCSV(buffer);
        csvRows.forEach((row, index) => {
          candidates.push(mapCSVRowToCandidate(row, index));
        });
      }
    } catch (err) {
      console.error(`Error processing uploaded file ${filename}:`, err);
    }
  }

  return candidates;
};

if (process.env.NODE_ENV === "test") {
  exports.parseResumeText = parseResumeText;
  exports.mapCSVRowToCandidate = mapCSVRowToCandidate;
}