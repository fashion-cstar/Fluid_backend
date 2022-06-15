var http = require('http'),
	path = require('path'),
	methods = require('methods'),
	express = require('express'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	cors = require('cors'),
	passport = require('passport'),
	errorhandler = require('errorhandler'),
	dotenv = require('dotenv'),
	mongoose = require('mongoose');

var isProduction = process.env.NODE_ENV === 'production';
dotenv.config();
// Create global app object
var app = express();

app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());

app.use(session({ secret: 'fluid', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

if (!isProduction) {
	app.use(errorhandler());
}

if (isProduction) {
	mongoose.connect(process.env.MONGODB_URI);
} else {
	mongoose.connect('mongodb://localhost/fluid');
	mongoose.set('debug', true);
}

require('./models/user');
require('./models/userlog');
require('./models/apy');
require('./models/apylog');
require('./models/price');
require('./models/pricelog');
require('./models/vestingamount_log');
require('./models/vestingtype_log');
require('./config/passport');

app.use(require('./routes'));

/// catch 404 and forward to error handler
app.use((req, res, next) => {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
	app.use((err, req, res, next) => {
		console.log(err.stack);

		res.status(err.status || 500);

		res.json({
			errors: {
				message: err.message,
				error: err,
			},
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({
		errors: {
			message: err.message,
			error: {},
		},
	});
});

// finally, let's start our server...
var server = app.listen(process.env.PORT || 3001, () => {
	console.log('Listening on port ' + server.address().port);
});

module.exports = app;