const authModel = require('../models/auth.model');

module.exports.requireLogin = async function(req, res, next) {
    if (!req.session.user && !req.cookies.userSessionId)
        res.redirect('/auth/login');
    res.locals.user = req.session.user;
    next();
}

module.exports.notRequireLogin = function(req, res, next) {
    if (req.session.user && req.signedCookies.userSessionId)
        res.redirect('/');
    next();
}

module.exports.hasSessionNotFoundUser = function(req, res, next) {
    if (req.signedCookies.userSessionId && typeof req.session.user === 'undefined')
        res.clearCookie('userSessionId');
    next();
}