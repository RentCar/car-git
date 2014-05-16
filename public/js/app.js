(function($window, $ember, $io) {


    /**
     * @module ES
     * @subModule Module
     */
    $window.EmberSockets = $ember.ObjectController.extend({

        /**
         * @constant NAMESPACE
         * @type {String}
         */
        NAMESPACE: 'sockets',

        /**
         * @property host
         * @type {String}
         * @default 'localhost'
         */
        host: 'localhost',
        
        /**
         * @property secure
         * @type {Bool}
         * @default false
         */
        secure: false,

        /**
         * @property port
         * @type {Number}
         * @default 80
         */
        port: 80,

        /**
         * List of controllers for which the events can be emitted to.
         *
         * @property controllers
         * @type {Array}
         * @default []
         */
        controllers: [],

        /**
         * @property socket {Object}
         * @type {Object|null}
         */
        socket: null,

        /**
         * Responsible for establishing a connect to the Socket.io server.
         *
         * @constructor
         */
        init: function init() {

            // Create the host:port string for connecting, and then attempt to establish
            // a connection.
            var host   = $ember.get(this, 'host'),
                port   = $ember.get(this, 'port'),
		scheme = $ember.get(this, 'secure') === true ? 'https' : 'http',
                path   = $ember.get(this, 'path') || '',
                options = $ember.get(this, 'options') || {},
                server = '%@://%@:%@/%@'.fmt(scheme, host, port, path),
                socket = $io.connect(server, options);

            socket.on('error', function socketError() {
                // Throw an exception if an error occurs.
                throw 'Unable to make a connection to the Socket.io server!';
            });

            // Store a reference to the socket.
            this.set('socket', socket);

            /**
             * @on connect
             */			
			//socket.on("getOrders", function(a){alert(2)});
            socket.on('connect', this._listen.bind(this));

        },

        /**
         * Responsible for emitting an event to the waiting Socket.io server.
         *
         * @method emit
         * @param eventName {String}
         * @param params {Array}
         * @return {void}
         */
        emit: function emit(eventName, params) {

            //jshint unused:false
            var args    = Array.prototype.slice.call(arguments),
                scope   = $ember.get(this, 'socket');

            scope.emit.apply(scope, args);

        },

        /**
         * Responsible for listening to events from Socket.io, and updating controller properties that
         * subscribe to those events.
         *
         * @method _listen
         * @return {void}
         * @private
         */
        _listen: function _listen() {

            var controllers     = $ember.get(this, 'controllers'),
                getController   = this._getController.bind(this),
                events          = [],
                forEach         = $ember.EnumerableUtils,
                module          = this,
                respond         = function respond() {
                    var eventData = Array.prototype.slice.call(arguments);
                    module._update.call(module, this, eventData);
                };
            forEach.forEach(controllers, function controllerIteration(controllerName) {

                // Fetch the controller if it's valid.
                var controller  = getController(controllerName),
                    eventNames  = controller[this.NAMESPACE];

                if (controller) {

                    // Invoke the `connect` method if it has been defined on this controller.
                    if (typeof controller[this.NAMESPACE] === 'object' && typeof controller[this.NAMESPACE].connect === 'function') {
                        controller[this.NAMESPACE].connect.apply(controller);
                    }

                    // Iterate over each event defined in the controller's `sockets` hash, so that we can
                    // keep an eye open for them.
                    for (var eventName in eventNames) {

                        if (eventNames.hasOwnProperty(eventName)) {

                            if (events.indexOf(eventName) !== -1) {
                                // Don't observe this event if we're already observing it.
                                continue;
                            }

                            // Push the event so we don't listen for it twice.
                            events.push(eventName);
                            
                            // Check to ensure the event was not previously registered due to a reconnect
                            if(!$ember.get(module, 'socket').$events[eventName]){
                                // ...And finally we can register the event to listen for it.
                                $ember.get(module, 'socket').on(eventName, respond.bind(eventName));
                            }

                        }

                    }

                }

            }, this);

        },

        /**
         * @method _update
         * @param eventName {String}
         * @param eventData {String|Number|Object}
         * @return {Number} Number of controllers which responded to the event.
         * @private
         */
        _update: function _update(eventName, eventData) {

            var controllers             = $ember.get(this, 'controllers'),
                respondingControllers   = 0,
                getController           = this._getController.bind(this),
                forEach                 =  $ember.EnumerableUtils.forEach;

            $ember.run(this, function() {

                // Iterate over each listener controller and emit the event we caught.
               forEach(controllers, function(controllerName) {

                    // Fetch the controller if it's valid.
                    var controller = getController(controllerName);

                    if (controller) {

                        // Attempt to find a match for the current event name.
                        var correspondingAction = controller[this.NAMESPACE][eventName];

                        if (!correspondingAction) {
                            // If we can't find it, then we can't go any further for this controller.
                            return;
                        }

                        if (typeof correspondingAction === 'function') {

                            // We need to invoke the function to respond to the event because the coder
                            // has specified a callback instead of a property to update.
                            correspondingAction.apply(controller, eventData);
                            respondingControllers++;
                            return;

                        }

                        // Determine if the property is specifying multiple properties to update.
                        if ($ember.isArray(correspondingAction)) {

                            forEach(correspondingAction, function propertyIteration(property, index) {

                                // Update each property included in the array of properties.
                                $ember.set(controller, property, eventData[index]);

                            });

                            respondingControllers++;
                            return;

                        }

                        // Otherwise it's a single property to update.
                        $ember.set(controller, correspondingAction, eventData);
                        respondingControllers++;

                    }

               }, this);

            });

            return respondingControllers;

        },

        /**
         * Responsible for retrieving a controller if it exists, and if it has defined a `events` hash.
         * 
         * @method _getController
         * @param name {String}
         * @return {Object|Boolean}
         * @private
         */
        _getController: function _getController(name) {

            // Format the `name` to match what the lookup container is expecting, and then
            // we'll locate the controller from the `container`.
            name = 'controller:%@'.fmt(name);
            var controller = this.container.lookup(name);

            if (!controller || (this.NAMESPACE in controller === false)) {
                // Don't do anything with this controller if it hasn't defined a `sockets` hash.
                return false;
            }

            return controller;

        }

    });

    /**
     * @onLoad Ember.Application
     * @param $app {Object}
     */
    $ember.onLoad('Ember.Application', function($app) {

        $app.initializer({

            /**
             * @property name
             * @type {String}
             * @default 'sockets'
             */
            name: 'sockets',

            /**
             * @method initialize
             * @param container {Object}
             * @param application {Object}
             * @return {void}
             */
            initialize: function(container, application) {

                if (typeof application.Socket === 'undefined') {

                    // Ensure the developer has defined `Socket` in their `Ember.Application`.
                    throw 'You have forgotten to add `EmberSockets` into `Ember.Application`! See: https://github.com/Wildhoney/EmberSockets#getting-started';

                }

                // Register `socket:main` with Ember.js.
                application.register('socket:main', application.Socket, {
                    singleton: true
                });

                // We then want to inject `socket` into each controller.
                application.inject('controller', 'socket', 'socket:main');

            }

        });
    });

})(window, window.Ember, window.io);

App = Ember.Application.create({

	Socket: EmberSockets.extend({
		host: 'destination.in.ua',
		port: 3000,
		controllers: ["user", "orders", "drivers"]
	})

});


App.IndexRoute = Ember.Route.extend({
    /*setupController  : function(controller, model) {
        socket.on("getOrders", function(data){
           controller.set("model", data);
		   console.log(controller.get("model"))
        });
    }*/
});

App.Router.map(function() {
  this.resource('passenger');
  this.resource('driver');
})


App.HeaderController = Ember.Controller.extend({
	
});

App.ApplicationController = Ember.Controller.extend({
	init : function(){
		this.transitionTo(this.user && this.user.isDriver ? "driver" : "passenger");
		this.loginMenuOpened = false;
	},
	actions : {
		loginDropDown : function(){
			this.toggleProperty("loginMenuOpened");
		},
		login : function(path){
			this.set("loginMenuOpened", false);
			window.open(location.origin+path, "login", "height=500,width=500");
		},
		switchRole : function(role){
			this.get("user").send("switchRole", role);
		}
	},
	needs: "user",
	user: Ember.computed.alias("controllers.user")
});

App.IndexController = Ember.Controller.extend({
});

App.UserController = Ember.ObjectController.extend({
	init : function() {	
	},
	sockets : {
		setUser : function(user) {
            this.set("model", user);
			var _self = this;
			
			this.addObserver("isFree", true,  function(e){
				_self.socket.emit("updateUser", {"isFree" : _self.content.isFree});
			});
			this.transitionTo(this.content.isDriver ? "driver" : "passenger");
		}
	},
	actions : {
		switchRole : function(role){
			this.socket.emit("updateUser", {isDriver : role=="driver"});
			this.transitionTo(role)
		},
		positionChanged : function(position) {
			this.socket.emit("sendLocation", position);
			this.set("latLng", position);
		},
		saveDriverRate : function(rate) {
			this.socket.emit("updateUser", {driverRate : rate});
			this.set("driverRate", rate);
		},
		getStartData : function(role) {
			role && this.socket.emit(role == "driver" ? "driverInit" : "passengerInit");
		}
	}
});

App.OrdersController = Ember.ArrayController.extend({
	init : function(){
			
	},
	sockets : {
		getOrders : function(orders){
			this.set("model", orders);
		}
	}
});

App.DriverController = Ember.Controller.extend({
	init : function(){
		this.get("user").send("getStartData", "driver");
		var _self = this;
		if (navigator.geolocation){
			navigator.geolocation.getCurrentPosition(function(position){
				_self.get("user").send("positionChanged", [position.coords.latitude, position.coords.longitude]);				
			});
		}
	},
	needs : ["orders", "user"],
	orders : Ember.computed.alias("controllers.orders"),
	user : Ember.computed.alias("controllers.user"),
	actions : {
		openSetRateDialog : function(){
			this.toggleProperty("setRateDialogIsOpen");
		},
		saveDriverRate : function(){		
			this.get("user").send("saveDriverRate", this.get("driverRate"));
			this.set("setRateDialogIsOpen", false);
		}
	}
});

App.PassengerController = Ember.Controller.extend({
	init : function(){
		this.get("user").send("getStartData", "passenger");
	},
	needs : ["user", "drivers"],
	user : Ember.computed.alias("controllers.user"),
	drivers : Ember.computed.alias("controllers.drivers"),
})

App.DriversController = Ember.ArrayController.extend({
	sockets : {
		getDrivers : function(drivers){
			this.set("model", drivers);
		}
	}
});