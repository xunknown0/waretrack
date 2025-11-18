const express = require('express');
const router = express.Router(); // <- capital R
const { categoryDisplay, categoryCreate, categoryDelete } = require('../controllers/categoryController');

// Display all categories
router.get('/', categoryDisplay);

// Create a new category
router.post('/', categoryCreate);

// Delete a category
router.delete('/:id', categoryDelete);

module.exports = router;
