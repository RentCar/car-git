/*
 * GET home page.
 */
var User = require("./controllers/user"),
    Index = require("./controllers/index");

module.exports = exports = function(app) {

    var user = new User(),
        index = new Index();
	/**
    * Angular templates
    */
	app.get('/', index.webRender);
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

