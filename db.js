var MongoClient = require('mongodb').MongoClient;
// Connect to the db 
	//Thanks, Cap
DB = {
    addr : 'localhost',
    port : '27017',
    name : 'test'
}

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
		console.log(table);
		db.collection(table).find(filter).toArray(callback);
	});	
}