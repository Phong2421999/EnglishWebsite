const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let saltRound = 10;
let usersSchema = new mongoose.Schema({
    username: String,
    password: String,
    fullname: String,
    email: String,
    courses: { type: Object, default: [] },
    active: { type: Boolean, default: false },
    permission: { type: String, default: 'user' }
});

usersSchema.methods.hashPassword = async function() {
    return bcrypt.hash(this.password, saltRound)
        .then((hash) => {
            this.password = hash;
        });
}

usersSchema.methods.isRightPassword = async function(password) {
    return bcrypt.compare(password, this.password);
}

usersSchema.methods.forgotPassword = async function(hashString) {
    return bcrypt.hash(hashString, saltRound)
        .then((hash) => {
            this.password = hash;
        });
}

let authModel = mongoose.model('authModel', usersSchema, 'users-data');

module.exports = authModel;