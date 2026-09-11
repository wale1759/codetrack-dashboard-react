import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import GuestRoute from "./components/auth/GuestRoute.jsx";
import RequireAuth from "./components/auth/RequireAuth.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LogPage from "./pages/LogPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/log"
        element={
          <RequireAuth>
            <LogPage />
          </RequireAuth>
        }
      />
      <Route
        path="/signin"
        element={
          <GuestRoute>
            <SignInPage />
          </GuestRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestRoute>
            <SignUpPage />
          </GuestRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;

