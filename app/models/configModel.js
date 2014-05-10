var db = require("./../../db");
module.exports = db.getModel("config", {
    socialNetworks : [{
		_id : String,
		enable : Boolean,
		clientID : String,
		clientSecret : String
	}]
}, {
	getSocialNetwork : function(id, callback) {
		this.findOne({"socialNetworks._id":id}, {"_id": 0}, function(err, data){
			callback(err, data && data.socialNetworks[0]);
		});
	} 
});