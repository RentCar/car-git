
module.exports = function(dbConfig){
	var mongo = require('mongodb'),
		promise = require('promise'),
		server = new mongo.Server(dbConfig.host, 27017),
		db = new mongo.Db('pubsub', server),
		dbOpen = promise.denodeify(db.open).call(db),
		subscription = function (event, filter, handler, context) {
			this.event = event;
			this.handler = handler;
			this.filter = filter
			this.filter.query = filter();
			this.active = true;
			this.on();
		};

		subscription.prototype = {
			update : function(){
				this.filter.query = this.filter();
			},
			off : function() {
				this.cursor && (delete this.cursor);
				this.active = false;
			},
			on : function(){
				var self = this;
				dbOpen.then(function(err) {
					//if(err) throw err;
					db.collection(self.event, function(err, collection) {
						var latest = collection.find({}).sort({ $natural: -1 }).limit(1);
						latest.nextObject(function(err, doc) {
							if (err) throw err;
							if(!doc || !doc._id) {
								throw new Error("Collection "+self.event+" does not exist")
							}
							self.filter.query._id = { $gt: doc._id };
                            console.log(self.event)
                            console.log(JSON.stringify(self.filter.query));
							self.cursor = collection.find(self.filter.query, {
								tailable: true,
								awaitdata: true,
								numberOfRetries: -1
							}).sort({ $natural: 1 });
							(function next() {
								self.cursor.nextObject(function(err, message) {
									if (err) throw err;
									self.handler(message)
									next();
								});
							})();
						});
					})
				})
			}
		}
	return {
		subscribe : function(event, filter, handler, context){
			return new subscription(event, filter, handler, context);
		},
		publish : function(event, data) {
			dbOpen.then(function(err){
				if(err) throw err;
				db.collection(event, function(err, collection){
					collection.insert(data);
				})
			});
		},
		near : function(lngLat, distance){
			return {
				$near : {
					$geometry : {
						type : "Point",
						coordinates : lngLat,
						$maxDistance : distance
					}
				}
			}
		}
	}
}