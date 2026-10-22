import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CourseSelection from "./pages/CourseSelection";
import CourseDetail from "./pages/CourseDetail";
import Techniques from "./pages/Techniques";
import Quiz from "./pages/Quiz";
import Mentors from "./pages/Mentors";
import Progress from "./pages/Progress";
import MentorDashboard from "./pages/MentorDashboard"; 

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>}
          />
          
          {/* ======================================================== */}
          {/* RUTA NUEVA PARA EL MENTOR */}
          <Route
            path="/mentor-panel"
            element={<ProtectedRoute><Layout><MentorDashboard /></Layout></ProtectedRoute>}
          />
          {/* ======================================================== */}

          <Route
            path="/courses"
            element={<ProtectedRoute><Layout><CourseSelection /></Layout></ProtectedRoute>}
          />
          <Route
            path="/courses/:id"
            element={<ProtectedRoute><Layout><CourseDetail /></Layout></ProtectedRoute>}
          />
          <Route
            path="/techniques"
            element={<ProtectedRoute><Layout><Techniques /></Layout></ProtectedRoute>}
          />
          <Route
            path="/quiz/:id"
            element={<ProtectedRoute><Layout><Quiz /></Layout></ProtectedRoute>}
          />
          <Route
            path="/mentors"
            element={<ProtectedRoute><Layout><Mentors /></Layout></ProtectedRoute>}
          />
          <Route
            path="/progress"
            element={<ProtectedRoute><Layout><Progress /></Layout></ProtectedRoute>}
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}