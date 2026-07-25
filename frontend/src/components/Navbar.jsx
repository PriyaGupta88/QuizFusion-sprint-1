import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 glass px-6 py-4 flex items-center justify-between"
    >
      <Link to="/" className="flex items-center gap-2 font-bold text-lg">
        <Sparkles className="text-brand-400" size={22} />
        <span className="gradient-text">TestForge AI</span>
      </Link>

      <div className="flex items-center gap-4 text-sm">
        <Link to="/" className="hover:text-brand-400 transition">Home</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-brand-400 transition">Dashboard</Link>
            <Link to="/generate" className="hover:text-brand-400 transition">Generate Test</Link>
            <span className="text-slate-400">Hi, {user.name?.split(" ")[0]}</span>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="flex items-center gap-1 rounded-lg bg-white/5 hover:bg-white/10 px-3 py-1.5 transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-brand-400 transition">Login</Link>
            <Link
              to="/register"
              className="rounded-lg bg-brand-500 hover:bg-brand-600 px-4 py-1.5 font-medium transition"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;