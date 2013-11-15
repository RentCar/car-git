
/*
 * GET home page.
 */
var db = require('./../db');

function getTrips(type, filter, callback) {
	// type : boolean - if it's true we're looking for orders otherwise for offers
	filter[type ? "passenger" :"driver"] = {$exists : true};
	console.log(filter);
	db.get('trips', filter, callback);
}

exports.index = function(req, res, type){
	getTrips(type, {}, function(err, data){
		console.log(data);
		res.render('index', {result : data, RequestedUserType : (type ? "passenger" : "driver")});
	});
};
