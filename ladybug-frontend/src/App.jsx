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
import CreateBugPage from "./pages/bugs/CreateBugPage";
import BugDetailsPage from "./pages/bugs/BugDetailsPage";
import MyBugsPage from "./pages/bugs/MyBugsPage";
import ProfilePage from "./pages/profile/ProfilePage";
import AssignmentsPage from "./pages/assignments/AssignmentsPage";

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
            <Route path="/bugs/new" element={<ProtectedRoute><CreateBugPage/></ProtectedRoute>}/>
            <Route path="/bugs/:id" element={<ProtectedRoute><BugDetailsPage/></ProtectedRoute>}/>
            <Route path="/bugs" element={<ProtectedRoute><BugsPage/></ProtectedRoute>}/>
            <Route path="/my-bugs" element={<ProtectedRoute><MyBugsPage/></ProtectedRoute>}/>
            <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>}/>
            <Route path="/assignments" element={<ProtectedRoute><AssignmentsPage/></ProtectedRoute>}/>


            <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
            <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
            
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App