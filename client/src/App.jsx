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
import Profile from "./pages/Profile"; 
import EditFaculty from './pages/EditFaculty';
import AddTest from './pages/AddTest';
import AddQuestion from './pages/AddQuestion';
import FacultyTestSeries from './pages/FacultyTestSeries';
import ManageQuestions from './pages/ManageQuestions';

// ✅ Optional: Add React Query DevTools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        limit={3}
      />

      <Routes>
        {/* Public routes */}
        <Route path='/' element={<Signup />} />
        <Route path='/student' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/create-admin' element={<CreateAdmin />} />
        <Route path='/admin/create-admin' element={<AdminCreateAdmin />} />
        <Route path='/faculty/create-faculty' element={<CreateFaculty />} />
        {/* <Route path='/faculty/add-faculty' element={<AddFaculty />} />
        <Route path='/admin/faculty' element={<FacultyList />} />  */}
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        {/* Protected routes */}
        <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/student-dashboard' element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
        <Route path='/faculty-dashboard' element={<ProtectedRoute><FacultyDashboard /></ProtectedRoute>} />
        <Route path='/admin/faculty' element={<ProtectedRoute><FacultyList /></ProtectedRoute>} />
        <Route path='/faculty/add-faculty' element={<ProtectedRoute><AddFaculty /></ProtectedRoute>} />
        <Route path="/admin/edit-faculty/:id" element={<EditFaculty />} />
        
        {/* Test management routes */}
        <Route path='/faculty/add-test' element={<ProtectedRoute><AddTest /></ProtectedRoute>} />
        <Route path='/faculty/add-questions/:testId' element={<ProtectedRoute><AddQuestion /></ProtectedRoute>} />
        <Route path='/faculty/my-test-series' element={<ProtectedRoute><FacultyTestSeries /></ProtectedRoute>} />
        <Route path='/faculty/manage-questions/:testId' element={<ProtectedRoute><ManageQuestions /></ProtectedRoute>} />
      </Routes>

      {/* ✅ Add React Query DevTools at the bottom */}
      <ReactQueryDevtools initialIsOpen={false} />
    </BrowserRouter>
  );
}

export default App;
