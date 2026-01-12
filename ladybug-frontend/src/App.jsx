import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import{AuthProvider} from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProjectsPage from "./pages/projects/ProjectsPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>

            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage/></ProtectedRoute>}/>
            <Route path="projects" element={<ProtectedRoute><ProjectPage /></ProtectedRoute>}/>
            
            <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
            <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
            
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App