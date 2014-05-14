var Order = require("./controllers/order"),
    userCtr = require("./controllers/user"),
	orderCtr = new Order();
	
module.exports = function(app, server, sessionStore, cookieParser) {
	var io = require('socket.io').listen(server),
        SessionSockets = require('session.socket.io'),
        sessionSockets = new SessionSockets(io, sessionStore, cookieParser);	
	userCtr.defineSocketProvider(io.sockets);
	
	sessionSockets.on('connection', function (err, socket, session) {
		session.socketID = socket.id;
		session.save();
		session.userID && userCtr.get(session.userID, function(err, usr){
			!err && usr && socket.emit("setUser", usr);
			userCtr.updateUser(session.userID, {online: true}, function(err){
				console.log(arguments);
			})
		});
		
		socket.on("driverInit", function() {
			orderCtr.getOrders({}, function(err, data) {
				socket.emit("getOrders", data)
			});
		});  
		socket.on("passengerInit", function(params){
			userCtr.getFreeDrivers(params, function(err, drivers){
				!err && drivers && socket.emit("getDrivers", drivers);
			})
		});
		socket.on("disconnect", function(){
			session.userID && userCtr.setOffline(session.userID);
		});
		socket.on("sendLocation", function(latlng) {
			console.log(latlng);
			if(latlng) {
				if(session.userID) {
                    userCtr.updateLocation(session.userID, latlng, function(err, drivers){
						console.log(arguments);
						err && (console.log(err))
					})
				}
			}
		});
		socket.on("updateUser", function(update){
			userCtr.updateUser(session.userID, update, function(err){
				console.log(arguments);
			})
		})
		socket.on("createOrder", function(data){
			if(!session.passport) {
				socket.emit("orderSaved", {
                    failed: true,
                    reason: "you should be registred to create an order"
                });
				return false;
			}
            orderCtr.create(session.userID, data, function(err, order){
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
						users : [null, session.userID],
						startPrice : data.price
					};
					socket.broadcast.emit("newOrder", newOrder);
					socket.emit("orderSaved", newOrder);
				}
			});
		});
	})
}