import React, { useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import FacultySidebar from '../components/FacultySidebar';
import FacultyHeader from '../components/FacultyHeader';
import FacultyFooter from '../components/FacultyFooter';

const ManageQuestions = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { testId } = useParams();
  const queryClient = useQueryClient();
  
  // Fetch test details with questions
  const { data: testData, isLoading } = useQuery({
    queryKey: ['test', testId],
    queryFn: async () => {
      const token = sessionStorage.getItem('authToken');
      const response = await axios.get(
        `http://localhost:3001/tests/${testId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    },
    enabled: !!testId && !!user
  });

  // Delete question mutation
  const deleteQuestionMutation = useMutation({
    mutationFn: async ({ testId, questionId }) => {
      const token = sessionStorage.getItem('authToken');
      const response = await axios.delete(
        `http://localhost:3001/tests/${testId}/questions/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Question deleted successfully');
      queryClient.invalidateQueries(['test', testId]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete question');
    }
  });

  const handleDeleteQuestion = (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deleteQuestionMutation.mutate({ testId, questionId });
    }
  };

  const handleAddMoreQuestions = () => {
    navigate(`/faculty/add-questions/${testId}`);
  };

  const handleBackToTests = () => {
    navigate('/faculty/my-test-series');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Please login to access this page</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Loading test details...</p>
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
            {testData && (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">{testData.title}</h1>
                    <p className="text-gray-600">Subject: {testData.subject}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    <button
                      onClick={handleAddMoreQuestions}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Add More Questions
                    </button>
                    <button
                      onClick={handleBackToTests}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Back to Tests
                    </button>
                  </div>
                </div>

                {testData.questions && testData.questions.length > 0 ? (
                  <div className="space-y-6">
                    {testData.questions.map((question, index) => (
                      <div key={question._id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium">Question {index + 1}</h3>
                          <button
                            onClick={() => handleDeleteQuestion(question._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                        <p className="mt-2">{question.questionText}</p>
                        
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          {question.options && question.options.length >= 4 ? (
                            <>
                              <div className={`p-2 rounded ${question.correctAnswer === 'A' ? 'bg-green-100 border border-green-500' : 'bg-gray-50'}`}>
                                <span className="font-medium">A:</span> {question.options[0]}
                                {question.correctAnswer === 'A' && <span className="ml-2 text-green-600 font-bold">(Correct)</span>}
                              </div>
                              <div className={`p-2 rounded ${question.correctAnswer === 'B' ? 'bg-green-100 border border-green-500' : 'bg-gray-50'}`}>
                                <span className="font-medium">B:</span> {question.options[1]}
                                {question.correctAnswer === 'B' && <span className="ml-2 text-green-600 font-bold">(Correct)</span>}
                              </div>
                              <div className={`p-2 rounded ${question.correctAnswer === 'C' ? 'bg-green-100 border border-green-500' : 'bg-gray-50'}`}>
                                <span className="font-medium">C:</span> {question.options[2]}
                                {question.correctAnswer === 'C' && <span className="ml-2 text-green-600 font-bold">(Correct)</span>}
                              </div>
                              <div className={`p-2 rounded ${question.correctAnswer === 'D' ? 'bg-green-100 border border-green-500' : 'bg-gray-50'}`}>
                                <span className="font-medium">D:</span> {question.options[3]}
                                {question.correctAnswer === 'D' && <span className="ml-2 text-green-600 font-bold">(Correct)</span>}
                              </div>
                            </>
                          ) : (
                            <div className="col-span-2 text-red-500">Options data format is incorrect</div>
                          )}
                        </div>
                        
                        <div className="mt-3 p-2 bg-green-50 rounded">
                          <p className="font-medium">Correct Answer: {question.correctAnswer}</p>
                        </div>
                        
                        {question.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 rounded">
                            <p className="text-sm font-medium">Explanation:</p>
                            <p className="text-sm">{question.explanation}</p>
                          </div>
                        )}
                        
                        <div className="mt-3 text-sm text-gray-600">
                          <span className="mr-4">Marks: {question.marks}</span>
                          <span>Negative Marks: {question.negativeMarks}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow p-10 text-center">
                    <p className="text-gray-600 mb-4">No questions added to this test yet.</p>
                    <button
                      onClick={handleAddMoreQuestions}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Add Your First Question
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
        
        <FacultyFooter />
      </div>
    </div>
  );
};

export default ManageQuestions;