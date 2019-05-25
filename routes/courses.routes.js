const express = require('express');

const coursesController = require('../controller/courses.controller');

const router = express.Router();
router.get('/', coursesController.index);
module.exports = router;