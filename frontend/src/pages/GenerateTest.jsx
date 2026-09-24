import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import api from "../services/api";

const GenerateTest = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    subject: "",
    topic: "",
    difficulty: "medium",
    numQuestions: 10,
    questionType: "mcq",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/ai/generate-test", form);
      navigate(`/test/${data._id}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to generate test. Check your Groq API key / backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="text-brand-400" />
          <h1 className="text-2xl font-bold">Generate a New Test</h1>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-400">Subject</label>
            <input
              required
              placeholder="e.g. JavaScript"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full mt-1 bg-white/5 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400">Topic</label>
            <input
              required
              placeholder="e.g. Closures & Scope"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              className="w-full mt-1 bg-white/5 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="w-full mt-1 bg-white/5 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-400"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-400"># Questions</label>
              <input
                type="number"
                min={1}
                max={50}
                value={form.numQuestions}
                onChange={(e) => setForm({ ...form, numQuestions: Number(e.target.value) })}
                className="w-full mt-1 bg-white/5 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-400"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400">Question Type</label>
            <select
              value={form.questionType}
              onChange={(e) => setForm({ ...form, questionType: e.target.value })}
              className="w-full mt-1 bg-white/5 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-400"
            >
              <option value="mcq">MCQ</option>
              <option value="coding">Coding</option>
              <option value="short">Short Answer</option>
              <option value="long">Long Answer</option>
              <option value="fill">Fill in the Blanks</option>
              <option value="truefalse">True / False</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          <button
            disabled={loading}
            className="w-full bg-brand-500 hover:bg-brand-600 rounded-xl py-3 font-semibold transition disabled:opacity-50"
          >
            {loading ? "Generating with Groq AI..." : "Generate Test"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default GenerateTest;
