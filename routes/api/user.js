var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('user');
var UserLog = mongoose.model('userlog');
var auth = require('../auth');
var nodemailer = require('nodemailer');
var secret = require('../../config').secret;
var jwt = require('jsonwebtoken');
var RequestIp = require('@supercharge/request-ip')
var email_template = require('../../config/email_template')

const sendEmail = (email, subject, htmlContent) => {
	const Transport = nodemailer.createTransport({
		host: 'email-smtp.us-east-2.amazonaws.com',
		port: 587,
		auth: {
			user: 'AKIAZCUUYEUASEEGJZW4',
			pass: 'BD2fhEkh+ZQaLqabbJjem0lvalvdWPi4Ac7cQQcTvNHI'
		}
	});

	var mailOptions;
	let sender = "portal.admin@fluid.finance"
	mailOptions = {
		from: sender,
		to: email,
		subject: subject,
		html: htmlContent
	};

	Transport.sendMail(mailOptions, function (error, response) {
		if (error) {
			console.log(error);
		} else {
			console.log("Verification Code sent");
		}
	});
}

function logUserAction(req, action, user) {
	var r = require('ua-parser').parse(req.headers['user-agent']);
	let ip = RequestIp.getClientIp(req);
	var geo = require('geoip-lite').lookup(ip);
	var location = geo ? geo.country ?? '' + ", " + geo.city ?? '' : "";
	var device = r.ua.toString() + ", " + r.os.toString()
	var userlog = new UserLog()
	userlog.ip = ip;
	userlog.user = user._id;
	userlog.actions = action;
	userlog.device = device;
	userlog.location = location;
	userlog.save();
	const now = new Date()
	let firstname = user.name.split(" ")[0];
	var htmlContent = email_template.getEventAlertContent(firstname, action, ip, device, location, now.toUTCString());
	var subject = "Detected a " + action;
	sendEmail(user.email, subject, htmlContent);
}

router.post('/signin', (req, res, next) => {
	if (!req.body.email) {
		return res.status(422).json({ errors: { message: 'Email is required', email: 'This field is required' } });
	}
	if (!req.body.password) {
		return res
			.status(422)
			.json({ errors: { message: 'Password is required', password: 'This field is required' } });
	}

	passport.authenticate('local', { session: false }, (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (user) {
			logUserAction(req, "login success", user);
			return res.status(200).json({ user: user.toJSON() });
		} else {
			logUserAction(req, "login failure", user);
			return res.status(401).json({
				errors: info.errors,
			});
		}
	})(req, res, next);
});

router.post('/changepassword', auth.required, async (req, res, next) => {
	if (!req.body.currentPassword) {
		return res.status(422).json({ errors: { message: 'Current Password is required', currentPassword: 'This field is required' } });
	}
	if (!req.body.newPassword) {
		return res
			.status(422)
			.json({ errors: { message: 'New Password is required', newPassword: 'This field is required' } });
	}

	let decoded;
	try {
		decoded = jwt.verify(req.headers.authorization.split(' ')[1], secret);
	} catch (e) {
		return res.status(401).send({ errors: { message: 'Unauthorized!' } });
	}
	User.findById(decoded.id)
		.then(result => {
			if (!result.validPassword(req.body.currentPassword)) {
				return res.status(422).json({ errors: { message: 'Current Password is wrong!', currentPassword: 'Current Password is wrong!' } });
			} else {
				result.setPassword(req.body.newPassword);
				result.save()
					.then(() => {
						logUserAction(req, "change password", result);
						return res.status(200).json({ action: 'success' });
					})
					.catch(next);
			}
		})
		.catch(next);
});

function sendReqVerifyEmail(user, token) {
	let link = `<a href=${process.env.APP_URL}/verify/${token}> ${process.env.APP_URL}/verify/${token} </a>`
	let firstname = user.name.split(" ")[0];
	var htmlContent = email_template.getReqVerifyContent(firstname, link);
	var subject = "Welcome to FLUID; please verify your email";
	sendEmail(user.email, subject, htmlContent);
}

router.post('/signup', (req, res, next) => {
	if (!req.body.email) {
		return res.status(422).json({ errors: { message: 'Email is required', email: 'This field is required' } });
	}
	if (!req.body.password) {
		return res
			.status(422)
			.json({ errors: { message: 'Password is required', password: 'This field is required' } });
	}
	if (!req.body.name) {
		return res.status(422).json({ errors: { message: 'Name is required', name: 'This field is required' } });
	}

	User.findOne({ email: req.body.email })
		.then(result => {
			if (result) {
				return res
					.status(409)
					.json({ errors: { message: 'Email is already taken', email: 'Email is already taken' } });
			}
			var user = new User();
			user.email = req.body.email;
			user.setPassword(req.body.password);
			user.permit = 2; //email sent
			user.name = req.body.name;
			var token;
			require('crypto').randomBytes(48, function (err, buffer) {
				token = buffer.toString('hex');
				user.isValid = false;
				user.uniqueCode = token;
				sendReqVerifyEmail(user, token);
				user.save()
					.then(() => {
						return res.status(200).json({ user: user.toUserJSON() });
					})
					.catch(next);
			});
		})
		.catch(next);
});

router.post('/resetpassword', auth.required, (req, res, next) => {

	User.findOne({ email: req.body.email })
		.then(result => {
			if (result) {
				result.setPassword(req.body.newPassword);
				result.forgotCode = '';
				result.save()
					.then(() => {
						logUserAction(req, "reset password", result);
						return res.status(200).json({ action: 'success' });
					})
					.catch(next);
			}
		})
		.catch(next);
});

router.post('/verify_forgot', (req, res, next) => {

	User.findOne({ forgotCode: req.body.forgotCode })
		.then(result => {
			if (result) {
				return res.status(200).json({ user: result.toJSON() });
			} else {
				return res
					.status(409)
					.json({ errors: { message: 'Invalid verification code', email: 'Invalid verification code' } });
			}
		})
		.catch(next);
});

router.post('/forgotpassword', (req, res, next) => {
	if (!req.body.email) {
		return res.status(422).json({ errors: { message: 'Email is required', email: 'This field is required' } });
	}

	User.findOne({ email: req.body.email })
		.then(result => {
			if (result) {
				require('crypto').randomBytes(48, function (err, buffer) {
					token = buffer.toString('hex');
					result.forgotCode = token;
					let link = `<a href=${process.env.APP_URL}/resetpassword/${token}> ${process.env.APP_URL}/resetpassword/${token} </a>`
					let firstname = result.name.split(" ")[0];
					var htmlContent = email_template.getResetContent(firstname, link);
					var subject = "Reset email";
					sendEmail(result.email, subject, htmlContent);
					result.save()
						.then(() => {
							return res.status(200).json({ action: 'success' });
						})
						.catch(next);
				});
			} else {
				return res.status(422).json({ errors: { message: 'Invalid email! Enter your registered email', email: 'Invalid email! Enter your registered email' } });
			}
		})
		.catch(next);
});

router.post('/resendverification', (req, res, next) => {
	require('crypto').randomBytes(48, function (err, buffer) {
		token = buffer.toString('hex');
		const filter = { email: req.body.email };
		const update = { uniqueCode: token };
		User.findOneAndUpdate(filter, update, {
			new: true
		}).then(result => {
			sendReqVerifyEmail(result, token);
			return res.status(200).json({ action: 'success' });
		}).catch(next);
	});
});

router.post('/verify', async (req, res, next) => {
	const user = await User.findOne({ uniqueCode: req.body.verifyCode });
	if (user) {
		user.isValid = true;
		user.permit = 3; //email verified but under approval
		user.uniqueCode = '';
		await user.save();
		let firstname = user.name.split(" ")[0];
		var htmlContent = email_template.getVerifiedContent(firstname);
		var subject = "Your email has been verified!";
		sendEmail(user.email, subject, htmlContent);
		return res.status(200).json({ action: 'success' });
	} else {
		return res.status(422).json({ errors: { message: 'Invalid verification code! User not found', verify: 'Invalid verification code! User not found' } });
	}

});

router.get('/user', auth.required, (req, res, next) => {
	let decoded;
	try {
		decoded = jwt.verify(req.headers.authorization.split(' ')[1], secret);
	} catch (e) {
		return res.status(401).send({ errors: { message: 'Unauthorized!', user: 'Unauthorized' } });
	}
	User.findById(decoded.id)
		.then(user => {
			if (!user) {
				return res.status(401).json({ errors: { message: 'Unauthroized', user: 'Unauthorized' } });
			}
			return res.status(200).json({ user: user.toUserJSON() });
		})
		.catch(next);
});

router.post('/userlist', auth.required, (req, res, next) => {
	User.find({}, function (err, users) {
		console.log(users)
		if (err) return res.status(401).json({ errors: { message: err } });
		return res.status(200).json({ userlist: users });
	})
});

router.post('/updatepermit', auth.required, async (req, res, next) => {
	const update = { permit: req.body.permit };
	let doc = await User.findByIdAndUpdate(req.body.id, update, {
		new: true
	});
	if (doc) {
		var htmlContent = `<p>Dear ${req.body.name}, Your account has been approved.</p>`
		let firstname = req.body.name.split(" ")[0];
		var htmlContent = email_template.getApprovalAccountContent(firstname);
		var subject = "Your FLUID account has been approved!";
		sendEmail(req.body.email, subject, htmlContent);
		res.status(200).json({ action: 'success' });
	} else {
		res.status(401).json({ errors: { message: 'Updating DB failed' } });
	}
});

module.exports = router;
