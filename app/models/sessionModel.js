var db = require("./../../dbMongoose");
//console.log(db);
module.exports = db.getModel("session", {}, {
	setSubscription : function()
});