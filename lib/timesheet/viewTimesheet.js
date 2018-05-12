var timesheetQueries = require('./timesheetQueries');

var renderPageGet = function(req,res,next){

	timesheetQueries.fetchTimesheet(req.params.id)
	.then(function(timesheet){
		console.log(timesheet);
		res.render('./timesheet/viewTimesheet',{timesheet:timesheet});
	})
	.catch(function(error){
		console.log("error");
		console.log(error);
		res.send(error);
	});
}

module.exports = renderPageGet;
