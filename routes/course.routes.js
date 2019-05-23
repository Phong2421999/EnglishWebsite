const express = require('express');
const courseController = require('../controller/course.controller');

const router = express.Router();

router.get('/', courseController.index);

module.exports = router;