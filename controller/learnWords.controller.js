const toeic600Words = require('../models/toeic-600-words.model')
const authModel = require('../models/auth.model');
const logic = require('../public/js/logic');

module.exports.index = async function(req, res) {
    // let user = await authModel.find({ _id: req.signedCookies.userId });
    // let wordId = parseInt(req.params.wordId) || 1;
    // let word = await toeic600Words.find({ wordId: wordId });
    // let nextWord = wordId + 1;
    // let preWord = wordId > 1 ? wordId - 1 : 1;
    // let isCheckWordsUser = false;
    // for(let i=0;i<user.words.length;i++)
    // {
    //     if()
    // }
    let word = await toeic600Words.find().count();
    console.log(word);
    res.render('learn-words/index.ejs', {
        data: word,
        nextWord: nextWord,
        preWord: preWord
    });
}

module.exports.postSaveWord = async function(req, res) {
    await authModel.findOne({ _id: req.signedCookies.userId }, function(err, userdoc) {
        if (err) {
            console.log(err);
        } else {
            userdoc.words.push(req.params.wordId);
            userdoc.words = logic.SortWordsId(userdoc.words);
            userdoc.save(function(err) {
                if (err)
                    console.log(err);
            })
        }
    });
    res.redirect('/');
}