import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import{AuthProvider} from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProjectsPage from "./pages/projects/ProjectsPage";
import ProjectDetailsPage from "./pages/projects/ProjectDetailsPage";
import CreateProjectPage from "./pages/projects/CreateProjectPage";
import BugsPage from "./pages/bugs/BugsPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>

            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage/></ProtectedRoute>}/>
            <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>}/>
            <Route path="/projects/new" element={<ProtectedRoute><CreateProjectPage/></ProtectedRoute>}/>
            <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetailsPage/></ProtectedRoute>}/>
            
            <Route path="/bugs" element={<ProtectedRoute><BugsPage/></ProtectedRoute>}/>

            <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
            <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
            
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App