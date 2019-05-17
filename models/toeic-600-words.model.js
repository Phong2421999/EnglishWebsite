const mongoose = require('mongoose');

var toeic600WordSchema = new mongoose.Schema({
    word: String,
    translate: String,
    wordType: String,
    example: String,
    explain: String,
    imageUrl: String,
    audioUrl: String,
    wordId: Number
});

var toeic600Words = mongoose.model('toeic600Words', toeic600WordSchema, 'toeic-600-words');

module.exports = toeic600Words;