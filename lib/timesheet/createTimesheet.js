var renderPageGet = function(req,res,next){
	res.render('./timesheet/createTimesheet');
}

var renderPagePost = function(req,res,next){
	
	if(req.body && req.body.dates && req.body.times){
		console.log(req.body);
		
	}
	else{
		//TODO add logic to rebuild page with past in post variables on validation errors
		renderPageGet(req,res,next);
	}
}

module.exports.get = renderPageGet;
module.exports.post = renderPagePost;
