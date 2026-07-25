import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Brain, Zap, BarChart3, MessageSquareText, ShieldCheck, LayoutDashboard, Sparkles } from "lucide-react";
import HeroBrain from "../components/HeroBrain";
import { useAuth } from "../context/AuthContext";

const features = [
  { icon: Brain, title: "AI-Generated Tests", desc: "Groq-powered questions tailored to your topic, difficulty and format in seconds." },
  { icon: Zap, title: "Instant AI Evaluation", desc: "Descriptive and coding answers graded with feedback, not just right/wrong." },
  { icon: BarChart3, title: "Performance Analytics", desc: "Track scores, streaks, and weak topics with live charts." },
  { icon: MessageSquareText, title: "AI Learning Assistant", desc: "A built-in chatbot that explains concepts and hints without giving answers away." },
];

const Landing = () => {
  const { user } = useAuth();

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern [background-size:32px_32px] opacity-40 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full mb-4">
              Powered by Groq AI
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Generate <span className="gradient-text">smarter tests</span> in seconds
            </h1>
            <p className="text-slate-400 mb-8 text-lg">
              Pick a topic, difficulty, and question type — TestForge AI builds the exam, grades it,
              and coaches you afterward with a personal AI assistant.
            </p>
            <div className="flex gap-4">
              {user ? (
                <>
                  <Link to="/generate" className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 px-6 py-3 rounded-xl font-semibold transition">
                    <Sparkles size={18} /> Generate a Test
                  </Link>
                  <Link to="/dashboard" className="flex items-center gap-2 glass px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition">
                    <LayoutDashboard size={18} /> Go to Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="bg-brand-500 hover:bg-brand-600 px-6 py-3 rounded-xl font-semibold transition">
                    Get Started Free
                  </Link>
                  <Link to="/login" className="glass px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition">
                    Login
                  </Link>
                </>
              )}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="h-[380px]"
          >
            <HeroBrain />
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">Everything you need to study smarter</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 hover:-translate-y-1 transition-transform"
            >
              <f.icon className="text-brand-400 mb-3" size={26} />
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="glass rounded-2xl p-10">
          <ShieldCheck className="mx-auto text-brand-400 mb-4" size={32} />
          {user ? (
            <>
              <h2 className="text-2xl font-bold mb-3">Ready for your next test, {user.name?.split(" ")[0]}?</h2>
              <p className="text-slate-400 mb-6">Jump back in and keep building your streak.</p>
              <Link to="/generate" className="bg-brand-500 hover:bg-brand-600 px-6 py-3 rounded-xl font-semibold transition">
                Generate a Test
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-3">Ready to test yourself?</h2>
              <p className="text-slate-400 mb-6">Create a free account and generate your first AI test in under a minute.</p>
              <Link to="/register" className="bg-brand-500 hover:bg-brand-600 px-6 py-3 rounded-xl font-semibold transition">
                Create Free Account
              </Link>
            </>
          )}
        </div>
      </section>

      <footer className="text-center text-slate-500 text-sm py-8 border-t border-white/5">
        © {new Date().getFullYear()} TestForge AI — Built with Groq, React & Node.js
      </footer>
    </div>
  );
};

export default Landing;
