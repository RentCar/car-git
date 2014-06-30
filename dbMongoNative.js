var MongoClient = require('mongodb').MongoClient,
	db;
	/*(DB = {
		addr : 'localhost',
		port : '27017',
		name : 'dest'
	}
	(*/
function connect (callback) {
	MongoClient.connnect('mongodb://127.0.0.1:27017/dest', function(err, res){
		db = res;
		callback(err, res)
	});
};

exports.getModel = function(modelName, schemaObj, statics, methods){
	var modelName =+ "s",
		collection = db && db.collection(modelName) || {};
	collection.__noSuchMethod__ = function(method, args){
		if(!db) {
			connect(function(err, res){
				res.collection(modelName)[methos].apply(res.collection, args);
			})
		}
		else {
			if(statics[method]) {
				statics[method].apply(collection, args);
			}
		}
	}
	return collection;
}