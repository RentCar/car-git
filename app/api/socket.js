module.exports = function(app){
	return {
		connection : function(){
			
		},
		on : {
			driverInit : function(params){
				var _self = this;	
				app.get("ctr")("user").updateUser(this.session, {isDriver : true}, function(err){
					_self.dsSocket.send("newDriver", {}, "ATATATA");
				});
				app.get("ctr")("order").getOrders({}, function(err, data) {
					_self.socket.emit("getOrders", data)
				});
			},
			passengerInit : function(params) {
				var _self = this,
					usrCtr = app.get("ctr")("user");
					
				usrCtr.updateUser(this.session, {isDriver : false}, function(err){
					
				});
				usrCtr.getFreeDrivers(params, function(err, drivers){
					!err && drivers && _self.socket.emit("getDrivers", drivers);
				})
			},			
			sendLocation : function(lngLat){
				if(lngLat) {
				//	console.log(this)
					this.dsSocket.set({$set: {lngLat : lngLat}}, function(err, result){
						//console.log("location sent");
						//console.log(arguments);
					});
				}
			},
			updateUser : function(update) {
				this.session.userID && app.get("ctr")("user").updateUser(this.session, update, function(err){
				});
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
						socket.broadcast.emit("newOrder", newOrder);
						socket.emit("orderSaved", newOrder);
					}
				});
			}
		}	
	}
}