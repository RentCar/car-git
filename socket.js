var Order = require("./app/controllers/order"),
    User = require("./app/controllers/order"),
    orderCtr = new Order(),
    userCtr = new User();
exports.init = function(server, sessionStore, cookieParser) {
	var io = require('socket.io').listen(server),
	SessionSockets = require('session.socket.io'),
	sessionSockets = new SessionSockets(io, sessionStore, cookieParser);
	
	sessionSockets.on('connection', function (err, socket, session) {
        orderCtr.getOrders({}, function(err, data) {
            socket.emit("getOrders", data)
        });
		socket.on("sendLocation", function(latlng) {
			if(latlng) {
				if(session.passport.user) {
                    userCtr.updateLocation(session.passport.user._id, latlng, function(err){
						err && (console.log(err))
					})
				}
			}
		});
		socket.on("createOrder", function(data){
			if(!session.passport) {
				socket.emit("orderSaved", {
                    failed: true,
                    reason: "you should be registred to create an order"
                });
				return false;
			}
			var points = [];
			for(var key in data.points) {
				points.push({
					latlng : [data.points[key].geopoints.lat, data.points[key].geopoints.lng], 
					addresses: [data.points[key].address]
				});
			}
            orderCtr.create(session.passport.user.userID, points, data.price, (new Date()).getTime(),
				function(err, trip){
					if(err) {
						socket.emit("orderSaved", {
                            failed: true,
                            Eror: "An error has been occured while trip saving",
                            err: err
                        });
					}
					else {
						var newtrip = {
							"_id" : trip._id,
							route : {points:points},
							users : [null, session.passport.user],
							startPrice : data.price
						};
						socket.broadcast.emit("newOrder", newtrip);
						socket.emit("orderSaved", newtrip);
					}
				});
		});
	})
}