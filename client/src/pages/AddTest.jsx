import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axios from 'axios';
import { showSuccess, showError } from '../utils/toast';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import FacultySidebar from '../components/FacultySidebar';
import FacultyHeader from '../components/FacultyHeader';
import FacultyFooter from '../components/FacultyFooter';

const AddTest = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const createTestMutation = useMutation({
    mutationFn: async (testData) => {
      const token = sessionStorage.getItem('authToken');
      const response = await axios.post(
        'http://localhost:3001/tests/create',
        testData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess(`Test "${data.data.title}" created successfully! 🎉`);
      
      // Update the cache with the new test
      queryClient.setQueryData(['facultyTests'], (oldData) => {
        if (!oldData) return [data.data];
        return [data.data, ...oldData];
      });
      
      // Also invalidate the query to ensure fresh data
      queryClient.invalidateQueries(['facultyTests']);
      
      reset();
      // Navigate to add questions page
      navigate(`/faculty/add-questions/${data.data._id}`);
    },
    onError: (error) => {
      showError(error.response?.data?.message || 'Failed to create test');
    }
  });

  const onSubmit = (data) => {
    // Convert duration and price to numbers
    data.duration = Number(data.duration);
    data.price = Number(data.price);
    createTestMutation.mutate(data);
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
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Create New Test</h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Test Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    {...register('description', { required: 'Description is required' })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    {...register('subject', { required: 'Subject is required' })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                      Duration (minutes)
                    </label>
                    <input
                      id="duration"
                      type="number"
                      min="1"
                      {...register('duration', { 
                        required: 'Duration is required',
                        min: { value: 1, message: 'Duration must be at least 1 minute' }
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.duration && (
                      <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      {...register('price', { 
                        required: 'Price is required',
                        min: { value: 0, message: 'Price cannot be negative' }
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => navigate('/faculty-dashboard')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createTestMutation.isLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {createTestMutation.isLoading ? 'Creating...' : 'Create Test'}
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

export default AddTest;