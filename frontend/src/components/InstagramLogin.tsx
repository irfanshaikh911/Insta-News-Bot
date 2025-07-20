// src/components/InstagramLogin.tsx
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saveInfo, setSaveInfo] = useState(true);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/save-instagram-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, save: saveInfo }),
      });

      const result = await response.json();
      if (response.ok && result.status === "success") {
        onLoginSuccess();
      } else {
        setError(result.message || "Login failed.");
      }
    } catch (err) {
      setError("Server error.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg space-y-4">
        <h2 className="text-xl font-bold text-purple-800 text-center">Login to Instagram</h2>

        <input
          type="text"
          placeholder="Instagram Username"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Instagram Password"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-2.5 right-3 text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={saveInfo}
            onChange={() => setSaveInfo(!saveInfo)}
          />
          <span>Save credentials</span>
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-sm px-4 py-1 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-purple-700 hover:bg-purple-800 text-white text-sm px-4 py-1 rounded"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
