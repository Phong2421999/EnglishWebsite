const authModel = require('../models/auth.model');
const verifyUserModel = require('../models/verify-users.model');
const emailFunctions = require('../functions/email.functions');

module.exports.login = function(req, res) {
    res.render('auth/login.ejs');
}


module.exports.register = function(req, res) {
    res.render('auth/register.ejs');
}

module.exports.forgotPassword = function(req, res) {
    res.render('auth/forgot-password.ejs');
}

module.exports.logout = function(req, res) {
    res.clearCookie('userSessionId');
    res.redirect('/');
}

module.exports.viewUser = function(req, res) {
    res.render('auth/user-information.ejs');
}

module.exports.verify = async function(req, res) {
    let hash = req.params.hash;
    try {
        let verifyUser = await verifyUserModel.findOne({ hash: hash });
        authModel.updateOne({ _id: verifyUser.userId }, { $set: { active: true } }, function(err) {
            if (err)
                console.log(err);
        });
        verifyUserModel.deleteOne({ userId: verifyUser.userId }, function(err) {
            if (err)
                console.log(err);
        });
        res.render('notify.ejs', {
            notify: "Your account was actived! You can login now!"
        });
    } catch (err) {
        res.render('_404.ejs');
    }
}

module.exports.postLogin = async function(req, res) {
    let username = req.body.loginUsername;
    let password = req.body.loginPassword;
    let inputData = {
        username: username,
        password: password
    }
    let user = await authModel.find({ username: username });
    if (user.length <= 0) {
        res.render('auth/login.ejs', {
            inputData: inputData,
            usernameError: 'Username not found'
        });
        return;
    }
    user[0].isRightPassword(password)
        .then((isMatch) => { //nhan lai 1 bien boolean kiem tra password co dung khong
            if (isMatch) {
                if (user[0].active === true) {
                    req.session.user = user[0];
                    req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
                    res.redirect('/');
                } else {
                    res.render('auth/login.ejs', {
                        inputData: inputData,
                        activeError: "Your account hasn't actived. Please check your email"
                    });
                }
            } else {
                res.render('auth/login.ejs', {
                    inputData: inputData,
                    passwordError: 'Wrong password!'
                });
                return;
            }
        });
}

module.exports.postRegister = async function(req, res) {
    let inputUsername = req.body.registerUsername;
    let inputPassword = req.body.registerPassword;
    let inputFullname = req.body.registerFullname;
    let inputEmail = req.body.registerEmail;
    let inputData = {
        username: inputUsername,
        password: inputPassword,
        email: inputEmail,
        fullname: inputFullname
    }
    let user = await authModel.find({ username: inputUsername });
    if (user.length > 0) {
        res.render('auth/register.ejs', {
            usernameError: 'Username has been registered!',
            inputData: inputData
        });
        return;
    }
    if (inputPassword.length < 8) {
        res.render('auth/register.ejs', {
            passwordError: 'Password must be more than 8 character!',
            inputData: inputData
        });
        return;
    }
    let newUser = new authModel(inputData);
    let verifyUser = new verifyUserModel();
    let password = newUser.password;
    newUser.hashPassword()
        .then(() => {
            newUser.save();
            verifyUser.input(newUser._id)
            verifyUser.save();
            emailFunctions.sendMailVerify(newUser.email, verifyUser.hash, password, res);
            res.render('notify.ejs', {
                notify: "Please check your email to active your account"
            });
        })
        .catch((err) => {
            console.log(err);
        });
}

module.exports.postForgotPassword = async function(req, res) {
    let inputUsername = req.body.forgotUsername;
    let inputEmail = req.body.forgotEmail;
    let inputData = {
        username: inputUsername,
        email: inputEmail,
    }
    let forgotPasswordUser = await authModel.findOne({ username: inputUsername, email: inputEmail });
    if (forgotPasswordUser) {
        if (forgotPasswordUser.active == false) {
            res.render('notify.ejs', {
                notify: "Please check your mail to active your account and check your password!"
            });
            return;
        }
        let randomPassword = Math.random().toString(36).substring(5);
        forgotPasswordUser.forgotPassword(randomPassword)
            .then(() => {
                emailFunctions.sendMailForgotPassword(forgotPasswordUser.email, randomPassword, res);
                forgotPasswordUser.save();
                res.render('notify.ejs', {
                    notify: "Please check your mail to reset your password!"
                });
            })
            .catch((err) => {
                console.log(err);
            });

    } else {
        res.render('auth/forgot-password.ejs', {
            forgotPasswordError: "Username or Email not found",
            inputData: inputData
        });
    }
}