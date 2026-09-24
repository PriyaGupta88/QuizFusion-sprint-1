import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
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
        <h1 className="text-2xl font-bold mb-1">Create your account</h1>
        <p className="text-slate-400 text-sm mb-6">Start generating AI-powered tests for free.</p>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <label className="text-sm text-slate-400">Name</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full mb-4 mt-1 bg-white/5 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-400"
        />

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
          minLength={6}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mb-6 mt-1 bg-white/5 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-400"
        />

        <button
          disabled={loading}
          className="w-full bg-brand-500 hover:bg-brand-600 rounded-xl py-2.5 font-semibold transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="text-sm text-slate-400 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Register;
