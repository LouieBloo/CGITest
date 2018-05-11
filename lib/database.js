var mysql = require('mysql');
var config = require('../config');

var connection = mysql.createConnection({
	host : 'localhost',
	user : config.database.userName,
	password : config.database.password,
	database : config.database.name
});


connection.connect((err) =>{
	if(err)
	{
		console.log("Error connecting to db: " + err);
	}
	else{
		console.log("db conneced...");
	}
});


module.exports.db = connection;
