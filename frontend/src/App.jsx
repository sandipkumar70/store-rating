import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Stores from "./pages/Stores";
import Admin from "./pages/Admin";
import Owner from "./pages/Owner";
import Password from "./pages/Password";

function ProtectedRoute({ role, children }) {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  let user = null;
  if (savedUser) {
    user = JSON.parse(savedUser);
  }
  if (!token || !user || user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
}

function LoggedIn({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner"
          element={
            <ProtectedRoute role="owner">
              <Owner />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stores"
          element={
            <ProtectedRoute role="user">
              <Stores />
            </ProtectedRoute>
          }
        />
        <Route
          path="/password"
          element={
            <LoggedIn>
              <Password />
            </LoggedIn>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;