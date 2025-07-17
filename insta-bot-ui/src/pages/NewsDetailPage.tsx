import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Papa from "papaparse";
import Navbar from "../components/Navbar";
import SocialMediaPreview from "../components/SocialMediaPreview";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";


interface NewsItem {
  title: string;
  summary: string;
  url: string;
  publisher: string;
  image: string;
  category: string;
  full_story: string;
}

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const decodedTitle = decodeURIComponent(id || "");
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState<"instagram" | "facebook" | "twitter" | "whatsapp">("instagram");
  const [showSummaryOnly, setShowSummaryOnly] = useState(false);
  const [challengeRequired, setChallengeRequired] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [submittingCode, setSubmittingCode] = useState(false);
  const [posting, setPosting] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);

  const defaultImage = "/no-image.jpg";

  useEffect(() => {
    fetch("/news_feed.csv")
      .then((res) => res.text())
      .then((csvText) => {
        const parsed = Papa.parse<NewsItem>(csvText, {
          header: true,
          skipEmptyLines: true,
        });
        const item = parsed.data.find((item) => item.title === decodedTitle);
        if (item) setNewsItem(item);
        setLoading(false);
      });
  }, [id]);

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (phone: string) => /^\+?[0-9]{10,15}$/.test(phone);

  const sendEmail = async () => {
    if (!validateEmail(email)) {
      alert("❌ Invalid email address");
      return;
    }
    setSending(true);
    const res = await fetch("http://localhost:5000/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        subject: newsItem?.title,
        body: `${newsItem?.summary}\n\nRead full: ${newsItem?.url}`,
        link: newsItem?.url,
        image: newsItem?.image,
      }),
    });
    const data = await res.json();
    alert(data.success ? "✅ Email sent!" : "❌ Email failed: " + data.error);
    setSending(false);
  };

  const sendSMS = async () => {
    if (!validatePhone(phone)) {
      alert("❌ Invalid phone number. Use format +91XXXXXXXXXX");
      return;
    }
    setSending(true);
    const res = await fetch("http://localhost:5000/send-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: phone,
        message: `${newsItem?.title}\n\nRead more: ${newsItem?.url}`,
      }),
    });
    const data = await res.json();
    alert(data.success ? "✅ SMS sent!" : "❌ SMS failed: " + data.error);
    setSending(false);
  };

  const generateSummary = (text: string) => {
    const words = text.split(" ");
    return words.slice(0, 70).join(" ") + (words.length > 70 ? "..." : "");
  };

  const handlePostNow = async () => {
    if (!newsItem) return;

    setPosting(true);
    try {
      const response = await fetch("http://localhost:5000/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newsItem.title,
          summary: newsItem.summary,
          full_story: newsItem.full_story,
          url: newsItem.url,
          image: newsItem.image,
          category: newsItem.category,
        }),
      });

      const result = await response.json();
      setPosting(false);

      if (result.challenge_required) {
        setChallengeRequired(true);
      } else if (result.success) {
        alert("✅ Posted with AI!");
      } else {
        alert("❌ Error: " + result.error);
      }
    } catch (err) {
      setPosting(false);
      alert("❌ Error posting: " + (err as any).message);
    }
  };

  const handleSubmitCode = async () => {
    if (!codeInput) return;

    setSubmittingCode(true);
    const response = await fetch("http://localhost:5000/submit-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: codeInput }),
    });

    const result = await response.json();
    setSubmittingCode(false);

    if (result.success) {
      alert("✅ Verification successful! Now click 'Post Now' again.");
      setChallengeRequired(false);
      setCodeInput("");
    } else {
      alert("❌ Code failed: " + result.error);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  if (!newsItem) return <p className="text-center mt-10 text-red-500">Article not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-12 md:gap-16">
        {/* Left Content */}
        <div className="flex-1 w-full">
          <Link to="/" className="text-purple-700 underline mb-4 inline-block">← Back to Home</Link>
          <h1 className="text-4xl font-extrabold mb-4 text-gray-800">{newsItem.title}</h1>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold">Publisher:</span> {newsItem.publisher} |{" "}
            <span className="font-semibold">Category:</span> {newsItem.category}
          </p>

          <img
            src={newsItem.image?.trim() || defaultImage}
            alt={newsItem.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultImage;
            }}
            className="w-full h-auto object-contain rounded-lg mb-6 max-h-[480px] shadow-md"
          />

          <div className="mb-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={showSummaryOnly}
                onChange={() => setShowSummaryOnly(!showSummaryOnly)}
                className="accent-purple-700"
              />
              <span className="text-sm text-gray-700">Show Summary Only</span>
            </label>
          </div>

          <p className="text-lg whitespace-pre-line mb-6 leading-relaxed">
            {showSummaryOnly
              ? generateSummary(newsItem.full_story || newsItem.summary)
              : newsItem.full_story || "Full story not available."}
          </p>

          <a
            href={newsItem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition"
          >
            Read Original Article →
          </a>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-[380px] py-6 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            Preview on {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </h2>

          <div className="w-full flex justify-center">
            <SocialMediaPreview
              platform={platform}
              image={newsItem.image}
              title={newsItem.title}
              summary={newsItem.summary}
              hashtags={["Breaking", newsItem.category, "News"]}
              publisher={newsItem.publisher}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 w-full">
            {["instagram", "facebook", "twitter", "whatsapp"].map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p as any)}
                className={`py-2 rounded-md text-sm font-semibold ${
                  platform === p
                    ? "bg-purple-700 text-white shadow-md"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={handlePostNow}
            disabled={posting}
            className={`mt-4 w-full py-2 rounded text-white transition ${
              posting ? "bg-purple-400 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-800"
            }`}
          >
            {posting ? "Posting..." : "Post Now →"}
          </button>

          {/* Email Share */}
          {/* Email Share */}
          <div className="w-full mt-6">
            <h4 className="font-semibold mb-2">📧 Share via Email</h4>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendEmail}
              disabled={sending}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <ImSpinner2 className="animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Email"
              )}
            </button>
            {!sending && email && (
              <p className={`mt-2 text-sm flex items-center gap-2 ${
                validateEmail(email) ? "text-green-600" : "text-red-500"
              }`}>
                {validateEmail(email) ? <FaCheckCircle /> : <FaTimesCircle />}
                {validateEmail(email) ? "Valid email" : "Invalid email"}
              </p>
            )}
          </div>


          {/* SMS Share */}
          <div className="w-full mt-4">
            <h4 className="font-semibold mb-2">📱 Share via SMS</h4>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone (+91...)"
              className="w-full p-2 border rounded mb-2"
            />
            <button
              onClick={sendSMS}
              disabled={sending}
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Send SMS
            </button>
          </div>
        </div>
      </div>
      

      {/* Instagram Challenge Modal */}
      {challengeRequired && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-bold mb-4">Enter Instagram Verification Code</h3>
            <input
              type="text"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Enter the 6-digit code"
              className="w-full border border-gray-300 p-2 rounded mb-4"
            />
            <button
              onClick={handleSubmitCode}
              disabled={submittingCode}
              className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 disabled:opacity-50"
            >
              {submittingCode ? "Submitting..." : "Submit Code"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetailPage;
