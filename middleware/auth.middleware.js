module.exports.requireLogin = async function(req, res, next) {
    if (!req.session.user && !req.cookies.userSessionId) {
        res.render('notify.ejs', {
            notify: 'you must login to use this fearture!'
        })
        return;
    }
    next();
}

module.exports.Loginned = function(req, res, next) {
    if (req.session.user && req.signedCookies.userSessionId)
        res.redirect('/');
    next();
}

module.exports.hasSessionNotFoundUser = function(req, res, next) {
    if (req.signedCookies.userSessionId && typeof req.session.user === 'undefined')
        res.clearCookie('userSessionId');
    next();
}