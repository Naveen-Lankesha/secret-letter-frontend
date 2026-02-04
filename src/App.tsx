import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateSecret from "./pages/CreateSecret";
import ViewSecret from "./pages/ViewSecret";
import MagicBackground from "./components/MagicBackground";
import { MusicProvider } from "./context/MusicContext";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/secret/:secretId" element={<ViewSecret />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateSecret />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <MusicProvider>
        <Router>
          <div className="min-h-screen stars-background">
            <MagicBackground />
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                className: "magic-card",
                style: {
                  background: "rgba(88, 28, 135, 0.9)",
                  color: "#fff",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                },
              }}
            />
          </div>
        </Router>
      </MusicProvider>
    </AuthProvider>
  );
}

export default App;
