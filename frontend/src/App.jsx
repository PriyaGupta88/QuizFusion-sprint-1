import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

const AIChatWidget = lazy(() => import("./components/AIChatWidget"));
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const GenerateTest = lazy(() => import("./pages/GenerateTest"));
const TakeTest = lazy(() => import("./pages/TakeTest"));
const Result = lazy(() => import("./pages/Result"));

const PageFallback = () => <div className="p-10 text-center text-slate-400">Loading...</div>;

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/generate" element={<ProtectedRoute><GenerateTest /></ProtectedRoute>} />
          <Route path="/test/:id" element={<ProtectedRoute><TakeTest /></ProtectedRoute>} />
          <Route path="/result/:id" element={<ProtectedRoute><Result /></ProtectedRoute>} />
        </Routes>
        <Routes>
          <Route path="/dashboard" element={<AIChatWidget />} />
          <Route path="/generate" element={<AIChatWidget />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
