import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Dashboard.css';

const FacultyList = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [facultyData, setFacultyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const handleAddFaculty = () => {
    navigate('/faculty/add-faculty');
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await fetch('http://localhost:3001/faculty/all-faculties');
        if (!response.ok) {
          throw new Error('Failed to fetch faculty data');
        }
        const data = await response.json();
        setFacultyData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyData();
  }, []);

  if (!user) {
    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>You are not logged in</h1>
        <p style={styles.subheading}>Please login to access your dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <h2>Loading faculty data...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h2>Error: {error}</h2>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar isMobile={isMobile} />

      <div className="main">
        <Header
          user={user}
          toggleDropdown={toggleDropdown}
          isDropdownOpen={isDropdownOpen}
          handleLogout={handleLogout}
          navigate={navigate}
          isMobile={isMobile}
        />

        <div className={`content-container p-4 md:p-8 w-full mx-auto ${isMobile ? 'px-2' : ''}`} style={{ maxWidth: '95%' }}>
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-8 w-full">
            <div className={`flex ${isMobile ? 'flex-col' : 'justify-between items-center'} mb-6 md:mb-10 gap-4`}>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">Faculty Management</h1>
              <button
                onClick={handleAddFaculty}
                className="bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 text-sm md:text-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Faculty
              </button>
            </div>

            {isMobile ? (
              <div className="space-y-4">
                {facultyData.map((faculty) => (
                  <div key={faculty._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="mb-3">
                      <h3 className="font-medium text-gray-900">{faculty.name}</h3>
                      <p className="text-gray-600 text-sm">{faculty.email}</p>
                    </div>
                    <div className="mb-3">
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Specialization:</span> {faculty.specialization}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => navigate(`/admin/edit-faculty/${faculty._id}`)}
                        className="text-blue-600 hover:text-blue-900 transition-colors duration-200 flex items-center gap-1 text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center gap-1 text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th scope="col" className="px-8 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                        Faculty Name
                      </th>
                      <th scope="col" className="px-8 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-8 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                        Specialization
                      </th>
                      <th scope="col" className="px-8 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {facultyData.map((faculty) => (
                      <tr key={faculty._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-8 py-5 whitespace-nowrap text-base font-medium text-gray-900">
                          {faculty.name}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-base text-gray-600">
                          {faculty.email}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-base text-gray-600">
                          {faculty.specialization}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-base text-gray-600">
                          <div className="flex space-x-4">
                            <button 
                              onClick={() => navigate(`/admin/edit-faculty/${faculty._id}`)}
                              className="text-blue-600 hover:text-blue-900 transition-colors duration-200 flex items-center gap-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center gap-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f4f8',
    padding: '20px',
  },
  heading: {
    fontSize: '32px',
    color: '#333',
    marginBottom: '10px',
    textAlign: 'center',
  },
  subheading: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '30px',
    textAlign: 'center',
  },
};

export default FacultyList;