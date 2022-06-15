var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('user');

passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
		},
		function (email, password, done) {
			User.findOne({ email: email })
				.then(function (user) {
					if (!user || !user.validPassword(password)) {
						return done(null, false, { errors: { type: 0, invalidCredentials: 'Invalid Email or Password' } });
					}
					let res = user.hasPermit(user.permit, user.isValid)
					if (res.permit === 1)
						return done(null, user);
					else
						return done(null, false, { errors: { type: res.permit, invalidCredentials: res.decs } });
				})
				.catch(done);
		}
	)
);
