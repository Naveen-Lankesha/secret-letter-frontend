import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, Sparkles, AlertCircle } from "lucide-react";
import { secretAPI } from "../api/api";
import toast from "react-hot-toast";
import PetalBackground from "../components/PetalBackground";
import SpellBeamBackground from "../components/SpellBeamBackground";
import SerpentBackground from "../components/SerpentBackground";

interface Secret {
  secretId: string;
  title: string;
  hints: { text: string; order: number }[];
  theme: string;
  createdAt: string;
}

const ViewSecret: React.FC = () => {
  const { secretId } = useParams<{ secretId: string }>();
  const [secret, setSecret] = useState<Secret | null>(null);
  const [password, setPassword] = useState("");
  const [decryptedContent, setDecryptedContent] = useState("");
  const [revealFlashKey, setRevealFlashKey] = useState(0);
  const flashAudioRef = useRef<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [decrypting, setDecrypting] = useState(false);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    loadSecret();
  }, [secretId]);

  const loadSecret = async () => {
    try {
      const response = await secretAPI.getById(secretId!);
      setSecret(response.data.secret);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Secret not found");
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    setDecrypting(true);

    try {
      const response = await secretAPI.decrypt(secretId!, password);
      setDecryptedContent(response.data.content);
      setRevealFlashKey((k) => k + 1);

      const audio = flashAudioRef.current;
      if (audio) {
        try {
          audio.currentTime = 0;
          audio.volume = 0.85;
          await audio.play();
        } catch {
          // Ignore autoplay/decoding errors; flash still shows.
        }
      }
      toast.success("Secret revealed!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Incorrect password");
    } finally {
      setDecrypting(false);
    }
  };

  const getThemeClass = (theme: string) => {
    const themes: { [key: string]: string } = {
      gryffindor: "gryffindor-theme",
      slytherin: "slytherin-theme",
      ravenclaw: "ravenclaw-theme",
      hufflepuff: "hufflepuff-theme",
      love: "love-theme",
      dark: "bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-500/30",
      magic: "magic-card",
    };
    return themes[theme] || "magic-card";
  };

  if (loading) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <audio ref={flashAudioRef} src="/audio/flash.mp3" preload="auto" />
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!secret) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <audio ref={flashAudioRef} src="/audio/flash.mp3" preload="auto" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="magic-card p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-magical text-purple-100 mb-2">
            Secret Not Found
          </h2>
          <p className="text-purple-300">
            This secret doesn't exist or has been removed.
          </p>
        </motion.div>
      </div>
    );
  }

  if (decryptedContent) {
    return (
      <div className="relative z-10 min-h-screen px-4 py-12">
        <audio ref={flashAudioRef} src="/audio/flash.mp3" preload="auto" />
        <motion.div
          key={revealFlashKey}
          className="fixed inset-0 z-[60] pointer-events-none"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: [0, 1, 0], scale: [0.92, 1.05, 1.18] }}
          transition={{ duration: 0.9, times: [0, 0.18, 1], ease: "easeOut" }}
          style={{
            background:
              "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.95) 0%, rgba(167,243,208,0.65) 22%, rgba(16,185,129,0.22) 44%, rgba(0,0,0,0) 70%)",
            mixBlendMode: "screen",
            filter: "blur(0.2px)",
          }}
        />
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${getThemeClass(secret.theme)} p-8 backdrop-blur-sm border rounded-2xl shadow-2xl relative overflow-hidden`}>
            {secret.theme === "love" && <PetalBackground className="z-0" />}
            {secret.theme === "slytherin" && (
              <SerpentBackground className="z-0" />
            )}
            {secret.theme === "dark" && (
              <SpellBeamBackground
                casts={5}
                origin="bottom-right"
                className="z-0"
              />
            )}
            <div className="relative z-10">
              <div className="text-center mb-8">
                <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
                <h1 className="text-4xl font-magical text-purple-100 mb-2">
                  {secret.title}
                </h1>
                <p className="text-purple-300">
                  The secret has been revealed...
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20">
                <div
                  className="prose prose-invert max-w-none text-purple-100"
                  dangerouslySetInnerHTML={{ __html: decryptedContent }}
                />
              </div>

              <div className="text-center mt-8">
                <button
                  onClick={() => {
                    setDecryptedContent("");
                    setPassword("");
                  }}
                  className="magic-button">
                  Hide Secret
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
      <audio ref={flashAudioRef} src="/audio/flash.mp3" preload="auto" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${getThemeClass(secret.theme)} p-8 w-full max-w-md backdrop-blur-sm border rounded-2xl shadow-2xl relative overflow-hidden`}>
        {secret.theme === "love" && <PetalBackground className="z-0" />}
        {secret.theme === "slytherin" && <SerpentBackground className="z-0" />}
        {secret.theme === "dark" && (
          <SpellBeamBackground
            casts={4}
            origin="bottom-right"
            className="z-0"
          />
        )}
        <div className="relative z-10">
          <div className="text-center mb-8">
            <Lock className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
            <h1 className="text-3xl font-magical text-purple-100 mb-2">
              {secret.title}
            </h1>
            <p className="text-purple-300">This secret is protected by magic</p>
          </div>

          <form onSubmit={handleDecrypt} className="space-y-6">
            <div>
              <label className="block text-purple-200 mb-2 font-semibold">
                Enter Password to Reveal
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="magic-input w-full"
                placeholder="The magical password..."
                required
                autoFocus
              />
            </div>

            {secret.hints.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center space-x-2 text-purple-300 hover:text-purple-200 transition-colors mb-3">
                  <Eye className="w-5 h-5" />
                  <span className="font-semibold">
                    {showHints ? "Hide" : "Show"} Hints ({secret.hints.length})
                  </span>
                </button>

                {showHints && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-2">
                    {secret.hints
                      .sort((a, b) => a.order - b.order)
                      .map((hint, index) => (
                        <div
                          key={index}
                          className="bg-purple-900/30 border border-purple-500/50 rounded-lg px-4 py-3 text-purple-200">
                          <span className="text-purple-400 font-semibold mr-2">
                            Hint {index + 1}:
                          </span>
                          {hint.text}
                        </div>
                      ))}
                  </motion.div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={decrypting}
              className="magic-button w-full disabled:opacity-50 disabled:cursor-not-allowed">
              {decrypting ? "Decrypting..." : "🔓 Reveal Secret"}
            </button>
          </form>

          <div className="mt-6 text-center text-purple-400 text-sm">
            <p>Secret ID: {secret.secretId}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewSecret;
