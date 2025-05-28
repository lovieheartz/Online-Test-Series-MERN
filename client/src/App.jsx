import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import CreateFaculty from "./pages/CreateFaculty";
import CreateAdmin from "./pages/CreateAdmin";
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminCreateAdmin from './pages/AdminCreateAdmin';
import ProtectedRoute from './pages/ProtectedRoute';
import FacultyList from './pages/FacultyList';
import AddFaculty from './pages/AddFaculty';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<Signup />} />
        <Route path='/student' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        {/* Make create-admin public, no ProtectedRoute */}
        <Route path='/create-admin' element={<CreateAdmin />} />
        <Route path='/admin/create-admin' element={<AdminCreateAdmin />} />
        <Route path='/faculty/create-faculty' element={<CreateFaculty />} />
        <Route path="/faculty/add-faculty" element={<AddFaculty />} />
        <Route path="/admin/faculty" element={<FacultyList />} />  

        {/* Protected routes */}
        <Route
          path='/home'
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path='/student-dashboard'
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/faculty-dashboard'
          element={
            <ProtectedRoute>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/faculty'
          element={
            <ProtectedRoute>
              <FacultyList />
            </ProtectedRoute>
          }
        />
        <Route
          path='/faculty/add-faculty'
          element={
            <ProtectedRoute>
              <AddFaculty />
            </ProtectedRoute>
          }
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
