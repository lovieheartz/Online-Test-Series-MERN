const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const testController = require('../controllers/testController');

// Create a new test series
router.post('/create', authenticateToken, testController.createTestSeries);

// Get all test series created by a user
router.get('/my-tests', authenticateToken, testController.getUserTestSeries);

// Get a single test series by ID
router.get('/:id', authenticateToken, testController.getTestSeriesById);

// Add a question to a test series
router.post('/:id/add-question', authenticateToken, testController.addQuestion);

// Delete a question
router.delete('/:testId/questions/:questionId', authenticateToken, testController.deleteQuestion);

// Delete a test series
router.delete('/:id', authenticateToken, testController.deleteTestSeries);

module.exports = router;