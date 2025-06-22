import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Dashboard.css';

const fetchFacultyData = async () => {
  const response = await fetch('http://localhost:3001/faculty/all-faculties');
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch faculty data');
  }

  const result = await response.json();
  if (!result.data || !Array.isArray(result.data)) {
    throw new Error('Invalid data format received from server');
  }

  return result.data;
};

const deleteFaculty = async (facultyId) => {
  const response = await fetch(`http://localhost:3001/faculty/delete/${facultyId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete faculty');
  }

  return facultyId;
};

const FacultyList = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const {
    data: facultyData = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['faculties'],
    queryFn: fetchFacultyData,
  });

  const mutation = useMutation({
    mutationFn: deleteFaculty,
    onSuccess: (deletedId) => {
      queryClient.setQueryData(['faculties'], (old) =>
        old ? old.filter((f) => f._id !== deletedId) : []
      );
      toast.success('Faculty deleted successfully');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleDeleteFaculty = (facultyId) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      mutation.mutate(facultyId);
    }
  };

  const handleAddFaculty = () => navigate('/faculty/add-faculty');

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-5">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">You are not logged in</h1>
        <p className="text-lg text-gray-600 mb-6">Please login to access your dashboard.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading faculty data...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-5">
        <h2 className="text-2xl text-red-600 mb-4">Error: {error.message}</h2>
        <button
          onClick={() => queryClient.invalidateQueries(['faculties'])}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main">
        <Header
          user={user}
          toggleDropdown={toggleDropdown}
          isDropdownOpen={isDropdownOpen}
          handleLogout={handleLogout}
          navigate={navigate}
        />

        <div className="content-container px-3 py-4 w-full mx-auto max-w-full">
          <div className="bg-white rounded-xl shadow-sm px-4 py-4 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
              <h1 className="text-xl font-semibold text-gray-800">Faculty Management</h1>
              <button
                onClick={handleAddFaculty}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm md:text-base"
              >
                ➕ Add Faculty
              </button>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Name</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Email</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Specialization</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {facultyData.length > 0 ? (
                    facultyData.map((faculty) => (
                      <tr key={faculty._id} className="hover:bg-gray-50">
                        <td className="px-3 py-3 text-gray-900">{faculty.name}</td>
                        <td className="px-3 py-3 text-gray-600">{faculty.email}</td>
                        <td className="px-3 py-3 text-gray-600">{faculty.specialization}</td>
                        <td className="px-3 py-3 text-gray-600">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => navigate(`/admin/edit-faculty/${faculty._id}`)}
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteFaculty(faculty._id)}
                              className="text-red-600 hover:text-red-800 flex items-center gap-1"
                            >
                              🗑️ Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-3 py-3 text-center text-gray-500">
                        No faculty members found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default FacultyList;
