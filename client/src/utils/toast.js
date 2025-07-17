import { toast } from 'react-toastify';

// Simple wrapper functions for toast notifications
export const showSuccess = (message) => {
  toast.success(message);
  // Also log to console for debugging
  console.log('SUCCESS:', message);
};

export const showError = (message) => {
  toast.error(message);
  console.log('ERROR:', message);
};

export const showInfo = (message) => {
  toast.info(message);
  console.log('INFO:', message);
};