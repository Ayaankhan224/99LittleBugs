import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useAuth } from "../../context/AuthContext";
import { TransitionLink } from "../../pages/Loading";

const FormContent = () => {
  const fillRef = useRef(null);
  const { user } = useAuth();
  const currentPlan = user?.plan || "free";

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [topCandidates, setTopCandidates] = useState(null);

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentPlan === "free") {
      setTopCandidates(5);
    }
  }, [currentPlan]);

  const handleEnter = () => {
    gsap.to(fillRef.current, {
      scaleY: 1,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const handleLeave = () => {
    gsap.to(fillRef.current, {
      scaleY: 0,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      if (currentPlan === "free" && selectedFiles.length > 5) {
        setError("Free plan is limited to a maximum of 5 resume uploads. Please upgrade to Premium for unlimited uploads.");
        setFiles([]);
        return;
      }

      setFiles(selectedFiles);
      setError("");
      setResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobTitle.trim()) {
      setError("Please fill out the Job Title.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please fill out the Job Description.");
      return;
    }
    if (files.length === 0) {
      setError("Please select at least one PDF, DOCX, CSV, or ZIP file.");
      return;
    }
    if (!experience) {
      setError("Please select the Required Experience.");
      return;
    }
    if (!topCandidates) {
      setError("Please select the number of Candidates to Shortlist.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("experience", experience);
    formData.append("limit", topCandidates);
    formData.append("jobTitle", jobTitle);
    formData.append("jobDescription", jobDescription);

    try {
      const token = user?.token;
      if (!token) {
        throw new Error("You must be logged in to rank candidates.");
      }

      const response = await fetch("https://anker-9k4b.onrender.com/api/rank", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to process files");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "An unexpected error occurred during ranking.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!user) return;
    try {
      setError("");
      const response = await fetch("https://anker-9k4b.onrender.com/api/rank/download", {
        headers: {
          "Authorization": `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to export report.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ranked_candidates.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Could not download report.");
    }
  };

  return (
    <div className="w-full max-w-[650px] flex flex-col gap-6 py-10 font-[poppins]">
      <div className={`p-4 rounded-3xl border flex justify-between items-center text-sm font-medium ${
        currentPlan === "free" 
          ? "bg-amber-50/50 border-amber-200 text-amber-800" 
          : "bg-emerald-50/50 border-emerald-200 text-emerald-800"
      }`}>
        <div>
          <span>Current Plan: </span>
          <span className="font-bold uppercase">{currentPlan}</span>
          {currentPlan === "free" && (
            <p className="text-xs font-light text-amber-700 mt-1">
              (Limited to 5 uploads, top 5 shortlist, locked CSV exports)
            </p>
          )}
          {currentPlan === "premium" && (
            <p className="text-xs font-light text-emerald-700 mt-1">
              (All premium features unlocked!)
            </p>
          )}
        </div>
        {currentPlan === "free" && (
          <TransitionLink to="/pricing">
            <span className="bg-[#E67A3C] hover:bg-[#d86d34] text-white py-2 px-4 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm shadow-orange-100">
              Upgrade
            </span>
          </TransitionLink>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm mb-2 uppercase tracking-wider text-neutral-500 font-bold">
            Job Title
          </label>
          <input
            type="text"
            placeholder="Frontend Developer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full border-b border-[#d7d1c5] bg-transparent pb-4 text-2xl outline-none placeholder:text-neutral-400 focus:border-[#E67A3C] transition-all"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 uppercase tracking-wider text-neutral-500 font-bold">
            Job Description
          </label>
          <textarea
            rows={3}
            placeholder="Paste the complete job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full resize-none border-b border-[#d7d1c5] bg-transparent pb-4 text-lg outline-none placeholder:text-neutral-400 focus:border-[#E67A3C] transition-all"
          />
        </div>

        <div>
          <label className="block text-sm mb-4 uppercase tracking-wider text-neutral-500 font-bold">
            Upload Resumes {currentPlan === "free" && <span className="text-amber-600 font-medium">(Max 5)</span>}
          </label>

          <label className="flex flex-col items-center justify-center min-h-[160px] border-2 border-dashed border-[#d7d1c5] rounded-3xl cursor-pointer hover:border-[#E67A3C] hover:bg-orange-50/10 transition-all p-6">
            <div className="text-center">
              <p className="text-lg font-medium text-neutral-800">Upload CSV / PDF / DOCX / ZIP</p>
              <p className="text-sm text-neutral-500 mt-1">
                {currentPlan === "free" ? "Up to 5 files supported" : "Multiple files and zipped files supported"}
              </p>
            </div>

            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.csv,.zip"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {files.length > 0 && (
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 max-h-[180px] overflow-y-auto">
            <p className="text-sm font-semibold text-neutral-700 mb-2">Selected Files ({files.length}):</p>
            <ul className="text-xs text-neutral-600 space-y-1">
              {files.map((file, index) => (
                <li key={index} className="flex justify-between items-center bg-white border border-neutral-100 p-2 rounded-lg">
                  <span className="truncate pr-4 font-mono font-medium">{file.name}</span>
                  <span className="text-neutral-400 shrink-0">{(file.size / 1024).toFixed(1)} KB</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="mb-4 text-xl font-medium">Minimum Experience</h3>
          <div className="flex flex-wrap gap-3">
            {["0-2 Years", "2-5 Years", "5+ Years"].map((item) => (
              <label key={item} className="cursor-pointer">
                <input
                  type="radio"
                  name="experience"
                  value={item}
                  checked={experience === item}
                  onChange={(e) => setExperience(e.target.value)}
                  className="hidden peer"
                />
                <div className="rounded-full border border-[#d7d1c5] px-6 py-3 transition-all duration-300 peer-checked:bg-[#E67A3C] peer-checked:text-white">
                  {item}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xl font-medium">Candidates to Shortlist</h3>
          <div className="flex gap-3 flex-wrap">
            {[5, 10, 15, 20, 50].map((item) => {
              if (currentPlan === "free" && item > 5) return null;
              return (
                <label key={item} className="cursor-pointer">
                  <input
                    type="radio"
                    name="topCandidates"
                    value={item}
                    checked={topCandidates === item}
                    onChange={(e) => setTopCandidates(Number(e.target.value))}
                    className="hidden peer"
                  />
                  <div className="rounded-full border border-[#d7d1c5] px-6 py-3 transition-all duration-300 peer-checked:bg-[#E67A3C] peer-checked:text-white">
                    Top {item}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          className="w-full relative overflow-hidden mt-6 bg-[#111] text-white px-10 py-5 text-lg rounded-full cursor-pointer hover:scale-[1.02] active:scale-[0.98] duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span className="font-bold relative z-10">
            {loading ? "RANKING CANDIDATES..." : "GENERATE SHORTLIST"}
          </span>
          <div
            ref={fillRef}
            className="absolute inset-0 bg-[#E67A3C] origin-bottom scale-y-0"
          />
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8 border border-[#d7d1c5] rounded-3xl p-6 bg-white shadow-xl shadow-neutral-100 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-[#d7d1c5] pb-4">
            <div>
              <h3 className="text-2xl font-bold text-neutral-900">Ranked Shortlist</h3>
              <p className="text-sm text-neutral-500 mt-1">Processed {result.count} candidates successfully</p>
            </div>
            <button
              onClick={handleDownload}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-md cursor-pointer ${
                currentPlan === "free"
                  ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  : "bg-[#E67A3C] hover:bg-[#d86d34] text-white shadow-orange-100"
              }`}
              disabled={currentPlan === "free"}
            >
              Download CSV
            </button>
          </div>

          {currentPlan === "free" && (
            <div className="text-xs bg-amber-50 border border-amber-100 text-amber-800 p-3 rounded-2xl">
              💡 <strong>Free plan limit:</strong> Showing only top 5 candidates. Upgrade to Premium to export the complete report.
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-xs uppercase text-neutral-400 font-semibold">
                  <th className="py-3 px-2">Rank</th>
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">Current Title</th>
                  <th className="py-3 px-2">Experience</th>
                  <th className="py-3 px-2">Company</th>
                  <th className="py-3 px-2 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-sm">
                {result.candidates.map((cand) => (
                  <tr key={cand.candidate_id} className="hover:bg-neutral-50/50 transition-all">
                    <td className="py-4 px-2 font-bold text-[#E67A3C]">#{cand.rank}</td>
                    <td className="py-4 px-2 font-medium text-neutral-800">{cand.name}</td>
                    <td className="py-4 px-2 text-neutral-600 truncate max-w-[150px]">{cand.title}</td>
                    <td className="py-4 px-2 text-neutral-500">{cand.experience} yrs</td>
                    <td className="py-4 px-2 text-neutral-600 truncate max-w-[120px]">{cand.company}</td>
                    <td className="py-4 px-2 text-right font-mono font-bold text-neutral-900">{cand.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormContent;
