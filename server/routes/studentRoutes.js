const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// ✅ handle POST /register directly
router.post('/', studentController.registerStudent);

module.exports = router;
