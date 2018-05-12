var express = require('express');
var router = express.Router();
var index = require('../lib/index');

var passport = require('passport');

/* GET home page. */
router.get('/', index.get);

router.post('/',passport.authenticate('local',{successRedirect:'/timesheet/viewAll',failureRedirect:'/?error=1'}));


module.exports = router;
