import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/auth/login';
import { Dashboard } from './pages/dashboard/Dashboard';
import Report from './pages/reports/Report';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/report" element={<Report/>} />
      </Routes>
    </>
  )
}

export default App
