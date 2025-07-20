import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/our-logo.jpg"; // Update to your actual logo

interface InstagramLoginProps {
  setIsLoggedIn: (val: boolean) => void;
}

const InstagramLogin: React.FC<InstagramLoginProps> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setShowSavePrompt(true);
  };

  const handleSaveLogin = async () => {
    try {
      await axios.post("https://insta-news-bot-1.onrender.com/save-instagram-login", {
        username,
        password,
      });

      setIsLoggedIn(true);
      navigate("/");
    } catch (err) {
      setError("❌ Failed to save login info.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 space-y-6 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={logo}
            alt="InstaBot Logo"
            className="h-20 w-auto rounded-lg shadow-md"
          />
        </div>

        {/* Back to Home */}
        <button
          onClick={() => navigate("/")}
          className="text-sm text-purple-600 underline hover:text-purple-800 transition mb-4"
        >
          ← Back to Home
        </button>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-purple-700">Login to InstaBot</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Instagram Username
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>
      </div>

      {/* Save Login Modal */}
      {showSavePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Save login info?
            </h3>
            <p className="text-sm text-gray-600">
              Do you want to save your login details for future InstaBot automation?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleSaveLogin}
                className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => navigate("/")}
                className="border border-gray-400 text-gray-700 px-4 py-2 rounded-lg"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstagramLogin;
