
/**
 * Module dependencies.
 */
CONFIG = require('./config');
var express = require('express');
var routes = require('./app/routes');
var sockets = require('./app/sockets');
var http = require('http');
var path = require('path');
var MongoStore = require('connect-mongo')(express);

var app = express();
var appPort = parseInt(process.argv.slice(2)) || 3000;
var cookieParser = express.cookieParser('SecretPass')
  , sessionStore = new MongoStore({db : "dest"});
social = require('./app/middleware/social');

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

app.set("ctr", (function(){
	var ctrs = [];
	return function(name) {	
		if(!ctrs[name]) {
			ctrs[name] = require("./app/controllers/"+name)(app);
		}
		return ctrs[name];
	}
})());
app.set("model", function(name) {
	return require("./app/models/"+name+"Model");
})
social.init(app);

// init routes
routes(app);
// running the server
var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
sockets(app, server, sessionStore, cookieParser);
