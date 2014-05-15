
module.exports = function(app){
	var userModel = require("./../models/userModel"),
		orderModel = require("./../models/orderModel"),
		pointModel = require("./../models/pointModel"),
		routeModel = require("./../models/routeModel");
		
	return {
		getOrders : function(filter, callback) {
			orderModel.find(filter || {}).populate("users").populate("route").sort({date: -1}).exec(function(err, data){
				routeModel.populate(data, {
					path: 'route.points',
					model: pointModel
				}, callback);
			});
		},
		create : function(userID, data, callback) {
			if(!userID) {
				callback("user is not authifacated");
				return false;
			}
			var points = [];
			for(var key in data.points) {
				points.push({
					latlng : [data.points[key].geopoints.lat, data.points[key].geopoints.lng],
					addresses: [data.points[key].address]
				});
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
						startPrice : data.price
					});
					newOrder.save(callback);
				});
			})
		}
	}
};