var express = require('express');
var router = express.Router();


var createTimesheet = require('../lib/timesheet/createTimesheet');


//main home page route
router.get('/create',createTimesheet.get);
router.post('/create',createTimesheet.post);


module.exports = router;

