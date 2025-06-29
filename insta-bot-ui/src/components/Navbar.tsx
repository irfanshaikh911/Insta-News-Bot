import React, { useEffect, useState } from "react";
import { FaUserCircle, FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp } from "react-icons/fa";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const [location, setLocation] = useState("Fetching location...");

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
          setLocation("India");
        }
      })
      .catch(() => setLocation("India"));
  }, []);

  return (
    <nav className="w-full bg-white/10 backdrop-blur-md border-b border-gray-200 text-black font-sans py-6 px-6">
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-y-4">
        {/* Left: Date & Location */}
        <div className="flex flex-col items-start self-start md:self-center space-y-1">
          <span className="text-base font-semibold">{today}</span>
          <span className="text-sm text-gray-700">📍 {location}</span>
        </div>


        {/* Center: Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img
            src="/Instanews.png"
            alt="Logo"
            className="h-24 object-contain"
          />
        </div>

        {/* Right: Login, Social, Search */}
        <div className="flex flex-col items-end space-y-3 self-start md:self-center">
          {/* Login */}
          <button className="flex items-center text-base font-medium hover:text-purple-600 space-x-1">
            <FaUserCircle className="text-2xl" />
            <span>Login</span>
          </button>

          {/* Social Icons */}


          {/* Search */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search"
              className="text-sm border border-gray-300 rounded-md px-3 py-1 w-52 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button className="bg-purple-700 hover:bg-purple-800 text-white text-sm font-medium px-4 py-1 rounded-md">
              Search
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
