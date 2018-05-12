var loggedInWhiteList = [''];//have the index be whitelisted so people can log in

//checks if the user is logged in, if not redirect to index
var isLoggedIn = function(req, res, next){
	var parsedUrl = req.url.split('/');
	if(loggedInWhiteList.includes(parsedUrl[1]))
	{
		next();
	}
	else if(req.user)
	{
		next();
	}
	else{
		res.redirect('/');
	}
}


exports.isLoggedIn = isLoggedIn;
