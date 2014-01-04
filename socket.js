var db = require("./db");
exports.init = function(server, sessionStore, cookieParser) {
	var io = require('socket.io').listen(server),
	SessionSockets = require('session.socket.io'),
	sessionSockets = new SessionSockets(io, sessionStore, cookieParser);
	
	sessionSockets.on('connection', function (err, socket, session) {
		socket.emit("newUser", { hello: socket.store.id});
		db.getOrders({}, function(err, orders){
			socket.emit("getOrders", orders);
		});
		socket.on("driverForm", function(data){
			if(!session.passport) {
				socket.emit("tripSavingError", {reason:"you should be registred to create an offer"});
				return false;
			}
			var points = [];
			for(var key in data.points) {
				points.push({
					latlng : {
						lat: data.points[key].geopoints.lat, 
						lng: data.points[key].geopoints.lng
					}, 
					addresses: [data.points[key].address]
				});
			}			
			db.createOrder(session.passport.user, points, data.price, (new Date()).getTime(), 
				function(err, trip){
					var newtrip = {
						"_id" : trip._id,
						route : {points:points},
						users : [null, session.passport.user],
                        startPrice : data.price
                    };
					if(err) {
						socket.emit("tripSavingError", {reason: "An error has been occured while trip saving", err: err});
					}
					else {
						socket.broadcast.emit("newOrder", newtrip);
						socket.emit("SavedOrder", newtrip);
					}
				});
		})
	})
}