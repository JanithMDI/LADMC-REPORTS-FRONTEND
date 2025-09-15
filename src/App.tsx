import { Routes, Route, useLocation } from 'react-router-dom';
import { Login } from './pages/auth/login';
import { Dashboard } from './pages/dashboard/Dashboard';
import Report from './pages/reports/Report';
import { SignUp } from './pages/auth/register/SignUp';

function App() {
  const location = useLocation();
  const isProtectedRoute = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/report/");

  // Redirect to root if jwtToken not found and on protected route
  if (isProtectedRoute && !localStorage.getItem("jwtToken")) {
    window.location.replace("/");
    return null;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/create-account" element={<SignUp/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/report/:reportType" element={<Report/>} />
      </Routes>
    </>
  )
}

export default App
