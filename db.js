var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
DB = {
	addr : 'localhost',
	port : '27017',
	name : 'test'
}
mongoose.connect("mongodb://" + DB.addr + ":" + DB.port + "/" +DB.name);
var pointSchema = new Schema({
	x : Number,
	y : Number,
	country : String,
	city : String,
	address : String,
	comment : String
});
var point = mongoose.model('point', pointSchema);

function savePoint(data, callback){
	var newPoint = new point(data);
	newPoint.save(callback)
}

var userSchema = new Schema({
	social : [{id: String, socialType : Number}],
	first_name : String,
	last_name : String,
	email : String,
	avatar : String,
	karma : {type : Number, default : 0},
	location : String,
	gender : Boolean,
	timezone : Number,
	photo : String
});
var user = mongoose.model('user', userSchema);

var tripSchema =  new Schema ({
    date: { type: String, default: (new Date()).getTime() },
	points : [{type : Schema.Types.ObjectId, ref : 'point'}],
	driver : {type : Schema.Types.ObjectId, ref : 'user'},
	passenger : {type : Schema.Types.ObjectId, ref : 'user'},
	dPrice : Number,
	pPrice : Number
});
var trip = mongoose.model('trip', tripSchema);
function saveTrip(dId, pIp, fromId, toId, price, callback){
	var tripObj = {};
	tripObj.points = [fromId];
	if(toId) tripObj.points.push(toId);
	if(dId) {
		tripObj.driver = dId;
		tripObj.dPrice = price
	} 
	else {
		tripObj.passenger = pIp;
		tripObj.pPrice = price
	}
	newTrip = new trip(tripObj);
	newTrip.save(callback);
};

exports.get = function(table, filter, callback) {
	var db = mongoConnect(function(db){
		db.collection(table).find(filter).toArray(callback);
	});	
}

exports.saveUser = function(userObj, callback) {
	var newUser = new user(userObj);	
	newUser.save(callback); 
}

exports.createTrip = function(user, isDriver, from, to, price, callback){
	if(!user) {
		callback("user is not authifacated");
		return false;
	}
	savePoint(from, function(err, dataFrom){
		if(!err){
			savePoint(to, function(err, dataTo){
				if(!err){
					saveTrip((isDriver ? user._id : null), (!isDriver ? user._id : null), dataFrom._id, dataTo._id, price,
					function(err, trip){
						if(err){
							callback(err);
						}
						else {
							trip.from = dataFrom;
							trip.to = dataTo;
							trip[isDriver ? "driver" : "passenger"] = user;
							callback(null, trip)
						}
					});
				}
			})
		}
	})
}

exports.getTrips = function(isDriver, filter, callback){
	filter = filter || {};
	filter[isDriver ? "passenger" :"driver"] = {$exists : true};
	trip.find(filter).populate(isDriver ? "passenger" :"driver").populate("points").exec(callback);
}

exports.findOrSaveUser = function(profile, callback){
	user.findOne({"social.id" : profile.social[0].id}, function(err, data){
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
