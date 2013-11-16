/**
 * Module dependencies.
 */

// TODO: port to local dev config;
var appPort = 3030;

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var db = require('./db');

var app = express();

// all environments
app.set('port', process.env.PORT || appPort);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('SecretPass'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/socket.io')));
app.use(express.static(path.join(__dirname, '/lib')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/db', routes.db);
app.get('/users', user.list);

app.get('/sockets', function(req, res) {
    res.render('sockets-test')
})

app.get('/php', function(req, res) {
    var exec = require("child_process").exec;
    var scriptName = 'get_json.php'
    exec("php php_scripts/" + scriptName,
        function (error, stdout, stderr) {
            var url = require('url');
            var urlData = url.parse(req.url, true);
            console.log(urlData.query.glo);
            if(urlData.query.glo) {
                global.testVar = urlData.query.glo;
            }
            res.render('customer', {
                title : 'O_O',
                testVar : global.testVar || 100,
                data : JSON.parse(stdout)
            });
        }
    );
});

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

/**
 * Sockets part TODO: move to controller
 * @type {*}
 */
var io = require('socket.io').listen(server)

io.sockets.on('connection', function (socket) {
    socket.emit("newUser", { hello: 'NewUser' });
    socket.on('data', function (data) {
        console.log(data);
    });
});
