var timesheetQueries = require('./timesheetQueries');

var renderPageGet = function(req,res,next){
	res.render('./timesheet/createTimesheet');
}

var renderPagePost = function(req,res,next){

	if(req.body && req.body.dates && req.body.times && req.body.rate){

		var timesheet = {};

		getVarInArrayForm(req.body.dates)//get dates in array
		.then(function(datesArr){
			timesheet.dates = datesArr;

			return getVarInArrayForm(req.body.times)//get times in array
		})
		.then(function(timesArr){
			timesheet.times = timesArr;
			timesheet.rate = parseInt(req.body.rate);
			timesheet.description = req.body.description;

			return timesheetQueries.createNewTimesheet(timesheet)//create the timesheet
		})
		.then(function(newTimesheetID){
			res.redirect('/timesheet/view/' + newTimesheetID);
		})
		.catch(function(error){
			renderPageGet(req,res,next);
		})

	}
	else{
		//TODO add logic to rebuild page with past in post variables on validation errors
		renderPageGet(req,res,next);
	}
}


//Since the form can pass in either an array of dates/times or a single date/time, this helper function gets them all
//in array form for easier manipulation
var getVarInArrayForm = function(input){
	return new Promise(function(resolve,reject){
		if(Array.isArray(input)){
			resolve(input);
		}
		else{
			var output = [input];
			resolve(output);
		}
	})
}

module.exports.get = renderPageGet;
module.exports.post = renderPagePost;
