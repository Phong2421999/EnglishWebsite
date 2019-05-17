const mongoose = require('mongoose');
const md5 = require('md5');

let verifyUsersSchema = new mongoose.Schema({
    userId: String,
    hash: String
});

verifyUsersSchema.methods.input = function(id) {
    this.userId = id;
    this.hash = md5(process.env.HASH_VERIFY_STRING + this.userId);
}

let verifyUserModel = mongoose.model('verifyUserModel', verifyUsersSchema, 'users-verify');

module.exports = verifyUserModel;