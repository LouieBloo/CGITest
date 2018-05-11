var express = require('express');
var router = express.Router();


var createTimesheet = require('../lib/timesheet/createTimesheet');
var viewAllTimesheets = require('../lib/timesheet/viewAllTimesheets');
var viewTimesheet = require('../lib/timesheet/viewTimesheet');

//Create timesheets
router.get('/create',createTimesheet.get);
router.post('/create',createTimesheet.post);

//View timesheets
router.get('/viewAll',viewAllTimesheets.get);
router.get('/view/:id',viewTimesheet);

module.exports = router;

