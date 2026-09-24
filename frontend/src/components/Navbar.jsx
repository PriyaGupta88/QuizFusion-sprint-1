import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, Sparkles, LogOut, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 glass px-4 sm:px-6 py-3 sm:py-4"
    >
      <div className="flex items-center justify-between">
      <Link to="/" onClick={closeMenu} className="flex items-center gap-2 font-bold text-lg min-w-0">
        <Sparkles className="text-brand-400" size={22} />
        <span className="gradient-text truncate">TestForge AI</span>
      </Link>
      <button
        onClick={() => setMenuOpen((open) => !open)}
        className="sm:hidden rounded-lg bg-white/5 p-2"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      </div>

      <div className={`${menuOpen ? "flex" : "hidden"} sm:flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 text-sm pt-3 sm:pt-0`}>
        <Link to="/" onClick={closeMenu} className="hover:text-brand-400 transition py-2 sm:py-0">Home</Link>
        {user ? (
          <>
            <Link to="/dashboard" onClick={closeMenu} className="hover:text-brand-400 transition py-2 sm:py-0">Dashboard</Link>
            <Link to="/generate" onClick={closeMenu} className="hover:text-brand-400 transition py-2 sm:py-0">Generate Test</Link>
            <span className="text-slate-400 py-2 sm:py-0">Hi, {user.name?.split(" ")[0]}</span>
            <button
              onClick={() => {
                logout();
                closeMenu();
                navigate("/");
              }}
              className="flex items-center justify-center gap-1 rounded-lg bg-white/5 hover:bg-white/10 px-3 py-2 sm:py-1.5 transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu} className="hover:text-brand-400 transition py-2 sm:py-0">Login</Link>
            <Link
              to="/register"
              onClick={closeMenu}
              className="rounded-lg bg-brand-500 hover:bg-brand-600 px-4 py-2 sm:py-1.5 font-medium transition text-center"
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