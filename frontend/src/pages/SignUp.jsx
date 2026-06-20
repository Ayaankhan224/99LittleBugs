import React, { useState } from "react";
import Back from "../components/common/Back";
import { TransitionLink, useTransition } from "./Loading";
import { useAuth } from "../context/AuthContext";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const { transitionTo } = useTransition();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://anker-9k4b.onrender.com/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      login({ token: data.token, username: data.username });

      setSuccess("Account created successfully! Redirecting to pricing...");
      setUsername("");
      setPassword("");

      setTimeout(() => {
        transitionTo("/pricing");
      }, 1500);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center font-[poppins]">
      <div className="bg-white h-180 w-340 rounded-3xl shadow-[0_10px_60px_rgba(0,0,0,0.4)] p-2 flex">
        <div className="w-[40%] h-full rounded-l-3xl overflow-hidden">
          <img src="/sign-img.png" className="object-cover h-full w-full" />
        </div>
        <div className="w-[60%] h-full rounded-r-3xl p-15 flex flex-col justify-between">
          <Back />
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-[poppins]">Sign-Up to</h3>
            <h1 className="text-9xl font-[oran]">ANKER</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-medium border border-green-100">
                {success}
              </div>
            )}
            
            <input
              className="bg-[#F1EEEA] rounded-full text-[1rem] p-3 px-5 outline-none focus:ring-2 focus:ring-[#E56E3A] transition-all"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            <input
              className="bg-[#F1EEEA] rounded-full text-[1rem] p-3 px-5 outline-none focus:ring-2 focus:ring-[#E56E3A] transition-all"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <p className="text-[0.9rem] px-2">
              Already have an account?{" "}
              <TransitionLink to="/login" className="text-blue-700 hover:underline">
                Log-In
              </TransitionLink>
            </p>
            
            <div className="mt-2">
              <button
                type="submit"
                disabled={loading}
                className="text-black text-[1rem] font-[poppins] py-3 px-8 rounded-full bg-[#F1EEEA] hover:bg-[#E56E3A] hover:text-white hover:scale-105 duration-150 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Registering..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
