import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(email, password, name);
      toast.success("Welcome to the magical world!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="magic-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
          <h1 className="text-3xl font-magical text-purple-100 mb-2">
            Join the Magic
          </h1>
          <p className="text-purple-300">Create your magical account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-purple-200 mb-2 font-semibold">
              Name (Optional)
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="magic-input w-full pl-12"
                placeholder="Your magical name"
              />
            </div>
          </div>

          <div>
            <label className="block text-purple-200 mb-2 font-semibold">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="magic-input w-full pl-12"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-purple-200 mb-2 font-semibold">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="magic-input w-full pl-12"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <p className="text-purple-400 text-sm mt-1">Minimum 6 characters</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="magic-button w-full disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Creating account..." : "Begin Your Journey"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-purple-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
