module.exports={
	init : function(socket, session){
		this.sub("newOrder", near, function(){
			console.log("sub newOrder")
		});
		this.sub("removeOrder")
	},
	on : {
		setRate : function(rate) {
			
		},
		setStatus : function(status) {
			
		}
	}
}