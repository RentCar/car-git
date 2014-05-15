
module.exports = function(app){
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
					if(err) {
						console.log(err);
					} else {
						req.session.userID = usr._id;
						socketProvider.socket(req.session.socketID).emit("setUser", usr);
						res.send("<script>close();</script>");
					}
				})
			});
		},
		setOffline : function(userID, callback) {
			UserModel.logout(userID, function(err){
				callback && callback(err || null);
			})
		},
		logout : function(session, callback) {
			if(!session.userID) {
				callback("you're not logged in");
				return;
			}		
			UserModel.logout(session.userID, function(err){
				if(err) {
					callback(err);
				}
				else {
					delete session.userID;
					callback(null);
				}
			});
		},
		updateLocation : function(id, latlng, callback) {
			UserModel.update({_id : id}, {currentLatlng : latlng}, callback);
		},
		get : function(id, callback) {
			UserModel.findOne({_id : id}, callback);
		},
		updateUser : function(id, keyVal, callback) {
			UserModel.update({_id : id}, keyVal, callback);
		},
		getFreeDrivers : function(filter, callback) {
			UserModel.findFreeDrivers(filter, callback);
		}
	}
};