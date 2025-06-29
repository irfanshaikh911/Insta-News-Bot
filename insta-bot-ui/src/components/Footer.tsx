import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/10 backdrop-blur-md text-black py-10 px-6 mt-10 border-t border-black/20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo + Social */}
        <div className="flex flex-col items-center">
          <img
            src="/Instanews.jpg" // 🔁 Replace this with your actual logo if needed
            alt="InstaBot Logo"
            className="w-42 h-24 mb-4"
          />
          <div className="flex space-x-6">
            <a href="#" className="htext-purple-400">
              <FaFacebookF className="text-3xl"/>
            </a>
            <a href="#" className="text-purple-400">
              <FaInstagram className="text-3xl"/>
            </a>
            <a href="#" className="text-purple-400">
              <FaTwitter className="text-3xl"/>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Contact</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Write to us */}
        <div>
          <h4 className="font-semibold mb-3">Write to us</h4>
          <form className="flex flex-col space-y-2 text-sm">
            <input
              type="email"
              placeholder="Write your Message here..."
              className="border-white/30 rounded-md h-20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              type="submit"
              className="bg-purple-700 hover:bg-purple-800 rounded px-3 py-2"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Footer Credit */}
        <div className="text-sm flex flex-col justify-center items-center md:items-start text-black">
          <p>© {new Date().getFullYear()} InstaBot</p>
          <p>All rights reserved.</p>
          Built with 💜 by <span className="text-lg font-semibold">Team InstaBot</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
