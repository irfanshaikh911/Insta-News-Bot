// src/main.tsx
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import NewsDetailPage from "./pages/NewsDetailPage";
import Dashboard from "./pages/PostedDashboard";
import InstagramLogin from "./pages/InstagramLogin";
import "./index.css";

const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // state lifted up

  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<App isLoggedIn={isLoggedIn} />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/instagram-login"
            element={<InstagramLogin setIsLoggedIn={setIsLoggedIn} />}
          />
        </Routes>
      </Router>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<Main />);
