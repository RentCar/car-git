
/*module.exports = function(app){
	var UserModel = require("./../models/userModel"),
		ConfigModel = require("./../models/configModel"),
		passport = require("passport");
	return {	
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
						app.get("sockets").sockets.socket(req.session.socketID).emit("setUser", usr);
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
			//yell("newFreeDriver");
			UserModel.update({_id : id}, {currentLatlng : latlng}, callback);
		},
		get : function(id, callback) {
			UserModel.findOne({_id : id}, callback);
		},
		updateUser : function(session, keyVal, callback) {			
			UserModel.update({_id : session.userID}, keyVal, function(err, data){
				if(!err){
					if(keyVal && ("isDriver" in keyVal)){
						/*session.subscription = session.subscription || {};
						if(keyVal.isDriver == false) {		
							session.subscription.user = {
								isDriver : true
							}
							session.subscription.order && (delete session.subscription.order);
						} else {
							session.subscription.order = {
								
							}
						}
						session.save();
					}
				}
				callback(err, data)
			});
		},
		getFreeDrivers : function(filter, callback) {
			UserModel.findFreeDrivers(filter, callback);
		}
	}
};*/


module.exports = {
	init : function(socket, session){		
		this.set("distance", 5000);
		function near(lngLat, distance){
			return {
				$near : {
					$geometry : {
						type : "Point",
						coordinates : lngLat,
						$maxDistance : distance
					}
				}
			}
		}
		console.log("INIT");
		this.set("socket", socket).set("session", session);
		this.send("setRole", session && session.role);
			/*.watch("isDriver", function(value){
				session.isDriver = value;
				session.save();
				console.log(this)
				if(value === true) {
					this.subscribe("newOrer", function(){
						return {
							lgnLan : near(this.get("lgnlat"), this.get("distance"))
						}
					});
					this.unsubsribe(["newDriver", "DriverUpdate", "DriverRemove"]);					
					this.set("shownDriver", []);
					if(this.get("isFree")) {
						this.publish("newDriver", {profile : this.get("profile"), lgnLat : this.get("lgnLat"), rate : this.get("rate")})
					}
				}
				else {
					this.subscribe("newDriver", function(){
						return {lgnLan : near(this.get("lgnlat"), this.get("distance"))}
					}, function(driver){
						
					});				
				}
			}).set("isDriver", session.isDriver);*/
		var _self = this;	
		if(session.userID) {
			this.model.findOne({_id : session.userID}, function(err, profile) {
				!err && profile && _self.socket.emit("setUser", profile);
			});
		}
		this.subscribe("login", {sessionID : this.session.id}, function(profile){
			this.set("profile", profile);
			this.get("socket").emit("setUser", profile);
		});
	},
	on : {
		setRole : function(role){
			this.send("setRole", role);
		},			
		setLocation : function(lngLat){
			if(lngLat) {
				this.set("lgnLat");
				var roleCtr = this.get("roleCtr");
				roleCtr && roleCtr.send("setLocation");
			}
		},
		updateProfile : function(update) {
			//this.session.userID && app.get("ctr")("user").updateUser(this.session, update, function(err){
			//});
		},
		createOrder : function(data){
			if(!this.session.UserID) {
				socket.emit("orderSaved", {
					failed: true,
					reason: "you should be registred to create an order"
				});
				return false;
			}
			orderCtr.create(this.session.userID, data, function(err, order){
				if(err) {
					socket.emit("orderSaved", {
						failed: true,
						Error: "An error has been occured while trip saving",
						err: err
					});
				}
				else {
					var newOrder = {
						"_id" : order._id,
						route : {points:data.points},
						users : [null, this.session.userID],
						startPrice : data.price
					};
					//socket.broadcast.emit("newOrder", newOrder);
					socket.emit("orderSaved", newOrder);
				}
			});
		}
	},
	actions : {
		setRole : function(role) {
			this.set("role", role);
			this.set("roleCtr", this.runCtr(role == 1 ? "driver" : "passanger"));
		}
	}
}