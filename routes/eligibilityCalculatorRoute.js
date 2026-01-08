const express = require('express');
const router = express.Router();

// Import controllers
const addEligibilityCalculator = require('../controllers/eligibility-calculator/addEligibilityCalculator');
const getEligibilityCalculators = require('../controllers/eligibility-calculator/getEligibilityCalculator');
const getEligibilityCalculatorByID = require('../controllers/eligibility-calculator/getEligibilityCalculatorByID');
const updateEligibilityCalculator = require('../controllers/eligibility-calculator/updateEligibilityCalculator');
const deleteEligibilityCalculator = require('../controllers/eligibility-calculator/deleteEligibilityCalculator');
const checkEligibilityCalculator = require('../controllers/eligibility-calculator/checkEligibilityCalculator');

// Import middleware
const authRole = require('../middleware/authRole');

/**
 * @route   POST /api/eligibility-calculator/add
 * @desc    Add new eligibility calculation
 * @access  Public
 */
router.post('/add', addEligibilityCalculator);

/**
 * @route   GET /api/eligibility-calculator/get
 * @desc    Get all eligibility calculations with pagination and filters
 * @access  Private (Admin)
 */
router.get('/get', authRole(), getEligibilityCalculators);

/**
 * @route   GET /api/eligibility-calculator/get-by-id
 * @desc    Get eligibility calculation by unique ID
 * @access  Public
 */
router.get('/get-by-id', getEligibilityCalculatorByID);

/**
 * @route   POST /api/eligibility-calculator/check
 * @desc    Check if eligibility calculation exists for mobile number
 * @access  Public
 */
router.post('/check', checkEligibilityCalculator);

/**
 * @route   PUT /api/eligibility-calculator/update
 * @desc    Update eligibility calculation
 * @access  Public
 */
router.put('/update', updateEligibilityCalculator);

/**
 * @route   DELETE /api/eligibility-calculator/delete
 * @desc    Delete eligibility calculation
 * @access  Private (Admin)
 */
router.delete('/delete', authRole(), deleteEligibilityCalculator);

module.exports = router;
