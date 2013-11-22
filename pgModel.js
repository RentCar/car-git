var pg = require('pg'); 
var dbConnectionConfig = { host: 'localhost', user: 'car', password: 'qwerty', database: 'destination' };
var conString = "postgres://car:qwerty@localhost/destination";
var client = new pg.Client(conString);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  console.log((new Date()).getTime());
  client.query("", function(err, result) {
	console.log(result);
    if(err) {
      return console.error('error running query', err);
    }
	 console.log((new Date()).getTime());
    //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
   // client.end();
  });
});

exports.connect = client.connect;
exports.addOrGetUser = function(socialNetworkId, profile, callback) {
	client.query("select id, first_name, last_name, karma from dest.users where id = (select user_id from dest.user_social where social_id='"+profile.id+"'  and social_type_id = '"+socialNetworkId+"')", callback);
	//client.query("insert into dest.users (first_name, last_name) values ('"+profile._json.first_name+"', '"+profile._json.last_name+"')", callback);
	
}