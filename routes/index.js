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
	app.get('/', function(req, res){
		db.getOrders({}, function(err, data){
			res.render('index', {
				err: err,
				orders : data,
				user : req.session.passport && req.session.passport.user,
				title: 'Destination.to'
			});
		});
	});

    app.get('/login/fb', function(req, res){
		modules.social.login("facebook", req, res);
	});
    app.get('/login/fbcallback', function(req, res){
		modules.social.loginCallback("facebook", req, res);
	});
	
	app.get('/login/gp', function(req, res){
		modules.social.login("google", req, res)
	});
    app.get('/login/gpcallback', function(req, res){
		modules.social.loginCallback("google", req, res);
	});

	app.get('/login/linkedin', function(req, res){
		modules.social.login("linkedin", req, res)
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
	app.get("/login/:sn/:action?", function(req, res){
		modules.social["login"+(req.action || "")](req.params.sn, req, res)
	})
}
