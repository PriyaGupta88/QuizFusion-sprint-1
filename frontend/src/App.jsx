import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AIChatWidget from "./components/AIChatWidget";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import GenerateTest from "./pages/GenerateTest";
import TakeTest from "./pages/TakeTest";
import Result from "./pages/Result";

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/generate"
          element={
            <ProtectedRoute>
              <GenerateTest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test/:id"
          element={
            <ProtectedRoute>
              <TakeTest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/result/:id"
          element={
            <ProtectedRoute>
              <Result />
            </ProtectedRoute>
          }
        />
      </Routes>
      {/* Global AI assistant on dashboard/generate pages (test pages render their own with context) */}
      <Routes>
        <Route path="/dashboard" element={<AIChatWidget />} />
        <Route path="/generate" element={<AIChatWidget />} />
      </Routes>
    </div>
  );
}

export default App;
