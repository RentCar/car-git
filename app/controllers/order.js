var userModel = require("./../models/userModel"),
    orderModel = require("./../models/orderModel"),
    pointModel = require("./../models/pointModel"),
    routeModel = require("./../models/routeModel");

function Order() {

};

Order.prototype = {
    getOrders : function(filter, callback) {
        orderModel.find(filter || {}).populate("users").populate("route").exec(function(err, data){
            routeModel.populate(data, {
                path: 'route.points',
                model: pointModel
            }, callback);
        });
    },
    create : function(userID, points, price, date, callback) {
        console.log(arguments)
        if(!userID) {
            callback("user is not authifacated");
            return false;
        }
        pointModel.findOrSave(points, function(err, points){
            if(err){
                callback(err);
                return;
            }
            var newRoute = new routeModel({points:points});
            newRoute.save(function(err, route){
                if(err){
                    callback(err);
                    return;
                }
                var newOrder = new orderModel({
                    route : route,
                    users : [null, userID],
                    startPrice : price,
                    date : date
                });
                newOrder.save(callback);
            });
        })
    }
}

module.exports = Order;