import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Lock, Eye, Shield, Wand2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative z-10 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20">
          <div className="flex justify-center mb-6">
            <Wand2 className="w-20 h-20 text-purple-400 animate-float" />
          </div>
          <h1 className="text-6xl font-magical text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-6 animate-glow">
            Secret Letter
          </h1>
          <p className="text-2xl text-purple-200 mb-8 font-cursive">
            Cast your secret messages into the magical realm
          </p>
          <p className="text-lg text-purple-300 max-w-2xl mx-auto mb-12">
            Send encrypted letters protected by magical passwords. Share the
            secret ID with anyone, but only those who can solve your hints will
            unveil the hidden message.
          </p>

          <div className="flex justify-center space-x-4">
            {isAuthenticated ? (
              <Link to="/create" className="magic-button text-lg px-8 py-4">
                <Sparkles className="inline-block w-5 h-5 mr-2" />
                Create New Secret
              </Link>
            ) : (
              <>
                <Link to="/register" className="magic-button text-lg px-8 py-4">
                  <Sparkles className="inline-block w-5 h-5 mr-2" />
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
            <Lock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-magical text-purple-100 mb-3">
              Encrypted Magic
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
            <Eye className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-magical text-purple-100 mb-3">
              Magical Hints
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
            <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-magical text-purple-100 mb-3">
              Secure Sharing
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
          <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-sparkle" />
          <h2 className="text-3xl font-magical text-purple-100 mb-4">
            Received a Secret ID?
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
