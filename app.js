
/**
 * Module dependencies.
 */
CONFIG = require('./config');
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
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
    // setup some locales - other locales default to en silently
    locales: ['ru', 'en', 'de', 'ua']
});
//app.use(i18n.init);
app.locals({
    'l':  I18n.__,
//    'ln': i18n.__n,
    'tr': function(data) {
        console.log('from rendered : ' + data);
        console.log(i18n.__('email'))
        return "BLAVLA"
    }
});

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

app.use(express.session({
    secret: 'SecretPass',
    key: 'connect.sid',
    httpOnly: true,
    store: sessionStore
  }));
social.init(app);
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/socket.io')));


// Localisation settings
// Express Configuration
app.configure(function() {
    // Attach the i18n property to the express request object
    // And attach helper methods for use in templates

    // Set up the rest of the Express middleware
});



// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

routes.init(app, {social : social});

// running the server
var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

var socket = require("./socket.js");

socket.init(server, sessionStore, cookieParser);
