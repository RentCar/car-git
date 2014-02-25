var UserModel = require("./../models/userModel").UserModel;

function User() {

    var user = new UserModel();

    this.getDriverForm = function(req, res) {
        res.render('partials/driverForm');
    }

    this.getPassengerForm = function(req, res) {
        res.render('partials/passengerForm');
    }

    this.getExampleData = function(req, res, next) {
        user.getData({}, function(err, data) {
            if (!err) {
                console.log(data);
                next();
            }
        });
    }
}


exports.User = User