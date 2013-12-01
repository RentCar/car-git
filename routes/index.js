/*
 * GET home page.
 */
var db = require("./../db");

exports.init = function(app, modules){

    /**
     * Angular tests
     */
    app.get('/userBlock', function(req, res) {
        res.render('partials/userBlock');
    })
    app.get('/driverForm', function(req, res) {
        res.render('partials/driverForm');
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
        db.getTrips(0, {}, function(err, trips){
			console.log(trips)
		})
        db.getTrips(false, {}, function(err, data){
            res.render('index', {
                result : data,
                RequestedUserType : "driver",
                title: 'Destination.to'
            });
        });
    });

    app.get('/login', function(profile, callback){
        db.saveUser({firstName : profile.first_name, lastName : profile.last_name}, function(err, data){
            callback(err, data)
        })
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

    app.get('/createOffer', function(req, res) {
        db.createTrip(req.user, 1, {x: 34, y: 85}, {x: 50, y: 154}, 100, function(err, data){
            console.log(err);
            res.render('tripCreatedMessage', data);
        })
    });
}
