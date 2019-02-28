var passport = require('passport');

exports.getLogin = function (req, res) {
	res.render('login');
}

exports.postLogin = passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
function (req, res) {
	res.redirect('/');
}