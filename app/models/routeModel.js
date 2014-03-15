var db = require("./../../db");
module.exports = db.getModel("route", {
    points : [{type : db.Types.ObjectId, ref : 'point'}],
    way : Number //meters
});