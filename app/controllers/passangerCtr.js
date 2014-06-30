module.exports={
	init : function(socket, session, pscope){
	console.log(pscope.get("nearToMeQuery")())
	//console.log(pscope.get);
		this.subscribe("newDriver", pscope.get("nearToMeQuery"), function(){
			console.log("sub newOrder")
		});
		//this.subscribe("removeOrder")
	},
	on : {
		updateFilter : function(filter) {
			
		},
		createOrder : function(orderObj) {
			
		}
	}
}