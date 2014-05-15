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