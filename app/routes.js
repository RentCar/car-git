/*
 * GET home page.
 */
var User = require("./controllers/user");

module.exports = exports = function(app) {

    user = new User();
	/**
    * Angular templates
    */
	app.get('/', function(req, res) {
        res.render('index', {
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
	app.get("/login/:sn", function(req, res){
		user.login(req.params.sn, req, res)
	});
    app.get("/login/:sn/Callback", function(req, res){
        user.loginCallback(req.params.sn, req, res);
    });
	app.get("/logout", function(req, res){        //test route is to be removed when logout logic is moved to sockets
		user.logout(req, function(err){
			res.send(err || "I hope you are logged out");
		});
	});
}

