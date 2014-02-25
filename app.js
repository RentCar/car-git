
/**
 * Module dependencies.
 */
CONFIG = require('./config');
var express = require('express');
var routes = require('./app/routes');
var http = require('http');
var path = require('path');
var connect = require('connect');

var app = express();
var appPort = parseInt(process.argv.slice(2)) || 3000;
var cookieParser = express.cookieParser('SecretPass')
  , sessionStore = new connect.middleware.session.MemoryStore();
social = require('./social');

var I18n = require('i18n-2');

I18n.expressBind(app, {
    locales: ['ru', 'en', 'de', 'ua']
});

// all environments
app.set('port', process.env.PORT || CONFIG.appPort);
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.json());
app.use(express.urlencoded());

app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/socket.io')));

app.use(express.methodOverride());
app.use(express.cookieParser('SecretPass'));
app.use(express.session({
    secret: 'SecretPass',
    key: 'connect.sid',
    httpOnly: true,
    store: sessionStore
}));


app.configure(function() {

});

app.configure('dev', function() {
    app.use(express.logger('dev'));
    app.use(express.errorHandler());
});

app.configure('stage', function() {});
app.configure('prod', function() {});


social.init(app);

db = {};
// init routes
routes(app, db, social);


// running the server
var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

var socket = require("./socket.js");

socket.init(server, sessionStore, cookieParser);
