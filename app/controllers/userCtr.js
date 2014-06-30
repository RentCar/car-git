module.exports = {
	init : function(socket, session){
        var self = this;
		this.set("distance", 5000);		
		this.set("socket", socket).set("session", session);
		this.set("nearToMeQuery", function(){
			return {				
				lngLat : {
					$near : {
						$geometry: {
							type : "Point",
							coordinates : self.get("lngLtd") || [30,40]
						},
						$maxDistance : self.get("observedDistance") || 5000
					}
				}
			}
		});
		this.send("setRole", session && session.role || 1);		
		if(session.userID) {
			this.getModel("user").findOne({_id : session.userID}, function(err, profile) {
				profile.online = true;
				profile.save();
				self.set("profile", profile);
				!err && profile && self.socket.emit("setUser", profile);
			});
		}
		var loginSub = this.subscribe("login", function(){return {sessionID : self.session.id}}, function(profile){
			loginSub.off();
		});
	},
	on : {
		disconnect : function(){
			var profile = this.get("profile");
            if(profile) {
			    profile.online = false;
			    profile.save();
            }
		},
		setRole : function(role){
			this.send("setRole", role);
		},			
		setLocation : function(lngLat){
            console.log(lngLat);
			if(lngLat) {
				var profile = this.get("profile");
				if(profile) {
					profile.currentLngLat = {
						dateUpdate : (new Date()).getTime(),
						lngLat : lngLat
					};
					profile.save();
				}
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
					socket.emit("orderSaved", newOrder);
				}
			});
		}
	},
	actions : {
		setRole : function(role) {
            if(role) {
                this.set("role", role);
                this.set("roleCtr", this.runCtr((role == 2 ? "driver" : "passanger"), this));
            }
		}
	}
}