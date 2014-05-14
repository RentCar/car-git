var UserModel = require("./../models/userModel")

function Index() {

};

Index.prototype = {
    webRender : function(req, res) {
        function renderView(user){
            res.render('index', {
                user : user,
                title: 'Destination.to',
                header: {
                    socialLogin : {
                        facebook : {
                            enable : true,
                            name: req.i18n.__("facebook")
                        },
                        vkontakte : {
                            enable : true,
                            name: req.i18n.__("vk")
                        },
                        linkedin : {
                            enable : true,
                            name: req.i18n.__("linkedin")
                        },
                        google : {
                            enable : false,
                            name: req.i18n.__("google")
                        }
                    }
                }
            });
        }
        if(req.session.userID) {
            UserModel.findOne({_id : req.session.userID}, function(err, usr){
                renderView(usr);
            })
        }
        else {
            renderView();
        }
    },
    adminApp : function(req, res) {	
//        if(req.param) TODO: implement user security
        res.render('admin/index')
    }
}

module.exports = Index;