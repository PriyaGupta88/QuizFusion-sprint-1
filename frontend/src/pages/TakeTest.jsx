import React, { memo, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Flag, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import api from "../services/api";
import AIChatWidget from "../components/AIChatWidget";

const QuizTimer = memo(({ startTime, secondsRef }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const update = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      secondsRef.current = elapsed;
      setSeconds(elapsed);
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [startTime, secondsRef]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return <span className="flex items-center gap-1 shrink-0"><Clock size={14} /> {mm}:{ss}</span>;
});

const TakeTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const startRef = useRef(Date.now());
  const secondsRef = useRef(0);

  useEffect(() => {
    api.get(`/tests/${id}`).then((res) => setTest(res.data));
  }, [id]);

  if (!test) return <div className="p-10 text-center text-slate-400">Loading test...</div>;

  const q = test.questions[index];
  const progress = ((index + 1) / test.questions.length) * 100;

  const setAnswer = (val) => setAnswers((prev) => ({ ...prev, [index]: val }));
  const toggleFlag = () => setFlagged((prev) => ({ ...prev, [index]: !prev[index] }));

  const submit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        testId: id,
        timeTakenSeconds: secondsRef.current,
        answers: test.questions.map((_, i) => ({ questionIndex: i, userAnswer: answers[i] || "" })),
      };
      const { data } = await api.post("/results", payload);
      navigate(`/result/${data._id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex justify-between items-start gap-3 mb-4 text-sm text-slate-400">
        <span className="min-w-0 break-words">{test.subject} — {test.topic} ({test.difficulty})</span>
        <QuizTimer startTime={startRef.current} secondsRef={secondsRef} />
      </div>

      <div className="h-1.5 bg-white/5 rounded-full mb-6 overflow-hidden">
        <motion.div animate={{ width: `${progress}%` }} className="h-full bg-brand-500" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="glass rounded-2xl p-4 sm:p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <p className="font-medium min-w-0 break-words">
              Q{index + 1}. {q.questionText}
            </p>
            <button onClick={toggleFlag} className={flagged[index] ? "text-amber-400" : "text-slate-500"}>
              <Flag size={18} />
            </button>
          </div>

          {(q.type === "mcq" || q.type === "truefalse") && (
            <div className="space-y-2">
              {q.options.map((opt) => (
                <label
                  key={opt}
                  className={`block rounded-lg px-3 py-2 cursor-pointer border transition ${
                    answers[index] === opt ? "border-brand-400 bg-brand-500/10" : "border-white/5 bg-white/5"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${index}`}
                    className="mr-2"
                    checked={answers[index] === opt}
                    onChange={() => setAnswer(opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}

          {["short", "fill"].includes(q.type) && (
            <input
              value={answers[index] || ""}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your answer..."
              className="w-full bg-white/5 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-400"
            />
          )}

          {["long", "coding"].includes(q.type) && (
            <textarea
              value={answers[index] || ""}
              onChange={(e) => setAnswer(e.target.value)}
              rows={q.type === "coding" ? 10 : 6}
              placeholder={q.type === "coding" ? "// write your code here" : "Your answer..."}
              className={`w-full bg-white/5 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-400 ${
                q.type === "coding" ? "font-mono text-sm" : ""
              }`}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center gap-3 mt-6">
        <button
          disabled={index === 0}
          onClick={() => setIndex((i) => i - 1)}
          className="flex items-center gap-1 glass px-3 sm:px-4 py-2.5 rounded-lg disabled:opacity-30 min-h-11"
        >
          <ChevronLeft size={16} /> Previous
        </button>

        {index === test.questions.length - 1 ? (
          <button
            onClick={submit}
            disabled={submitting}
            className="bg-brand-500 hover:bg-brand-600 px-3 sm:px-6 py-2.5 rounded-lg font-semibold disabled:opacity-50 min-h-11 text-sm sm:text-base"
          >
            {submitting ? "Submitting & grading with AI..." : "Submit Test"}
          </button>
        ) : (
          <button
            onClick={() => setIndex((i) => i + 1)}
            className="flex items-center gap-1 bg-brand-500 hover:bg-brand-600 px-3 sm:px-4 py-2.5 rounded-lg min-h-11"
          >
            Next <ChevronRight size={16} />
          </button>
        )}
      </div>

      <AIChatWidget testId={id} testLabel={`${test.subject} - ${test.topic}`} />
    </div>
  );
};

export default TakeTest;
