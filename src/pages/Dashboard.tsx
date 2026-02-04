import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Scroll, Plus, Eye, Trash2, Calendar, BarChart } from "lucide-react";
import { secretAPI } from "../api/api";
import toast from "react-hot-toast";

interface Secret {
  _id: string;
  secretId: string;
  title: string;
  theme: string;
  createdAt: string;
  viewCount: number;
  hints: any[];
}

const Dashboard: React.FC = () => {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSecrets();
  }, []);

  const loadSecrets = async () => {
    try {
      const response = await secretAPI.getMySecrets();
      setSecrets(response.data.secrets);
    } catch (error: any) {
      toast.error("Failed to load secrets");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (secretId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this secret? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await secretAPI.delete(secretId);
      setSecrets(secrets.filter((s) => s.secretId !== secretId));
      toast.success("Secret deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete secret");
    }
  };

  const getThemeColor = (theme: string) => {
    const colors: { [key: string]: string } = {
      gryffindor: "from-red-500 to-yellow-500",
      slytherin: "from-green-500 to-gray-500",
      ravenclaw: "from-blue-500 to-gray-500",
      hufflepuff: "from-yellow-500 to-gray-500",
      love: "from-rose-500 to-red-500",
      dark: "from-gray-700 to-black",
      magic: "from-purple-500 to-indigo-500",
    };
    return colors[theme] || "from-purple-500 to-indigo-500";
  };

  const copySecretLink = (secretId: string) => {
    const url = `${window.location.origin}/secret/${secretId}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen px-4 py-12">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-magical text-purple-100 mb-2">
                My Secret Letters
              </h1>
              <p className="text-purple-300">Manage your magical messages</p>
            </div>
            <Link
              to="/create"
              className="magic-button flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create New Secret</span>
            </Link>
          </div>

          {secrets.length === 0 ? (
            <div className="magic-card p-12 text-center">
              <Scroll className="w-20 h-20 text-purple-400 mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-magical text-purple-100 mb-3">
                No Secrets Yet
              </h2>
              <p className="text-purple-300 mb-6">
                Start your magical journey by creating your first secret letter
              </p>
              <Link to="/create" className="magic-button inline-block">
                Create Your First Secret
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {secrets.map((secret, index) => (
                <motion.div
                  key={secret._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="magic-card p-6 hover:scale-105 transition-transform">
                  {/* Theme Banner */}
                  <div
                    className={`h-3 rounded-t-lg bg-gradient-to-r ${getThemeColor(
                      secret.theme,
                    )} mb-4 -mx-6 -mt-6`}></div>

                  {/* Title */}
                  <h3 className="text-xl font-magical text-purple-100 mb-3 truncate">
                    {secret.title}
                  </h3>

                  {/* Stats */}
                  <div className="space-y-2 mb-4 text-sm text-purple-300">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(secret.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BarChart className="w-4 h-4" />
                      <span>{secret.viewCount} views</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Scroll className="w-4 h-4" />
                      <span>{secret.hints.length} hints</span>
                    </div>
                  </div>

                  {/* Secret ID */}
                  <div className="bg-purple-900/30 rounded p-2 mb-4">
                    <p className="text-xs text-purple-400 mb-1">Secret ID</p>
                    <p className="font-mono text-sm text-purple-200 truncate">
                      {secret.secretId}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/secret/${secret.secretId}`}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-center py-2 rounded-lg transition-colors flex items-center justify-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">View</span>
                    </Link>
                    <button
                      onClick={() => copySecretLink(secret.secretId)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors text-sm">
                      Copy Link
                    </button>
                    <button
                      onClick={() => handleDelete(secret.secretId)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
