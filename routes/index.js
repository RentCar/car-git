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
		console.log(req.session)
		db.getOrders({}, function(err, data){
			res.render('index', {
				err: err,
				orders : data,
				user : req.session.passport && req.session.passport.user,
				title: 'Destination.to',
				header: {
					socialLogin : { 
						facebook : {
							enable : true,
							name: req.i18n.__("facebook")
						}, 
						vkontakte : {
							enable : true,
							name: req.i18n.__("vk")
						},
						linkedin : {
							enable : true,
							name: req.i18n.__("linkedin")
						},
						google : {
							enable : false,
							name: req.i18n.__("google")
						}
					}
				}
			});
		});
	});

	app.get("/login/:sn/:action?", function(req, res){
		modules.social["login"+(req.params.action || "")](req.params.sn, req, res)
	})
	app.get("/logout", function(req, res){        //test route is to be removed when logout logic is moved to sockets
		social.logout(req, function(err){
			res.send(err || "I hope you are logged out");
		});
	})

//    app.get("*", function(req, res) {
//        res.render('partials/404', {
//            data: JSON.stringify(req.params)
//        });
//    });
}
