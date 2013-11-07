l = console.log

getUser = function(db, name, callback) {
    var users = db.collection("users")
    return users.find({name : name}).toArray(callback);
}

var MongoClient = require('mongodb').MongoClient;
// Connect to the db
DB = {
    addr : 'localhost',
    port : '27017',
    name : 'test'
}

MongoClient.connect("mongodb://" + DB.addr + ":" + DB.port + "/" +DB.name, {}, conn);

function conn(err, db) {
    if (!err) {
        console.log("We are connected");
        l(getUser(db, "test", function (a, b) {
            l(b)
        }));
    } else {
        console.log("Beda")
    }
}


exports.get = function() {
    return {a:1}
}