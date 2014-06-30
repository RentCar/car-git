/*
 * GET home page.
 */
var Index = require("./controllers/index");

module.exports = exports = function(app) {

    var index = new Index();
	//	user = app.get("ctr")("user");

    // Web App
	app.get('/', index.webRender);
	app.get("/login/:sn", function(req, res){		
		var loginHelper = require("./helpers/loginHelper");	
			loginHelper.socialLoginRedirect(req.params.sn, req, res);
	});
    app.get("/SocialLogin/Callback", function(req, res){
		var loginHelper = require("./helpers/loginHelper"),
			UserModel = require("./models/userModel");
		loginHelper.socialLoginCallback(req, res, function(err, profile){
			console.log(arguments)		
			UserModel.findOrSave(profile, function(err, usr){
				if(err) {
					console.log(err);
				} else {
					req.session.userID = usr._id;
					//app.get("sockets").sockets.socket(req.session.socketID).emit("setUser", usr);
					res.send("<script>close();</script>");
				}
			})
		});
	});
	app.get("/logout", function(req, res){        //test route is to be removed when logout logic is moved to sockets
		//user.logout(req.session, function(err){
		//	res.send(err || "I hope you are logged out");
		//});
	});
	app.get("/loginSuccess", function(req, res){
	/*	user.get(req.session.userID, function(err, usr){
			res.send("<script>opener.App.IndexController.loginSuccess("+JSON.stringify(usr)+");close()</script>")
		})	*/	
	})
    // API
    // TODO: API

    // Admin
    app.get('/admin', index.adminApp);
}

