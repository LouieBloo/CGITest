var queries = require('./timesheetQueries');

var renderPageGet = function(req,res,next){

	queries.fetchAllTimesheets()
	.then(function(result){
		res.render('./timesheet/viewAllTimesheets',{timeSheets:result});
	})
	.catch(function(error){
		console.log("Error" + error);
		res.redirect('./index');
	});

}


module.exports.get = renderPageGet;
