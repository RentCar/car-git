var db = require("./../../db");
module.exports = db.getModel("order", {
    date: {type: String, default: (new Date()).getTime()},
    route : {type : db.Types.ObjectId, ref : 'route'},
    users : [{type : db.Types.ObjectId, ref : 'user'}], //0 - driver, anyone else is passanger
    startPrice : Number,
    finalPrice : Number,
    status : {type: Number, default: 0}, // 0 - not started, 1 - in progress, 2 - completed
    responses : [{
        parrent : {type: Number, default: -1},
        user : {type : db.Types.ObjectId, ref : 'user'},
        price : Number,
        message : String,
        route : {type : db.Types.ObjectId, ref : 'route'}
    }]
});