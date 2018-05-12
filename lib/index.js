var database = require('./database');

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var bcrypt = require('bcrypt');

var addUser = require('./user/createUser');


//this is our local passport strategy. It will check if the given credentials are valid and log the user in
passport.use(new LocalStrategy(
	function(username, password, done) {

		database.db.query(`
			SELECT *
			FROM User
			WHERE Name=?`,
		[username],function(error,results,fields){
			if(error)
			{
				return done(null,false);
			}
			else if(results == null || results.length != 1)
			{
				return done(null,false);
			}
			else
			{
				bcrypt.hash(password,results[0].Salt,function(err,hash){
					if(err)
					{
						console.log("Error hashing login password!");
						return done(null,false);
					}
					else
					{
						if(results[0].Password == hash)
						{
							var user = {
								id:results[0].ID,
								name:results[0].Name,
							};
							return done(null,user);//goes to passport and sets the cookie
						}
						else{
							console.log("Error haasdfssword!");
							return done(null,false);
						}
					}
				});
			}
		});
 	}
));

passport.serializeUser(function(user, done) {
 	done(null, user);
});

passport.deserializeUser(function(id, done) {
  done(null,id);
});



var renderPageGet = function(req,res,next){
	var err = req.query.error == 1 ? "Invalid username or password" : "";
	res.render('./index',{error:err});
}

module.exports.get = renderPageGet;
