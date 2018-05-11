var express = require('express');
var router = express.Router();




router.get('/lineItem',function(req,res,next){
	res.render('./components/lineItem');
});


module.exports = router;
