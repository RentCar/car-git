
module.exports = (function(){
	var UserModel = require("./../models/userModel"),
		ConfigModel = require("./../models/configModel"),
		passport = require("passport"),
		socketProvider;
	return {
		defineSocketProvider : function(provider) {
			socketProvider = provider;
		},		
		login : function(sn, req, res){
			var loginHelper = require("./../helpers/loginHelper");	
			loginHelper.socialLoginRedirect(sn, req, res);
		},
		loginCallback : function(req, res){
			var loginHelper = require("./../helpers/loginHelper");
			loginHelper.socialLoginCallback(req, res, function(err, profile){
				UserModel.findOrSave(profile, function(err, usr){
					req.session.userID = usr._id;
					socketProvider.socket(req.session.socketID).emit("login", usr);
					res.send("<script>close();</script>");
				})
			});
		},
		logout : function(req, callback) {
			if(!req.session.userID) {
				callback("you're not logged in");
				return;
			}		
			UserModel.logout(req.session.userID, function(err){
				if(err) {
					callback(err);
				}
				else {
					req.logout();
					callback(null);
				}
			});
		},
		updateLocation : function(id, latlng, callback) {
			UserModel.update({_id : id}, {currentLatlng : latlng}, callback);
		},
		get : function(id, callback) {
			UserModel.findOne({_id : id}, callback);
		}
	}
})();