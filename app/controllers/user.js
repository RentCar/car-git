var UserModel = require("./../models/userModel"),
    passport = require("passport");

function User() {

}
User.prototype = {
    login : function(sn, req, res){
        var socialScopes = {
            facebook : ["email"],
            linkedin : ['r_basicprofile', 'r_emailaddress']
        }
        passport.authenticate(sn, {scope: socialScopes[sn] || []})(req, res);
    },
    loginCallback : function(sn, req, res){
        passport.authenticate(sn, { successRedirect: '/',
            failureRedirect: '/login'
        })(req, res);
    },
    logout : function(req, callback) {
        if(!req.session.passport.user) {
            callback("you're not logged in");
            return;
        }
        UserModel.logout(req.session.passport.user._id, function(err){
            if(err) {
                callback(err);
            }
            else {
                req.logout();
                callback(null);
            }
        });
    },
    updateLocation : function(id, latlng, callback) {
        userModel.update({_id : id}, {currentLatlng : latlng}, function(err){
            callback(err);
        })
    }
}

module.exports = User