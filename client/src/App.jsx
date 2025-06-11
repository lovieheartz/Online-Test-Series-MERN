import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
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
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <BrowserRouter>
      {/* Add ToastContainer here - the only addition needed */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      {/* Rest of your existing code remains exactly the same */}
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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

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