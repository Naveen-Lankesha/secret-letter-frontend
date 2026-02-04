import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, LogOut, Scroll, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="relative z-50 bg-purple-900/30 backdrop-blur-md border-b border-purple-500/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <Sparkles className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors animate-pulse" />
            <span className="text-2xl font-magical text-purple-100 group-hover:text-white transition-colors">
              Secret Letter
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-1 text-purple-200 hover:text-white transition-colors">
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 text-purple-200 hover:text-white transition-colors">
                  <Scroll className="w-5 h-5" />
                  <span>My Secrets</span>
                </Link>
                <Link to="/create" className="magic-button px-4 py-2 text-sm">
                  Create Secret
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-200 text-sm">{user?.email}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-purple-200 hover:text-red-400 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-purple-200 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/register" className="magic-button px-4 py-2 text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
