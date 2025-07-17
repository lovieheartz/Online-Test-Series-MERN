const TestSeries = require('../models/TestSeries');
const Question = require('../models/Question');

// Create a new test series
exports.createTestSeries = async (req, res) => {
  try {
    const { title, description, subject, duration, price } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!title || !subject || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Title, subject, and duration are required'
      });
    }

    const newTestSeries = new TestSeries({
      title,
      description: description || '',
      subject,
      duration: Number(duration),
      price: Number(price) || 0,
      createdBy: userId,
      createdByModel: userRole,
      questions: []
    });

    await newTestSeries.save();

    res.status(201).json({
      success: true,
      message: 'Test series created successfully',
      data: newTestSeries
    });
  } catch (error) {
    console.error('Create test series error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create test series',
      error: error.message
    });
  }
};

// Get all test series created by a faculty/admin
exports.getUserTestSeries = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const testSeries = await TestSeries.find({ 
      createdBy: userId,
      createdByModel: userRole
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: testSeries.length,
      data: testSeries
    });
  } catch (error) {
    console.error('Get user test series error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test series',
      error: error.message
    });
  }
};

// Get a single test series by ID
exports.getTestSeriesById = async (req, res) => {
  try {
    const testId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    const testSeries = await TestSeries.findById(testId);
    
    if (!testSeries) {
      return res.status(404).json({
        success: false,
        message: 'Test series not found'
      });
    }

    // Check if the user is the creator of the test series
    if (testSeries.createdBy.toString() !== userId || testSeries.createdByModel !== userRole) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this test series'
      });
    }

    // Get all questions for this test series
    const questions = await Question.find({ testId: testId });

    res.status(200).json({
      success: true,
      data: {
        ...testSeries._doc,
        questions
      }
    });
  } catch (error) {
    console.error('Get test series by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test series',
      error: error.message
    });
  }
};

// Add a question to a test series
exports.addQuestion = async (req, res) => {
  try {
    const testId = req.params.id;
    const { questionText, options, correctAnswer, explanation, marks, negativeMarks } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!questionText || !options || !correctAnswer) {
      return res.status(400).json({
        success: false,
        message: 'Question text, options, and correct answer are required'
      });
    }

    const testSeries = await TestSeries.findById(testId);
    
    if (!testSeries) {
      return res.status(404).json({
        success: false,
        message: 'Test series not found'
      });
    }

    // Check if the user is the creator of the test series
    if (testSeries.createdBy.toString() !== userId || testSeries.createdByModel !== userRole) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to add questions to this test series'
      });
    }

    const newQuestion = new Question({
      testId,
      questionText,
      options,
      correctAnswer,
      explanation: explanation || '',
      marks: marks || 1,
      negativeMarks: negativeMarks || 0
    });

    const savedQuestion = await newQuestion.save();

    // Add question reference to test series
    testSeries.questions.push(savedQuestion._id);
    await testSeries.save();

    res.status(201).json({
      success: true,
      message: 'Question added successfully',
      data: savedQuestion
    });
  } catch (error) {
    console.error('Add question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add question',
      error: error.message
    });
  }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
  try {
    const testId = req.params.testId;
    const questionId = req.params.questionId;
    const userId = req.user.id;
    const userRole = req.user.role;

    const testSeries = await TestSeries.findById(testId);
    
    if (!testSeries) {
      return res.status(404).json({
        success: false,
        message: 'Test series not found'
      });
    }

    // Check if the user is the creator of the test series
    if (testSeries.createdBy.toString() !== userId || testSeries.createdByModel !== userRole) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete questions from this test series'
      });
    }

    // Remove question from test series
    testSeries.questions = testSeries.questions.filter(
      q => q.toString() !== questionId
    );
    await testSeries.save();

    // Delete the question
    await Question.findByIdAndDelete(questionId);

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete question',
      error: error.message
    });
  }
};

// Delete a test series
exports.deleteTestSeries = async (req, res) => {
  try {
    const testId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    const testSeries = await TestSeries.findById(testId);
    
    if (!testSeries) {
      return res.status(404).json({
        success: false,
        message: 'Test series not found'
      });
    }

    // Check if the user is the creator of the test series
    if (testSeries.createdBy.toString() !== userId || testSeries.createdByModel !== userRole) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this test series'
      });
    }

    // Delete all questions associated with this test series
    await Question.deleteMany({ testId });

    // Delete the test series
    await TestSeries.findByIdAndDelete(testId);

    res.status(200).json({
      success: true,
      message: 'Test series and all associated questions deleted successfully'
    });
  } catch (error) {
    console.error('Delete test series error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete test series',
      error: error.message
    });
  }
};