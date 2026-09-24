import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CheckCircle2, XCircle, Clock, Award } from "lucide-react";
import api from "../services/api";

const COLORS = ["#34d399", "#f87171"];

const Result = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get(`/results/${id}`).then((res) => setResult(res.data));
  }, [id]);

  if (!result) return <div className="p-10 text-center text-slate-400">Loading result...</div>;

  const pieData = [
    { name: "Correct", value: result.correctCount },
    { name: "Incorrect", value: result.incorrectCount },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 sm:p-8 mb-6 text-center">
        <Award className="mx-auto text-brand-400 mb-2" size={32} />
        <h1 className="text-3xl font-bold">{result.percentage}%</h1>
        <p className="text-slate-400">
          {result.correctCount}/{result.totalQuestions} correct · {Math.round(result.timeTakenSeconds / 60)} min
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="glass rounded-2xl p-4 sm:p-6 min-w-0">
          <h2 className="font-semibold mb-4">Score Breakdown</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={4}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-4 sm:p-6 min-w-0">
          <h2 className="font-semibold mb-3">AI Summary</h2>
          <p className="text-sm text-slate-300 mb-4">{result.aiFeedbackSummary || "Great effort! Keep practicing consistently."}</p>
          <h3 className="text-sm font-semibold mb-2">Recommendations</h3>
          <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
            {(result.aiRecommendations || []).map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-6">
        <h2 className="font-semibold mb-4">Question Review</h2>
        <div className="space-y-3">
          {result.answers.map((a, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-3 sm:p-4">
              <div className="flex justify-between items-start gap-3">
                <p className="text-sm font-medium min-w-0 break-words">Q{i + 1}. {a.questionText}</p>
                {a.isCorrect ? (
                  <CheckCircle2 className="text-emerald-400 shrink-0" size={18} />
                ) : (
                  <XCircle className="text-red-400 shrink-0" size={18} />
                )}
              </div>
              <p className="text-xs text-slate-400 mt-2">Your answer: {a.userAnswer || "—"}</p>
              <p className="text-xs text-slate-500">Correct answer: {a.correctAnswer}</p>
              {a.aiEvaluation?.feedback && (
                <p className="text-xs text-brand-300 mt-2">AI feedback: {a.aiEvaluation.feedback}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Result;
