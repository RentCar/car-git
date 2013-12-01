
/**
 * Module dependencies.
 */
CONFIG = require('./config');
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();
var appPort = parseInt(process.argv.slice(2)) || 3000;

var social = require('./social');

// all environments
app.set('port', process.env.PORT || CONFIG.appPort);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('SecretPass'));
app.use(express.session({secret: 'car', key: 'user.sid'}));
social.init(app);
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/socket.io')));


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

routes.init(app, {social : social});

// running the server
var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

/**
 * Sockets part TODO: move to controller
 * @type {*}
 */
var io = require('socket.io').listen(server);

var users = {};

io.sockets.on('connection', function (socket) {
   // console.log(socket)
//    console.log(socket)
    var testString = "TestString"
    var iter = 0

    console.log(app.session)
    socket.emit("newUser", { hello: socket.store.id});

    socket.on('data', function (data) {
        console.log(data);
        setInterval(function() {

            iter++
            users[socket.store.id] = {
                //socket : socket.store,
                user : {
                    name: "Artem",
                    test: testString + iter
                }
            }

            socket.emit("userData", {data: users[socket.store.id]})
        }, 5 * 1000)
    });
});
