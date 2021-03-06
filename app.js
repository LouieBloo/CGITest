var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var session = require('express-session');
var mySqlSessionStore = require('express-mysql-session')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var timesheetRouter = require('./routes/timesheet');
var componentsRouter = require('./routes/components');

var database = require('./lib/database');
var auth = require('./lib/authentication');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//mysql session setup
const cookieOptions = {
    checkExpirationInterval: 1000 * 60 * 15,// 15 min // How frequently expired sessions will be cleared; milliseconds.
    expiration: 1000 * 60 * 60 * 24,// 1 week // The maximum age of a valid session; milliseconds.
    createDatabaseTable: true,// Whether or not to create the sessions database table, if one does not already exist.
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};
const sessionStore = new mySqlSessionStore(cookieOptions,database.db);

//session setup with mysql store
app.use(session({
	secret: 'popsicle',
	store:sessionStore,
	saveUninitialized:false,
	resave:false
}));

//passport
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/timesheet', [auth.isLoggedIn,timesheetRouter]);
app.use('/components',componentsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
