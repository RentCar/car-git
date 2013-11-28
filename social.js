var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy, 
	GoogleStrategy = require('passport-google').Strategy;
var pgModel = require('./pgModel');
var db = require('./db');

var CONSTANTS = {
	FACEBOOK : 1,
	GOOGLE : 2
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
		console.log(data);
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