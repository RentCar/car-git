var db = require("./../../dbMongoose");
module.exports = db.getModel("route", {
    points : [{type : db.Types.ObjectId, ref : 'point'}],
    way : Number //meters
});