
/*
 * GET home page.
 */
var db = require('./../db');


function getTrips(type, filter, callback) {
	db.getTrips(type, filter, callback)
}
function loginUser(profile, callback){
    console.log("+++++++++++++++++++++++++++");
    db.saveUser({firstName : profile._json.first_name, lastName : profile._json.last_name}, function(err, data){
        console.log(err, data);
        callback(err, data)
    });
}
exports.index = function(req, res, type){
	getTrips(type, {}, function(err, data){
		res.render('index', {result : data, RequestedUserType : (type ? "passenger" : "driver")});
	});
};
exports.login = function(profile, callback){
    loginUser(profile, callback);
}
exports.saveTrip = function(req, res) {
	db.createTrip(1, {x: 34, y: 85}, {x: 50, y: 154}, 100, function(err, data){
		res.render('tripCreatedMessage', data);
	})
}
