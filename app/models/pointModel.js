var db = require("./../../db");
module.exports = db.getModel("point", {
    latlng : [{type : Number}],
    country : String,
    city : String,
    addresses : [String],
    lables: [String]
}, {
    findOrSave : function(points, callback){
        var i = 0,
            pointsResults = [],
            that = this;
        function addPoint(){
            that.collection.findAndModify({
                    latlng : points[i].latlng
                }, [], {
                    $addToSet : {
                        addresses : {
                            $each: points[i].addresses
                        }
                    }
                }, {
                    upsert: true,
                    new: true
                },
                function(err, point){
                    if(err){
                        callback(err);
                        return;
                    }
                    pointsResults.push(point);
                    i++;
                    if(points[i]) {
                        addPoint();
                        return;
                    }
                    else {
                        callback(null, pointsResults);
                    }
                });
        }
        addPoint();
    }
});