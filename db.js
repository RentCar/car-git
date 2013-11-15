var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
// Connect to the db 
	//Thanks, Cap
DB = {
    addr : 'localhost',
    port : '27017',
    name : 'test' 
}

mongoose.connect("mongodb://" + DB.addr + ":" + DB.port + "/" +DB.name);
var tripSchema =  new Schema ({
	from : {
		x : Number,
		y : Number,
		address : String
	},
	to : {
		x : Number,
		y : Number
	},
	driver : {
		name : String,
		avatar : String
	},
	passenger : {
		name : String,
		avatar : String
	}
});

var mongoConnect = function() {
	var db = null;
	return function(callback){
		if(!db){
			MongoClient.connect("mongodb://" + DB.addr + ":" + DB.port + "/" +DB.name, {}, function(err, thisdb){
				db = thisdb;
				callback(db)
			});
		} else callback(db);
	}
}()

exports.get = function(table, filter, callback) {
	var db = mongoConnect(function(db){
		db.collection(table).find(filter).toArray(callback);
	});	
}