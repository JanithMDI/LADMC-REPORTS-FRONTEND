import { Routes, Route, useNavigate } from 'react-router-dom';
import { Login } from './pages/auth/login';
import { Dashboard } from './pages/dashboard/Dashboard';
import Report from './pages/reports/Report';

function App() {
  const navigate = useNavigate();

  // Redirect to root if jwtToken not found
  if (!localStorage.getItem("jwtToken")) {
    navigate("/");
    return null;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/report/:reportType" element={<Report/>} />
      </Routes>
    </>
  )
}

export default App
