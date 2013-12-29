var db = require("./db");
exports.init = function(server, sessionStore, cookieParser) {
	var io = require('socket.io').listen(server),
	SessionSockets = require('session.socket.io'),
	sessionSockets = new SessionSockets(io, sessionStore, cookieParser);
	
	sessionSockets.on('connection', function (err, socket, session) {
		socket.emit("newUser", { hello: socket.store.id});
		socket.on("driverForm", function(data){
			if(!session.passport) {
				socket.emit("tripSavingError", {reason:"you should be registred to create an offer"});
				return false;
			}
			var points = [];
			for(var key in data.points) {
				points.push({
					lat: data.points[key].geopoints.lat, 
					lng: data.points[key].geopoints.lng, 
					address: data.points[key].address
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
					console.log("aaaaaaaaaaaaaaaaaaaaaaaaaa");
					console.log(newtrip);
					if(err) {
						socket.emit("tripSavingError", {reason: "An error has been occured while trip saving", err: err});
					}
					else {
						socket.broadcast.emit("onNewOrder", newtrip);
						socket.emit("tripSaved", newtrip);
					}
				});
		})
	})
}