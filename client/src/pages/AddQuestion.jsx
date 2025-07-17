import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { showSuccess, showError } from '../utils/toast';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import FacultySidebar from '../components/FacultySidebar';
import FacultyHeader from '../components/FacultyHeader';
import FacultyFooter from '../components/FacultyFooter';

const AddQuestion = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { testId } = useParams();
  const [correctAnswer, setCorrectAnswer] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm();

  // Fetch test details
  const { data: testData, isLoading: isTestLoading } = useQuery({
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
    enabled: !!testId && !!user,
    onError: (error) => {
      toast.error('Failed to fetch test details');
      navigate('/faculty/my-test-series');
    }
  });

  const addQuestionMutation = useMutation({
    mutationFn: async (questionData) => {
      const token = sessionStorage.getItem('authToken');
      console.log('Sending question data:', questionData);
      
      try {
        const response = await axios.post(
          `http://localhost:3001/tests/${testId}/add-question`,
          questionData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Question added successfully:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error adding question:', error.response?.data || error.message);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Use our custom toast utility
      showSuccess('Question added successfully!');
      
      // Reset form after successful submission
      reset();
      setCorrectAnswer('');
    },
    onError: (error) => {
      showError(error.response?.data?.message || 'Failed to add question');
    }
  });

  const onSubmit = (data) => {
    if (!correctAnswer) {
      showError('Please select the correct answer');
      return;
    }

    // Show a toast when form is submitted
    showInfo('Submitting question...');

    const questionData = {
      testId,
      questionText: data.questionText,
      options: [data.optionA, data.optionB, data.optionC, data.optionD],
      correctAnswer,
      explanation: data.explanation || '',
      marks: Number(data.marks) || 1,
      negativeMarks: Number(data.negativeMarks) || 0
    };

    addQuestionMutation.mutate(questionData);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Please login to access this page</p>
      </div>
    );
  }

  if (isTestLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Loading test details...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Using global ToastContainer from App.jsx */}
      <FacultySidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <FacultyHeader user={user} />
        
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => navigate('/faculty/my-test-series')}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Tests
              </button>
              <h1 className="text-2xl font-bold text-center flex-1">Add Question to Test</h1>
              <div className="w-24"></div> {/* Empty div for balance */}
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="questionText" className="block font-medium text-gray-700">
                  Question Text
                </label>
                <textarea
                  id="questionText"
                  rows={3}
                  {...register('questionText', { required: 'Question text is required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="optionA" className="block font-medium text-gray-700">
                  Option A
                </label>
                <input
                  id="optionA"
                  type="text"
                  {...register('optionA', { required: 'Option A is required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="optionB" className="block font-medium text-gray-700">
                  Option B
                </label>
                <input
                  id="optionB"
                  type="text"
                  {...register('optionB', { required: 'Option B is required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="optionC" className="block font-medium text-gray-700">
                  Option C
                </label>
                <input
                  id="optionC"
                  type="text"
                  {...register('optionC', { required: 'Option C is required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="optionD" className="block font-medium text-gray-700">
                  Option D
                </label>
                <input
                  id="optionD"
                  type="text"
                  {...register('optionD', { required: 'Option D is required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="correctAnswer" className="block font-medium text-gray-700">
                  Correct Answer
                </label>
                <select
                  id="correctAnswer"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
                >
                  <option value="">Select</option>
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              <div>
                <label htmlFor="explanation" className="block font-medium text-gray-700">
                  Explanation (Optional)
                </label>
                <textarea
                  id="explanation"
                  rows={3}
                  {...register('explanation')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="marks" className="block font-medium text-gray-700">
                    Marks
                  </label>
                  <select
                    id="marks"
                    {...register('marks')}
                    defaultValue="1"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="negativeMarks" className="block font-medium text-gray-700">
                    Negative Marks
                  </label>
                  <input
                    id="negativeMarks"
                    type="number"
                    min="0"
                    step="0.25"
                    defaultValue="0"
                    {...register('negativeMarks')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-center flex-col space-y-2">
                <button
                  type="submit"
                  disabled={addQuestionMutation.isLoading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                >
                  {addQuestionMutation.isLoading ? 'Adding...' : 'Add Question'}
                </button>
                
                <button
                  type="button"
                  onClick={() => showSuccess('Test toast notification')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Test Notification
                </button>
              </div>
            </form>
          </div>
          
        </main>
        
        <FacultyFooter />
      </div>
    </div>
  );
};

// Add useEffect to test toast
React.useEffect(() => {
  const timer = setTimeout(() => {
    toast.info('Ready to add questions');
  }, 1000);
  return () => clearTimeout(timer);
}, []);

export default AddQuestion;