import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import AboutPage from "./pages/AboutPage";
import AdminPage from "./pages/AdminPage";
import CreatorPage from "./pages/CreatorPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProjectsPage from "./pages/ProjectsPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ServicesPage from "./pages/ServicesPage";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/skills" element={<Navigate to="/projects" replace />} />
          <Route path="/creator" element={<CreatorPage />} />
          <Route path="/youtube" element={<Navigate to="/creator" replace />} />
          <Route path="/writing" element={<Navigate to="/creator" replace />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<Navigate to="/services" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
      <Chatbot />
    </AuthProvider>
  );
}

export default App;
