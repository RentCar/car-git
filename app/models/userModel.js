
function UserModel () {
    this.getData = function(param, callback) {
        // get some data from DB
        var data = {
            a: 1,
            b: 2
        };
        callback(null, data);
    }
}

exports.UserModel = UserModel;