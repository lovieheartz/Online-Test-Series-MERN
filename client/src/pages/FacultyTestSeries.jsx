import React, { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import FacultySidebar from '../components/FacultySidebar';
import FacultyHeader from '../components/FacultyHeader';
import FacultyFooter from '../components/FacultyFooter';

const FacultyTestSeries = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch faculty tests
  const { data: testsData, isLoading, refetch } = useQuery({
    queryKey: ['facultyTests'],
    queryFn: async () => {
      const token = sessionStorage.getItem('authToken');
      console.log('Fetching tests with token:', token);
      
      try {
        const response = await axios.get(
          'http://localhost:3001/tests/my-tests',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Tests response:', response.data);
        return response.data.data || [];
      } catch (error) {
        console.error('Error fetching tests:', error.response?.data || error.message);
        return [];
      }
    },
    enabled: !!user,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0 // Always refetch
  });
  
  // Force refetch on component mount
  React.useEffect(() => {
    refetch();
  }, [refetch]);

  // Delete test mutation
  const deleteTestMutation = useMutation({
    mutationFn: async (testId) => {
      const token = sessionStorage.getItem('authToken');
      await axios.delete(
        `http://localhost:3001/tests/${testId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return testId;
    },
    onSuccess: () => {
      toast.success('Test deleted successfully');
      queryClient.invalidateQueries(['facultyTests']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete test');
    }
  });

  const handleAddMoreQuestions = (testId) => {
    navigate(`/faculty/add-questions/${testId}`);
  };

  const handleManageQuestions = (testId) => {
    navigate(`/faculty/manage-questions/${testId}`);
  };

  const handleDeleteTest = (testId) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      deleteTestMutation.mutate(testId);
    }
  };

  const handleAddNewTest = () => {
    navigate('/faculty/add-test');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Please login to access this page</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <FacultySidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <FacultyHeader user={user} />
        
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold mr-4">My Test Series</h1>
                <button
                  onClick={() => refetch()}
                  className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                  title="Refresh test list"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              <button
                onClick={handleAddNewTest}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add New Test
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-10">
                <p className="text-gray-600">Loading tests...</p>
              </div>
            ) : testsData && Array.isArray(testsData) && testsData.length > 0 ? (
              <div className="space-y-6">
                {testsData.map((test) => (
                  <div key={test._id} className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold">{test.title}</h2>
                    <p className="text-gray-600 mt-1">{test.description}</p>
                    <p className="text-sm text-gray-500 mt-2">Subject: {test.subject}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        onClick={() => handleAddMoreQuestions(test._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Add More Questions
                      </button>
                      <button
                        onClick={() => handleManageQuestions(test._id)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        Manage Questions
                      </button>
                      <button
                        onClick={() => handleDeleteTest(test._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Delete Test Series
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-10 text-center">
                <p className="text-gray-600 mb-4">You haven't created any tests yet.</p>
                <button
                  onClick={handleAddNewTest}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Create Your First Test
                </button>
              </div>
            )}
          </div>
        </main>
        
        <FacultyFooter />
      </div>
    </div>
  );
};

export default FacultyTestSeries;