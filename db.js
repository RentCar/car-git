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
	address : String,
	comment : String
});
var point = mongoose.model('point', pointSchema);

function savePoint(data, callback){
	var newPoint = new point(data);
	newPoint.save(callback)
}

var userSchema = new Schema({
	firstName : String,
	lastName : String,
	avatar : String,
	karma : {type : Number, default : 0}
});
var user = mongoose.model('user', userSchema);

var tripSchema =  new Schema ({
	from : {type : Schema.Types.ObjectId, ref : 'point'},
	to : {type : Schema.Types.ObjectId, ref : 'point'},
	driver : {type : Schema.Types.ObjectId, ref : 'user'},
	passenger : {type : Schema.Types.ObjectId, ref : 'user'},
	dPrice : Number,
	pPrice : Number
});
var trip = mongoose.model('trip', tripSchema);
function saveTrip(dId, pIp, fromId, toId, price, callback){	
	var tripObj = {};
	if(fromId) tripObj.from = fromId;
	if(toId) tripObj.to = toId;
	if(dId) {
		tripObj.driver = dId;
		tripObj.dPrice = price
	} 
	else {
		tripObj.passenger = dId;
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
	newUser = new user(userObj);
	newUser.save(callback); 
}

exports.createTrip = function(isDriver, from, to, price, callback){
	user.findOne({firstName : "John"}, function(err, dataUser){		
		savePoint(from, function(err, dataFrom){		
			if(!err){
				savePoint(to, function(err, dataTo){				
					if(!err){
						saveTrip((isDriver ? dataUser.id : null), (!isDriver ? dataUser.id : null), dataFrom._id, dataTo._id, price, 
						callback);
					}
				})
			}
		})
	})
}

exports.getTrips = function(isDriver, filter, callback){
	filter = filter || {};
	filter[isDriver ? "passenger" :"driver"] = {$exists : true};
	console.log(filter)
	trip.find(filter).populate(isDriver ? "passenger" :"driver").populate("from").populate("to").exec(callback);
}