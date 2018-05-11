var database = require('../database');


var fetchAllTimesheets = function(){
	return new Promise(function(resolve,reject){
		database.db.query(`SELECT * FROM Timesheets`,function(error,results,fields){
			if(!error){
				resolve(results);
			}
			else{
				reject(error);
			}
		});
	})
}

var fetchTimesheet = function(timesheetID){

	var returnObject = {};

	return new Promise(function(resolve,reject){
		database.db.query(`
			SELECT *
			FROM Timesheets
			WHERE ID = ?`,
		[timesheetID],
		function(error,results){
			if(!error && results.length > 0){
				returnObject.sheetInfo = results[0];
				resolve();
			}
			else{
				reject(error);
			}
		})
	})
	.then(function(){
		return new Promise(function(resolve,reject){
			database.db.query(`
				SELECT *
				FROM LineItems
				WHERE TimesheetID = ?`,
			[timesheetID],
			function(error,results){
				if(!error && results.length > 0){
					returnObject.lineItems = results;
					resolve(returnObject);
				}
				else{
					reject(error);
				}
			})
		})
	})
}

var createNewTimesheet = function(timesheetInput){

	var totalCost = 0;
	var totalMins = 0;
	var description = timesheetInput.description ? timesheetInput.description : null;
	var newTimesheetID = 0;

	return new Promise(function(resolve,reject){
		timesheetInput.times.forEach(function(element){//calculate total cost and mins of timesheet to store in db
			var time = parseInt(element);
			totalMins += time;
			totalCost += time * timesheetInput.rate;
		});

		resolve();
	}).
	then(function(){//insert a new timesheet in the DB
		return new Promise(function(resolve,reject){
			database.db.query(`
				INSERT INTO Timesheets
				(Rate,Description,TotalTime,TotalCost) 
				VALUES(?,?,?,?)`,
			[timesheetInput.rate,description,totalMins,totalCost],
			function(error,results,fields){
				if(!error){
					newTimesheetID = results.insertId;
					resolve();
				}
				else{
					reject(error);
				}
			});
		})
	}).
	then(function(){//finally insert all line items into the db
		return new Promise(function(resolve,reject){
			var counter = 0;
			for(var x = 0;x < timesheetInput.dates.length;x++){
				createNewLineItem(timesheetInput.times[x],timesheetInput.dates[x],newTimesheetID)
				.then(function(){
					//when looping over functions that can hit the db, make sure we only resolve when they all come back
					counter++;
					if(counter >= timesheetInput.dates.length){
						resolve(newTimesheetID);
					}
				})
				.catch(function(error){
					reject(error);
				})
			}
		})
	})
}


var createNewLineItem = function(time,date,timesheetID){
	return new Promise(function(resolve,reject){
		database.db.query(`
			INSERT INTO LineItems
			(Time,Date,TimesheetID)
			VALUES(?,?,?)`,
		[time,date,timesheetID],
		function(error,results){
			if(!error){
				resolve();
			}
			else{
				reject(error);
			}
		})
	})
}

module.exports.fetchAllTimesheets = fetchAllTimesheets;
module.exports.fetchTimesheet = fetchTimesheet;
module.exports.createNewTimesheet = createNewTimesheet;
