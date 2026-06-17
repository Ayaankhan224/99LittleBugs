const fs = require("fs");
const readline = require("readline");

exports.loadCandidates = async () => {

  const candidates = [];

  const rl = readline.createInterface({
    input: fs.createReadStream(
      "./data/candidates.jsonl"
    )
  });

  for await (const line of rl) {
    candidates.push(JSON.parse(line));
  }
  return candidates;
};