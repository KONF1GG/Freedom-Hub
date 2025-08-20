import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./auth/LoginPage";
import HomePage from "./home/HomePage";
import RequestDetailsPage from "./home/RequestDetailsPage";
import { useAuthStore } from "../stores/authStore";
import { StandaloneEnforcer } from "../components/auth/StandaloneEnforcer";
import RequireStandalone from "../components/auth/RequireStandalone";
import Toaster from "../components/ui/Toaster";
import InstallPwaHint from "../components/auth/InstallPwaHint";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <>
      <StandaloneEnforcer />
      <Toaster />
      <InstallPwaHint />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <RequireStandalone>
                <HomePage />
              </RequireStandalone>
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks/:id"
          element={
            <PrivateRoute>
              <RequireStandalone>
                <RequestDetailsPage />
              </RequireStandalone>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
