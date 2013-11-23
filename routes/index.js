/*
 * GET home page.
 */
var db = require("./../db");

exports.init = function(app, modules){

    /**
     * Angular tests
     */
    app.get('/userBlock', function(req, res) {
        res.render('partials/userBlock');
    })
    app.get('/sockets', function(req, res) {
        res.render('sockets-test')
    });


    app.get('/driver', function(req, res){
        db.getTrips(true, {}, function(err, data){
            res.render('index', {result : data, RequestedUserType : "passenger"});
        });
    });

    app.get('/', function(req, res){
        db.getTrips(false, {}, function(err, data){
            res.render('index', {
                result : data,
                RequestedUserType : "driver",
                title: 'Destination.to'
            });
        });
    });

    app.get('/login', function(profile, callback){
        db.saveUser({firstName : profile.first_name, lastName : profile.last_name}, function(err, data){
            callback(err, data)
        })
    });

    app.get('/login/fb', modules.social.fbLogin);
    app.get('/login/fbcallback', modules.social.fbLoginCallback);

    app.get('/createOffer', function(req, res) {
        db.createTrip(1, {x: 34, y: 85}, {x: 50, y: 154}, 100, function(err, data){
            res.render('tripCreatedMessage', data);
        })
    });
}