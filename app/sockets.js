module.exports = function(app, server, sessionStore, cookieParser) {
	var io = require('socket.io').listen(server),
        sessionSockets = new (require('session.socket.io'))(io, sessionStore, cookieParser),
		//userCtr = app.get("ctr")("user"),
		Controller = require("./core/controller");
	//	orderCtr = app.get("ctr")("order"),
		//socketApi = require("./api/socket")(app);		
	app.set("sockets", io);
	var ds = require("dynamic-socket")(app.get("sockets"),{
		host : "localhost",
		port : "27017",
		db : "dest",
		collection : "socketData"
	});
	function getGeoReq(point) {
		return {
			$near : {
				$geometry : {
					type : "Point",
					coordinates : point,
					$maxDistance : 5000
				}
			}
		}
	}
	ds.setupRules({
		
		newDriver : function(sender){	
            return sender && sender.lngLat ? {
				isDriver : false,
                lngLat : getGeoReq(sender.lngLat)
            } : false;
        },
		newOrder : function(sender, params) {
			return params && params.lngLat ? {
				isDriver : true,
                lngLat : getGeoReq(params.lngLat)
            } : false;
		},
		removeDriver : function(sender, params) {
			return 
		}
	});

	sessionSockets.on('connection', function (err, socket, session) {
		err && console.log(err);
		session.socketID = socket.id;
		session.save();
		//var dsSocket= ds.getInstance(socket, session.id);
		/*session.userID && userCtr.get(session.userID, function(err, usr){
			!err && usr && socket.emit("setUser", usr);
			userCtr.updateUser(session, {online: true}, function(err){
			
			})
		});*/
		var appController = new Controller("app", socket, session);
		/*socketApi && socketApi.connection && socketApi.connection();
		for (var event in socketApi.on) {				
			socket.on(event, (function(method){
				return function(data){
					socketApi.on[method].apply({socket : socket, session : session, dsSocket : dsSocket}, arguments);
				}
			})(event));
		};*/
	})
}