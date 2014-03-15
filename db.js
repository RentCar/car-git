var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	DB = {
		addr : 'localhost',
		port : '27017',
		name : 'dest'
	}
mongoose.connect("mongodb://" + DB.addr + ":" + DB.port + "/" +DB.name);

exports.Types = Schema.Types;
exports.getModel = function(modelName, schemaObj, statics, methods){
    var schema = new Schema(schemaObj);
    for(var methodName in statics) {
        schema.statics[methodName] = statics[methodName];
    }
   // statics && (schema.statics = statics);
    methods && (schema.methods = methods);
    return mongoose.model(modelName, schema);
}
//models definitions
/*
var userModel = mongoose.model('user', new Schema({
		social : [{id: String, socialType : Number}],
		first_name : String,
		last_name : String,
		email : String,
		karma : {type : Number, default : 0},
		location : String,
		gender : Boolean,
		timezone : Number,
		photo : String,
		points : [{
			alias : String, 
			point:{type : Schema.Types.ObjectId, ref : 'point'}
		}],
		routes : [{
			alias : String,
			route : {type : Schema.Types.ObjectId, ref : 'route'}
		}],
		driverStatus : {type : Number, default: 0},  //0 - not drive, 1 - busy, 2 - free
		online : {type : Boolean, default : true},
		currentLatlng : [{type : Number}]
	})),
	pointModel = mongoose.model('point', (function() {
		var schema = new Schema({
			latlng : [{type : Number}],
			country : String,
			city : String,
			addresses : [String],
			lables: [String]
		});	
		schema.statics.findOrSave = function(points, callback){
			var i = 0,
				pointsResults = [],
				that = this;
			function addPoint(){
				that.collection.findAndModify({
					latlng : points[i].latlng
				}, [], {
					$addToSet : {
						addresses : { 
							$each: points[i].addresses
						}
					}
				}, {
					upsert: true, 
					new: true
				}, 
				function(err, point){
					if(err){
						callback(err);
						return;
					}
					pointsResults.push(point);
					i++;
					if(points[i]) {
						addPoint();
						return;
					}
					else {
						callback(null, pointsResults);
					}
				});
			}
			addPoint();
		}	
		return schema;
	})()),
	routeModel = mongoose.model('route', new Schema({
		points : [{type : Schema.Types.ObjectId, ref : 'point'}],
		way : Number //meters
	})),
	tripModel = mongoose.model('trip', (function() {
		var schema = new Schema ({
			date: {type: String, default: (new Date()).getTime()},
			route : {type : Schema.Types.ObjectId, ref : 'route'},
			users : [{type : Schema.Types.ObjectId, ref : 'user'}], //0 - driver, anyone else is passanger
			startPrice : Number,
			finalPrice : Number,
			status : {type: Number, default: 0}, // 0 - not started, 1 - in progress, 2 - completed
			responses : [{
				parrent : {type: Number, default: -1},
				user : {type : Schema.Types.ObjectId, ref : 'user'}, 
				price : Number, 
				message : String,
				route : {type : Schema.Types.ObjectId, ref : 'route'}
			}]
		});
		schema.methods.respond = function(response, callback) {
			this.responses = this.responses || [];
			this.responses.push(response);
			this.save(callback);
		}
		return schema
	})()),
	ScheduleModel = mongoose.model('schedule', new Schema({
		startDate : {type: String, default: (new Date()).getTime()},
		finishDate : String,
		weeklySchedule : {type : Number, defult : 127}, //Math.floor(WS / Math.pow(2, requestedDay)) % 2
		user : {role : Boolean, id : {type : Schema.Types.ObjectId, ref : 'user'}},
		route : {type : Schema.Types.ObjectId, ref : 'route'},
		time : [{type: Number}],
		trips : [{type : Schema.Types.ObjectId, ref : 'trip'}]
	}));
	
userModel.update({online: true}, {online: false}, {multi : true}, function(err, res) {
	console.log("-------------------------------");
	console.log(arguments);
});
exports.saveUser = function(userObj, callback) {
	var newUser = new userModel(userObj);
	newUser.save(callback); 
}

exports.setDriverStatus = function(user, status, latLng){
	userModel.update()
}

exports.createOrder = function(user, points, price, date, callback){
	if(!user) {
		callback("user is not authifacated");
		return false;
	}
	pointModel.findOrSave(points, function(err, points){
		if(err){
			callback(err); 
			return;
		}
		var newRoute = new routeModel({points:points});
		newRoute.save(function(err, route){
			if(err){
				callback(err); 
				return;
			}
			var newOrder = new tripModel({
				route : route,
				users : [null, user._id],
				startPrice : price,
				date : date
			});
			newOrder.save(callback);
		});
	})
}

exports.getOrders = function(filter, callback){
	tripModel.find(filter || {}).populate("users").populate("route").exec(function(err, data){
		routeModel.populate(data, {
			path: 'route.points',
			model: pointModel
		}, callback);
	})
}

exports.findOrSaveUser = function(profile, callback){
	userModel.findOne({"social.id" : profile.social[0].id}, function(err, data){
		if(err) {
			callback(err);
			return
		}
		if(data) {
			data.online = true;
			data.save();
			console.log(data);
			callback(null, data);
		}
		else{
			exports.saveUser(profile, callback);
		}
	})
}

exports.userLogout = function(id, callback) {
	if(!id){
		callback("first param is necessary");
		return;
	}
	userModel.update({_id: id}, {online : false}, function(err, res){
		callback(err);
	});
};

exports.updateUserLocation = function(id, latlng, callback) {
	userModel.update({_id : id}, {currentLatlng : latlng}, function(err){
		callback(err);
	});

	
}
*/