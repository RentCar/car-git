/*
 * GET home page.
 */
var user = require("./controllers/user"),
    Index = require("./controllers/index");

module.exports = exports = function(app) {

    var index = new Index();

    // Web App
	app.get('/', index.webRender);
	app.get("/login/:sn", function(req, res){
		user.login(req.params.sn, req, res)
	});
    app.get("/SocialLogin/Callback", user.loginCallback);
	app.get("/logout", function(req, res){        //test route is to be removed when logout logic is moved to sockets
		user.logout(req.session, function(err){
			res.send(err || "I hope you are logged out");
		});
	});
	app.get("/loginSuccess", function(req, res){
		user.get(req.session.userID, function(err, usr){
			res.send("<script>opener.App.IndexController.loginSuccess("+JSON.stringify(usr)+");close()</script>")
		})		
	})
    // API
    // TODO: API

    // Admin
    app.get('/admin', index.adminApp);
}

