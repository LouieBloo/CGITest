var database = require('../database');
var bcrypt = require('bcrypt');

//create new user in database.
var createNewUser = function(userName,password){
	return new Promise(function(resolve,reject){

		bcrypt.genSalt(10,function(err,salt){
			bcrypt.hash(password,salt,function(err,hash){
				database.db.query(`
					INSERT INTO User
					(Name,Salt,Password)
					VALUES(?,?,?)`,
				[userName,salt,hash],
				function(err,results){
					resolve();
				})
			})
		})

	})
}

module.exports = createNewUser;
