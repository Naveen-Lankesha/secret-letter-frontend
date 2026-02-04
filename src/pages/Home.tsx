import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Lock, Eye, Shield, Wand2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import SpellBeamBackground from "../components/SpellBeamBackground";

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const title = "Secret Letter";
  const subtitle = "Cast your secret messages into the magical realm";

  const [subtitleCycle, setSubtitleCycle] = React.useState(0);

  const subtitleStagger = 0.035;
  const subtitleLetterDuration = 0.18;
  const subtitleHoldSeconds = 2.2;
  const subtitleFadeSeconds = 0.35;
  const subtitleLength = subtitle.length;
  const subtitleRevealSeconds =
    Math.max(0, subtitleLength - 1) * subtitleStagger + subtitleLetterDuration;
  const subtitleCycleSeconds =
    subtitleRevealSeconds + subtitleHoldSeconds + subtitleFadeSeconds;

  React.useEffect(() => {
    const id = window.setInterval(
      () => {
        setSubtitleCycle((c) => c + 1);
      },
      Math.max(1, Math.round(subtitleCycleSeconds * 1000)),
    );
    return () => window.clearInterval(id);
  }, [subtitleCycleSeconds]);

  return (
    <div className="relative z-10 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center mb-20">
          {/* Full-width spell beam behind the heading */}
          <div className="absolute left-1/2 top-10 h-56 w-screen -translate-x-1/2 overflow-hidden pointer-events-none z-0">
            <SpellBeamBackground
              variant="hero"
              showOrb={false}
              casts={4}
              origin="bottom-left"
              className="opacity-90"
            />
            {/* subtle vignette so it blends into the page */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
          </div>

          <div className="flex justify-center mb-6">
            <Wand2 className="w-20 h-20 text-amber-200 drop-shadow-[0_0_18px_rgba(253,230,138,0.35)] animate-float" />
          </div>
          <h1 className="relative z-10 text-6xl font-magical mb-6">
            <span className="relative inline-block">
              {/* Base gradient text */}
              <span className="magic-title">{title}</span>

              {/* Writing overlay (appears letter-by-letter) */}
              <motion.span
                aria-hidden="true"
                className="absolute inset-0"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      delayChildren: 0.25,
                      staggerChildren: 0.085,
                    },
                  },
                }}>
                {title.split("").map((ch, idx) => (
                  <motion.span
                    key={idx}
                    className="magic-title-letter"
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: 10,
                        filter: "blur(3px)",
                      },
                      show: {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        transition: { duration: 0.22, ease: "linear" },
                      },
                    }}>
                    {ch === " " ? "\u00A0" : ch}
                  </motion.span>
                ))}
              </motion.span>
            </span>
          </h1>
          <p className="text-2xl text-purple-200 mb-8 font-cursive">
            <span className="sr-only">{subtitle}</span>

            {/* Loop: type-in -> hold -> fade out -> restart */}
            <motion.span
              key={subtitleCycle}
              aria-hidden="true"
              className="inline-block"
              initial={{ opacity: 1 }}
              animate={{
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: subtitleCycleSeconds,
                ease: "linear",
                times: [
                  0,
                  (subtitleRevealSeconds + subtitleHoldSeconds) /
                    subtitleCycleSeconds,
                  1,
                ],
              }}>
              <motion.span
                className="inline-block"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      delayChildren: 0,
                      staggerChildren: subtitleStagger,
                    },
                  },
                }}>
                {subtitle.split("").map((ch, idx) => (
                  <motion.span
                    key={idx}
                    className="inline-block"
                    style={{
                      color: "rgba(255,255,255,0.96)",
                      textShadow:
                        "0 0 10px rgba(253,230,138,0.28), 0 0 18px rgba(168,85,247,0.18)",
                      mixBlendMode: "screen",
                    }}
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: 8,
                        filter: "blur(6px)",
                      },
                      show: {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        transition: {
                          duration: subtitleLetterDuration,
                          ease: "linear",
                        },
                      },
                    }}>
                    {ch === " " ? "\u00A0" : ch}
                  </motion.span>
                ))}
              </motion.span>
            </motion.span>
          </p>
          <p className="text-lg text-purple-300 max-w-2xl mx-auto mb-12">
            Send encrypted letters protected by magical passwords. Share the
            secret ID with anyone, but only those who can solve your hints will
            unveil the hidden message.
          </p>

          <div className="flex justify-center space-x-4">
            {isAuthenticated ? (
              <Link to="/create" className="magic-button text-lg px-8 py-4">
                <Sparkles className="inline-block w-5 h-5 mr-2 text-amber-200 drop-shadow-[0_0_10px_rgba(253,230,138,0.25)]" />
                Create New Secret
              </Link>
            ) : (
              <>
                <Link to="/register" className="magic-button text-lg px-8 py-4">
                  <Sparkles className="inline-block w-5 h-5 mr-2 text-amber-200 drop-shadow-[0_0_10px_rgba(253,230,138,0.25)]" />
                  Start Your Journey
                </Link>
                <Link
                  to="/login"
                  className="bg-purple-800/50 hover:bg-purple-700/50 text-white font-semibold py-4 px-8 rounded-lg border border-purple-500/50 transition-all text-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="magic-card p-8 text-center hover:scale-105 transition-transform">
            <Lock className="w-12 h-12 text-amber-200 drop-shadow-[0_0_16px_rgba(253,230,138,0.28)] mx-auto mb-4" />
            <h3 className="text-xl font-magical mb-3">
              <span className="magic-title">Encrypted Magic</span>
            </h3>
            <p className="text-purple-300">
              Your secrets are protected with powerful encryption spells,
              ensuring only the chosen one can read them.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="magic-card p-8 text-center hover:scale-105 transition-transform">
            <Eye className="w-12 h-12 text-amber-200 drop-shadow-[0_0_16px_rgba(253,230,138,0.28)] mx-auto mb-4" />
            <h3 className="text-xl font-magical mb-3">
              <span className="magic-title">Magical Hints</span>
            </h3>
            <p className="text-purple-300">
              Guide your recipients with mystical hints to help them discover
              the password and reveal your message.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="magic-card p-8 text-center hover:scale-105 transition-transform">
            <Shield className="w-12 h-12 text-amber-200 drop-shadow-[0_0_16px_rgba(253,230,138,0.28)] mx-auto mb-4" />
            <h3 className="text-xl font-magical mb-3">
              <span className="magic-title">Secure Sharing</span>
            </h3>
            <p className="text-purple-300">
              Share your secret ID safely. Your message remains protected until
              the correct password is cast.
            </p>
          </motion.div>
        </div>

        {/* View Secret Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="magic-card p-10 max-w-2xl mx-auto text-center">
          <Sparkles className="w-12 h-12 text-amber-200 drop-shadow-[0_0_16px_rgba(253,230,138,0.28)] mx-auto mb-4 animate-sparkle" />
          <h2 className="text-3xl font-magical mb-4">
            <span className="magic-title">Received a Secret ID?</span>
          </h2>
          <p className="text-purple-300 mb-6">
            Enter the magical ID below to view the secret letter
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const secretId = formData.get("secretId") as string;
              if (secretId) {
                window.location.href = `/secret/${secretId}`;
              }
            }}
            className="flex space-x-4">
            <input
              type="text"
              name="secretId"
              placeholder="Enter Secret ID"
              className="magic-input flex-1"
              required
            />
            <button type="submit" className="magic-button">
              View Secret
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
