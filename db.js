var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
DB = {
	addr : 'localhost',
	port : '27017',
	name : 'test'
}
mongoose.connect("mongodb://" + DB.addr + ":" + DB.port + "/" +DB.name);

var userModel = mongoose.model('user', new Schema({    //models definition
		social : [{id: String, socialType : Number}],
		first_name : String,
		last_name : String,
		email : String,
		avatar : String,
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
		}]
	})),
	pointModel = mongoose.model('point', new Schema({
		lat : Number,
		lng : Number,
		country : String,
		city : String,
		address : String
	})),
	routeModel = mongoose.model('route', new Schema({
		points : [{type : Schema.Types.ObjectId, ref : 'point'}]
	})),
	tripModel = mongoose.model('trip', new Schema ({
		date: {type: String, default: (new Date()).getTime()},
		route : {type : Schema.Types.ObjectId, ref : 'route'},
		users : [{type : Schema.Types.ObjectId, ref : 'user'}], //0 - driver, anyone else is passanger
		startPrice : Number,
		finalPrice : Number,
		status : {type: Number, default: 0}, // 0 - not started, 1 - in progress, 2 - completed
		responses : [{
			user : {type : Schema.Types.ObjectId, ref : 'user'}, 
			price : Number, 
			message : String,
			route : {type : Schema.Types.ObjectId, ref : 'route'}
		}]
	})),
	ScheduleModel = mongoose.model('schedule', new Schema({
		startDate : {type: String, default: (new Date()).getTime()},
		finishDate : String,
		weeklySchedule : {type : Number, defult : 127}, //Math.floor(35 / Math.pow(2, 0)) % 2
		user : {role : Boolean, id : {type : Schema.Types.ObjectId, ref : 'user'}},
		route : {type : Schema.Types.ObjectId, ref : 'route'},
		time : Number,
		trips : [{type : Schema.Types.ObjectId, ref : 'trip'}]
	}));

exports.saveUser = function(userObj, callback) {
	var newUser = new userModel(userObj);
	newUser.save(callback); 
}

exports.createOrder = function(user, points, price, date, callback){
	if(!user) {
		callback("user is not authifacated");
		return false;
	}
	pointModel.create(points, function(err){
		if(err){
			callback(err); 
			return;
		}
		var newRoute = new routeModel({points:[arguments[1], arguments[2]]});
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
	filter = filter || {};
	tripModel.find(filter).populate("users").populate("route").exec(function(err, data){
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
			callback(null, data);
		}
		else{
			exports.saveUser(profile, callback);
		}
	})
}
