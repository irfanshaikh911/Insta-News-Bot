import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import defaultLogo from "../assets/Instanews.png";
import loggedInLogo from "../assets/our-logo.jpg"; // make sure path is correct

const Navbar: React.FC = () => {
  const [location, setLocation] = useState("Fetching location...");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data?.city && data?.country_name) {
          setLocation(`${data.city}, ${data.country_name}`);
        } else {
          setLocation("Pune, India");
        }
      })
      .catch(() => setLocation("Pune, India"));

    const loginData = localStorage.getItem("insta_login");
    if (loginData) setIsLoggedIn(true);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleLogin = () => {
    navigate("/instagram-login");
  };

  return (
    <nav className="w-full bg-white/10 backdrop-blur-md border-b border-gray-200 text-black font-sans px-4 py-4 sm:px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-purple-700 text-white text-sm font-medium px-4 py-1 rounded-md hover:bg-purple-800 transition"
          >
            📊 Dashboard
          </button>

          <div className="flex flex-col text-left">
            <span className="text-base font-semibold">{today}</span>
            <span className="text-sm text-gray-700">📍 {location}</span>
          </div>
        </div>

        {/* CENTER: LOGO */}
        <div className="flex justify-center flex-shrink-0 w-full md:w-auto">
          <img
            src={isLoggedIn ? loggedInLogo : defaultLogo}
            alt="Logo"
            className="h-20 sm:h-24 object-contain transition-all duration-500 ease-in-out rounded-md"
          />
        </div>

        {/* RIGHT SIDE: LOGIN + SEARCH */}
        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          {/* Login */}
          <button
            onClick={handleLogin}
            className="flex items-center text-base font-medium hover:text-purple-600 space-x-1"
          >
            <FaUserCircle className="text-2xl" />
            <span>{isLoggedIn ? "Logged In" : "Login"}</span>
          </button>

          {/* Search Bar */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 w-52 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={handleSearch}
              className="bg-purple-700 hover:bg-purple-800 text-white text-sm font-medium px-4 py-1 rounded-md"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
