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
		console.log(session)
        orderCtr.getOrders({}, function(err, data) {
            socket.emit("getOrders", data)
        });
		socket.on("sendLocation", function(latlng) {
			if(latlng) {
				if(session.passport.user) {
                    userCtr.updateLocation(session.userID, latlng, function(err){
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
            orderCtr.create(session.passport.user.userID, data, function(err, order){
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
						users : [null, session.passport.user],
						startPrice : data.price
					};
					socket.broadcast.emit("newOrder", newOrder);
					console.log(order)
					socket.emit("orderSaved", newOrder);
				}
			});
		});
	})
}