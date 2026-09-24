import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-8">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="glass rounded-2xl p-6 sm:p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-slate-400 text-sm mb-6">Login to continue your prep.</p>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <label className="text-sm text-slate-400">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full mb-4 mt-1 bg-white/5 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-400"
        />

        <label className="text-sm text-slate-400">Password</label>
        <input
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mb-6 mt-1 bg-white/5 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-400"
        />

        <button
          disabled={loading}
          className="w-full bg-brand-500 hover:bg-brand-600 rounded-xl py-2.5 font-semibold transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-slate-400 mt-4 text-center">
          No account?{" "}
          <Link to="/register" className="text-brand-400 hover:underline">
            Register
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;
