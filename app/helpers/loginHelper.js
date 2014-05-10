module.exports = (function(){
	var configModel = require("./../models/configModel"),
		getSocialLoginURL = function(snConfig) {
			var url;
			switch(snConfig._id) {
				case "facebook" : 
					url = "https://www.facebook.com/dialog/oauth?response_type=code&redirect_uri="+encodeURIComponent(CONFIG.domain+":"+CONFIG.appPort+"/SocialLogin/Callback")+"&display=popup&scope=email&client_id="+snConfig.clientID;
				break;
			}
			return url;
		};
	
	return {
		socialLoginRedirect : function(sn, req, res) {
			configModel.getSocialNetwork(sn, function(err, snConfig){
				if(err) {
					console.log(err)
					res.send("shit happens");
				} else {
					req.session.snName = snConfig._id;
					res.redirect(getSocialLoginURL(snConfig))
				}
			});
		},
		socialLoginCallback : function(req, res, callback) {
			var https = require('https');
			configModel.getSocialNetwork(req.session.snName, function(err, snConfig){
				if(err) {
					console.log(err)
					res.send("shit happens");
				} else {
					switch(snConfig._id) {
						case "facebook" : 
							var fbReq = https.get({
									host : "graph.facebook.com",
									path : "/oauth/access_token?client_id="+snConfig.clientID+
									"&redirect_uri="+encodeURIComponent(CONFIG.domain+":"+CONFIG.appPort+"/SocialLogin/Callback")+
									"&client_secret="+snConfig.clientSecret+
									"&code="+req.query.code,
									method: "GET"
								}, function(fbResp) {
									var str = "";
									fbResp.on('data', function (chunk) {
										str += chunk;
									});
									fbResp.on('end', function () {
										var accessToken = str.match(/access_token=(\S+)?\&/),
											accessToken = accessToken && accessToken[1];
										if(accessToken) {										
											req.session.accessToken = accessToken;											
											var fbProfileReq = https.get({
												host: "graph.facebook.com",
												path: "/me/?access_token="+accessToken
											}, function(fbProfileRes){
												var str = "";
												fbProfileRes.on('data', function (chunk) {
													str += chunk;
												});
												fbProfileRes.on("end", function(){
													try{
														var profile = JSON.parse(str);
															profile.social = [{
																id : profile.id,
																socialType : snConfig._id
															}]
														callback(null, profile);
													} catch(e) {
														//to e processed
													}
												})
											})
											fbProfileReq.on('error', function(e)	{
											  console.log('ERROR: ' + e.message);
											});
										}
									});							
								});
							fbReq.on('error', function(e)	{
							  console.log('ERROR: ' + e.message);
							});
						break;
					}
				}
			})						
		}
	}
})()