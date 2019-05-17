const express = require('express');

const learnWordsController = require('../controller/learnWords.controller');

const router = express.Router();

router.get('/', learnWordsController.index);

router.get('/:wordId', learnWordsController.index);

router.get('/add/:wordId', learnWordsController.postSaveWord);

module.exports = router;