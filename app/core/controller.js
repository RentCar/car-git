var pubSub = require("./../helpers/pubsub")({host : "localhost"});
function ctr(name, socket, session, pscope){
	var obj = require("./../controllers/"+name+"Ctr"),
		scope = {},
		wachers = {},
		subscriptions = {};	
		
	this.socket = socket;
	this.session = session;
	
	this.set = function(key, val) {		
		wachers[key] && wachers[key].apply(this, [scope[key], val]);
		scope[key] = val;
		return this;
	};
	
	this.get = function(key) {
		return scope[key];
	};
	this.model = function(name){
        return require("./../models/"+name+"Model");
    }
	var _self = this
	for (var event in obj.on) {				
		socket.on(event, (function(method){
			return function(data){
				obj.on[method].apply(_self, arguments);
			}
		})(event));
	};
	this.watch = function(key, handler){
		wachers[key] = handler;
		return this;
	}
	this.subscribe = function(event, filter, handler) {	
		return pubSub.subscribe(event, filter, handler);		
	};
	this.send = function(action, data){
		return obj.actions && obj.actions[action] && obj.actions[action].call(this, data);
	}
	
	obj.init && obj.init.apply(this,[socket,session, pscope])
}

ctr.prototype = {
    runCtr : function(name, pscope1){
        return new ctr(name, this.socket, this.session, pscope1)
    },
	getModel : function(name) {
		return require("./../models/"+name+"Model");
	}
}

module.exports = ctr;