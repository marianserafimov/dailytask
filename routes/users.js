var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//Schemas || Models
var User = require('../models/user');

//Controllers
var loginController = require('../controllers/users/login');
var registerController = require('../controllers/users/register');
var logoutController = require('../controllers/users/logout');

//Get & Post => Login
router.get('/login', loginController.getLogin);
router.post('/login', loginController.postLogin);

//Get & Post => Register
router.get('/register', registerController.getRegister);
router.post('/register', registerController.postRegister);

//Get => Logout
router.get('/logout', logoutController.getLogout);

//Auth
passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

		User.comparePassword(password, user.password, function (err, isMatch) {
			if (err) throw err;
			if (isMatch) {
				return done(null, user);
			} else {
				return done(null, false, { message: 'Invalid password' });
			}
		});
	});
}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

module.exports = router;