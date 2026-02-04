import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReactQuill from "react-quill";
import { Wand2, Plus, X, Copy, Check } from "lucide-react";
import { secretAPI } from "../api/api";
import toast from "react-hot-toast";
import PetalBackground from "../components/PetalBackground";
import SpellBeamBackground from "../components/SpellBeamBackground";
import SerpentBackground from "../components/SerpentBackground";

interface Hint {
  text: string;
  order: number;
}

const CreateSecret: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [hints, setHints] = useState<Hint[]>([]);
  const [newHint, setNewHint] = useState("");
  const [theme, setTheme] = useState("magic");
  const [loading, setLoading] = useState(false);
  const [createdSecretId, setCreatedSecretId] = useState("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const themes = [
    {
      value: "magic",
      label: "Magical",
      color: "from-purple-600 to-indigo-600",
    },
    {
      value: "love",
      label: "Love",
      color: "from-rose-500 to-red-600",
    },
    {
      value: "gryffindor",
      label: "Gryffindor",
      color: "from-red-600 to-yellow-600",
    },
    {
      value: "slytherin",
      label: "Slytherin",
      color: "from-emerald-600 to-slate-400",
    },
    {
      value: "ravenclaw",
      label: "Ravenclaw",
      color: "from-blue-600 to-gray-600",
    },
    {
      value: "hufflepuff",
      label: "Hufflepuff",
      color: "from-yellow-600 to-gray-600",
    },
    { value: "dark", label: "Dark Magic", color: "from-gray-800 to-black" },
  ];

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const addHint = () => {
    if (newHint.trim()) {
      setHints([...hints, { text: newHint, order: hints.length + 1 }]);
      setNewHint("");
    }
  };

  const removeHint = (index: number) => {
    setHints(
      hints
        .filter((_, i) => i !== index)
        .map((h, i) => ({ ...h, order: i + 1 })),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await secretAPI.create({
        title,
        content,
        password,
        hints,
        theme,
      });

      setCreatedSecretId(response.data.secretId);
      toast.success("Secret created successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create secret");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(createdSecretId);
    setCopied(true);
    toast.success("Secret ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = `${window.location.origin}/secret/${createdSecretId}`;

  if (createdSecretId) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="magic-card p-8 w-full max-w-2xl text-center">
          <Wand2 className="w-20 h-20 text-purple-400 mx-auto mb-6 animate-float" />
          <h2 className="text-3xl font-magical text-purple-100 mb-4">
            Secret Created!
          </h2>
          <p className="text-purple-300 mb-8">
            Your magical message has been encrypted. Share this ID with your
            recipient.
          </p>

          <div className="bg-purple-900/50 rounded-lg p-6 mb-6">
            <label className="block text-purple-200 mb-2 font-semibold">
              Secret ID
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={createdSecretId}
                readOnly
                className="magic-input flex-1 text-center text-2xl font-mono"
              />
              <button
                onClick={copyToClipboard}
                className="magic-button px-4 py-3">
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="bg-purple-900/50 rounded-lg p-6 mb-6">
            <label className="block text-purple-200 mb-2 font-semibold">
              Share Link
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="magic-input flex-1 text-sm"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast.success("Link copied!");
                }}
                className="magic-button px-4 py-3">
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="magic-button">
              View My Secrets
            </button>
            <button
              onClick={() => {
                setCreatedSecretId("");
                setTitle("");
                setContent("");
                setPassword("");
                setHints([]);
                setTheme("magic");
              }}
              className="bg-purple-800/50 hover:bg-purple-700/50 text-white font-semibold py-3 px-6 rounded-lg border border-purple-500/50 transition-all">
              Create Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen px-4 py-12">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="magic-card p-8 relative overflow-hidden">
          {theme === "love" && <PetalBackground className="z-0" />}
          {theme === "slytherin" && <SerpentBackground className="z-0" />}
          {theme === "dark" && (
            <SpellBeamBackground casts={5} className="z-0" />
          )}
          <div className="relative z-10">
            <div className="text-center mb-8">
              <Wand2 className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-pulse" />
              <h1 className="text-4xl font-magical text-purple-100 mb-2">
                Create Secret Letter
              </h1>
              <p className="text-purple-300">
                Cast your message into the magical realm
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-purple-200 mb-2 font-semibold">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="magic-input w-full"
                  placeholder="A mysterious title..."
                  required
                />
              </div>

              {/* Theme Selection */}
              <div>
                <label className="block text-purple-200 mb-3 font-semibold">
                  Choose Your Theme
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {themes.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTheme(t.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        theme === t.value
                          ? "border-purple-400 scale-105"
                          : "border-purple-500/30 hover:border-purple-400/50"
                      }`}>
                      <div
                        className={`h-12 rounded bg-gradient-to-r ${t.color} mb-2`}></div>
                      <p className="text-purple-200 text-sm font-semibold">
                        {t.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-purple-200 mb-2 font-semibold">
                  Your Secret Message *
                </label>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  className="bg-purple-900/20 rounded-lg"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-purple-200 mb-2 font-semibold">
                  Secret Password *
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="magic-input w-full"
                  placeholder="The key to unlock your secret..."
                  required
                />
                <p className="text-purple-400 text-sm mt-1">
                  This password will be required to decrypt and view your secret
                </p>
              </div>

              {/* Hints */}
              <div>
                <label className="block text-purple-200 mb-2 font-semibold">
                  Hints (Optional)
                </label>
                <div className="space-y-3">
                  {hints.map((hint, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-1 bg-purple-900/30 border border-purple-500/50 rounded-lg px-4 py-3 text-white">
                        <span className="text-purple-400 font-semibold mr-2">
                          {index + 1}.
                        </span>
                        {hint.text}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeHint(index)}
                        className="text-red-400 hover:text-red-300 p-2">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}

                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newHint}
                      onChange={(e) => setNewHint(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addHint())
                      }
                      className="magic-input flex-1"
                      placeholder="Add a hint to help guess the password..."
                    />
                    <button
                      type="button"
                      onClick={addHint}
                      className="magic-button px-4">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="magic-button w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Casting spell..." : "✨ Create Secret Letter"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateSecret;
