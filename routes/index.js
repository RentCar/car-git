/*
 * GET home page.
 */
var db = require("./../db");

exports.init = function(app, modules){
	/**
    * Angular templates
    */
	app.get('/userBlock', function(req, res) {
		res.render('partials/userBlock');
	})
	app.get('/driverForm', function(req, res) {
		res.render('partials/driverForm');
	})
    app.get('/passengerForm', function(req, res) {
		res.render('partials/passengerForm');
	})

	app.get('/sockets', function(req, res) {
		res.render('sockets-test')
	});
	app.get('/driver', function(req, res){
		db.getTrips(true, {}, function(err, data){
			res.render('index', {result : data, RequestedUserType : "passenger"});
		});
	});

	app.get('/', function(req, res){
		db.getTrips(false, {}, function(err, data){
			res.render('index', {
				result : data,
				RequestedUserType : "driver",
				title: 'Destination.to'
			});
		});
	});

    app.get('/login/fb', function(req, res){
		modules.social.login("facebook", req, res, ["email"]);
	});
    app.get('/login/fbcallback', function(req, res){
		modules.social.loginCallback("facebook", req, res);
	});
	
	app.get('/login/gp', function(req, res){
		modules.social.login("google", req, res, ["https://www.googleapis.com/auth/plus.login"])
	});
    app.get('/login/gpcallback', function(req, res){
		modules.social.loginCallback("google", req, res);
	});

	app.get('/login/linkedin', function(req, res){
		modules.social.login("linkedin", req, res, ['r_basicprofile', 'r_emailaddress'])
	});
    app.get('/login/linkedinCallback', function(req, res){
		modules.social.loginCallback("linkedin", req, res);
	});
	app.get('/login/vk', function(req, res){
		modules.social.login("vkontakte", req, res)
	});
    app.get('/login/vkCallback', function(req, res){
		modules.social.loginCallback("vkontakte", req, res);
	});
}
