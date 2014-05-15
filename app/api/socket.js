module.exports = function(app){
	return {
		connection : function(){
			
		},
		on : {
			driverInit : function(params){
				var _self = this;
				app.get("ctr")("order").getOrders({}, function(err, data) {
					_self.socket.emit("getOrders", data)
				});
			},
			passengerInit : function(params) {
				var _self = this;
				app.get("ctr")("user").getFreeDrivers(params, function(err, drivers){
					!err && drivers && _self.socket.emit("getDrivers", drivers);
				})
			},
			disconnect : function(){
				this.session.userID && app.get("ctr")("user").setOffline(this.session.userID);
			},
			sendLocation : function(latlng){
				if(latlng) {
					if(this.session.userID) {
						userCtr.updateLocation(this.session.userID, latlng, function(err, drivers){
							err && console.log(err)
						})
					}
				}
			},
			updateUser : function(update) {
				app.get("ctr")("user").updateUser(this.session.userID, update, function(err){
					
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
							Eror: "An error has been occured while trip saving",
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