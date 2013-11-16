
/*
 * GET home page.
 */
var db = require('./../db');

function getTrips(type, filter, callback) {
	// type : boolean - if it's true we're looking for orders otherwise for offers
	//filter[type ? "passenger" :"driver"] = {$exists : true};
	console.log(filter);
	db.getTrips(type, filter, callback)
	//db.get('trips', filter, callback);
}

exports.index = function(req, res, type){
	getTrips(type, {}, function(err, data){
		console.log(data);
		res.render('index', {result : data, RequestedUserType : (type ? "passenger" : "driver")});
	});
};
exports.login = function(req, res){
	db.saveUser({firstName : "Mickey",lastName : "Mouse"}, function(err, data){
		res.render('customer', data);
	});
}
exports.saveTrip = function(req, res) {
	db.createTrip(1, {x: 34, y: 85}, {x: 50, y: 154}, 100, function(err, data){
		console.log(data);
		res.render('tripCreatedMessage', data);
	})
}
