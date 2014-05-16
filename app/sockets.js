module.exports = function(app, server, sessionStore, cookieParser) {
	var io = require('socket.io').listen(server),
        sessionSockets = new (require('session.socket.io'))(io, sessionStore, cookieParser),
		userCtr = app.get("ctr")("user"),
		orderCtr = app.get("ctr")("order"),
		socketApi = require("./api/socket")(app);
		
	app.set("sockets", io.sockets);
	sessionSockets.on('connection', function (err, socket, session) {
		session.socketID = socket.id;
		session.save();
		session.userID && userCtr.get(session.userID, function(err, usr){
			!err && usr && socket.emit("setUser", usr);
			userCtr.updateUser(session.userID, {online: true}, function(err){
				console.log(arguments);
			})
		});
		socketApi && socketApi.connection && socketApi.connection();
		for (var event in socketApi.on) {				
			socket.on(event, (function(method){
				return function(data){
					socketApi.on[method].apply({socket : socket, session : session}, arguments);
				}
			})(event));
		};
	})
}