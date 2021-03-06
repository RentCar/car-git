var passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy, 
	GoogleStrategy = require('passport-google').Strategy,
	LinkedInStrategy = require('passport-linkedin').Strategy,
	VKontakteStrategy = require('passport-vkontakte').Strategy;
//var pgModel = require('./pgModel');
var db = require('./db');

var CONSTANTS = {
	FACEBOOK : 1,
	GOOGLE : 2,
	LINKEDIN : 3,
	VK : 4
}
passport.use(new FacebookStrategy({
		clientID: "543776059050441",
		clientSecret: "c561992ef2ab4c9b3e0c8d8ea03a9ef4",
		callbackURL: "http://94.244.155.77:"+CONFIG.appPort+"/login/fbcallback"
	},
	function(accessToken, refreshToken, profile, done) {
		var user = profile._json;
		user.social = [{
			id : profile.id,
			socialType : CONSTANTS.FACEBOOK			
		}];
		db.findOrSaveUser(user, function(err, data){
			done(null, data);
		});
	}
));

passport.use(new GoogleStrategy({
    returnURL: "http://94.244.155.77:"+CONFIG.appPort+"/login/gpcallback",
    realm: "http://94.244.155.77:"+CONFIG.appPort
  },
	function(identifier, profile, done) {
		var user = {
			first_name : profile.name.givenName,
			last_name : profile.name.familyName,
			email : profile.emails[0].value,
			social : [{
				id : profile.emails[0].value,
				socialType : CONSTANTS.GOOGLE
			}]
		}
		db.findOrSaveUser(user, function(err, data){
			done(null, data);
		});
	}
));

passport.use(new LinkedInStrategy({
	consumerKey: "775lancq0kyao8",
	consumerSecret: "RMudCRVJ4Y0oFUtr",
	callbackURL: "http://94.244.155.77:"+CONFIG.appPort+"/login/linkedinCallback",
	profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline']
	},
	function(token, tokenSecret, profile, done) {
		db.findOrSaveUser({
			first_name : profile._json.firstName,
			last_name : profile._json.lastName,
			email : profile._json.emailAddress,
			social : [{
				id : profile._json.id,
				socialType : CONSTANTS.LINKEDIN
			}]
		}, 
		function(err, data){
			done(null, data);
		});
	}
));

passport.use(new VKontakteStrategy({
    clientID:     "4038457", 
    clientSecret: "nRhenXgKWC4rN1rBAwci",
    callbackURL:  "http://94.244.155.77:"+CONFIG.appPort+"/login/vkCallback"
  },
  function(accessToken, refreshToken, profile, done) {
	var user = profile._json;
		user.social = [{
			id : profile.id,
			socialType : CONSTANTS.VK			
		}];
		db.findOrSaveUser(user, function(err, data){
			done(null, data);
		});
  }
));

exports.init = function(app) {
	app.use(passport.initialize());
	app.use(passport.session());
	passport.serializeUser(function(user, done) {
		done(null, user);
	});
	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});
}

exports.login = function(sn, req, res, scope){
	//sn means social network
	passport.authenticate(sn, {scope: scope || []})(req, res);
}
exports.loginCallback = function(sn, req, res){
	passport.authenticate(sn, { successRedirect: '/',
		failureRedirect: '/login' 
	})(req, res)
}
