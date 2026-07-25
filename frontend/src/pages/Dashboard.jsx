import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Flame, Trophy, Target, ListChecks } from "lucide-react";
import api from "../services/api";

const StatCard = ({ icon: Icon, label, value, i }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.08 }}
    className="glass rounded-2xl p-5"
  >
    <Icon className="text-brand-400 mb-2" size={22} />
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-xs text-slate-400">{label}</p>
  </motion.div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setError("Could not load dashboard. Is the backend / DB running?"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center text-slate-400">Loading dashboard...</div>;
  if (error) return <div className="p-10 text-center text-red-400">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={ListChecks} label="Total Tests" value={data.totalTests} i={0} />
        <StatCard icon={Target} label="Average Score" value={`${data.averageScore || 0}%`} i={1} />
        <StatCard icon={Trophy} label="Highest Score" value={`${data.highestScore || 0}%`} i={2} />
        <StatCard icon={Flame} label="Daily Streak" value={`${data.dailyStreak || 0} days`} i={3} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h2 className="font-semibold mb-4">Performance Over Time</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.performanceOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} hide />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
              <Line type="monotone" dataKey="percentage" stroke="#7c9bff" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold mb-3">Topics</h2>
          <p className="text-xs text-slate-400 mb-1">Weak</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {data.weakTopics?.length ? (
              data.weakTopics.map((t) => (
                <span key={t} className="text-xs bg-red-500/10 text-red-300 px-2 py-1 rounded-full">{t}</span>
              ))
            ) : (
              <span className="text-xs text-slate-500">None yet</span>
            )}
          </div>
          <p className="text-xs text-slate-400 mb-1">Strong</p>
          <div className="flex flex-wrap gap-2">
            {data.strongTopics?.length ? (
              data.strongTopics.map((t) => (
                <span key={t} className="text-xs bg-emerald-500/10 text-emerald-300 px-2 py-1 rounded-full">{t}</span>
              ))
            ) : (
              <span className="text-xs text-slate-500">None yet</span>
            )}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 mt-6">
        <h2 className="font-semibold mb-4">Recent Tests</h2>
        <div className="space-y-2">
          {data.recentTests?.length ? (
            data.recentTests.map((r) => (
              <div key={r._id} className="flex justify-between items-center bg-white/5 rounded-lg px-4 py-3 text-sm">
                <span>{r.test?.subject} — {r.test?.topic}</span>
                <span className="text-brand-400 font-semibold">{r.percentage}%</span>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-sm">No tests taken yet. Generate one to get started!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
