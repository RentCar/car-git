
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var db = require('./db');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var l = console.log

function getTrips(type, filter, callback) {
	// type : boolean - if it's true we're looking for orders otherwise for offers
	filter[type ? "passenger" :"driver"] = {$exists : true};
	console.log(filter);
	db.get('trips', filter, callback);
}

app.get('/', routes.index);
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

app.get('/driver', function(req, res){
	getTrips(true, {}, function(err, data){
		res.render('index', {result : data, RequestedUserType : "passenger"});
	});
})

app.get('/passenger', function(req, res){
	getTrips(false, {}, function(err, data){
		res.render('index', {result : data, RequestedUserType : "driver"});
	});
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
