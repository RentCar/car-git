var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy;
var pgModel = require('./pgModel');
var db = require('./db');

var CONSTANTS = {
	FACEBOOK : 1
}

passport.use(new FacebookStrategy({
		clientID: "543776059050441",
		clientSecret: "c561992ef2ab4c9b3e0c8d8ea03a9ef4",
		callbackURL: "http://94.244.155.77:3000/login/fbcallback"
	},
	function(accessToken, refreshToken, profile, done) {
		console.log(profile);
		pgModel.addOrGetUser(CONSTANTS.FACEBOOK, profile._json, function(err, result){
            result.socialId = profile.id;
			db.findOrSaveUser(result, function(err, data){
				done(null, profile);
			});
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

exports.fbLogin = function(req, res){
	passport.authenticate('facebook', {scope: ["email"]})(req, res);
}
exports.fbLoginCallback = function(req, res){
	passport.authenticate('facebook', { successRedirect: '/',
		failureRedirect: '/login' 
	})(req, res)
}