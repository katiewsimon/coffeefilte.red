
var http = require('http');
var express = require('express');
var api = require('instagram-node').instagram();
var app = express();


api.use({
  client_id: 'c65c3b480f894cf3b4de1169c840cb4c',
  client_secret: '9d0dee9f4ceb403a901953243cf270b1'
});

var redirect_uri = 'http://localhost:3000/oauth';

exports.authorize_user = function(req, res) {
  res.redirect(api.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
};

exports.handleauth = function(req, res) {
  api.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err.body);
      res.send("Didn't work");
    } else {
      console.log('Yay! Access token is ' + result.access_token);
      res.send('You made it!!'); // send js object converted to string
      // limit for more
      

      api.tag_media_recent('latteart', function(err, medias, pagination, remaining, limit) {
      		//var json = JSON.parse({"":""});
      	//console.log(medias[1].location);
      	for (var i = 1; i < medias.length; i++) {
      		console.log(medias[i].location);
      		//res.send(medias[i].location);
      		//console.log(json.location);
      		//console.log(medias['link']);
      		//var loc = medias.get('location');
      		// if (medias.location == null) {
      		// 	console.log('has the location!');
      		// }

      		// if (loc != null) {// if there is a location
      		// 	res.send(medias.link);
      		// }
      	}
      	// loop through array
      		// link = picture
      		//res.send(each picture)
      		// latitude/longitude

      	//
      });

    }
  });
};

// This is where you would initially send users to authorize
app.get('/authorize_user', exports.authorize_user);
// This is your redirect URI
app.get('/oauth', exports.handleauth);



http.createServer(app).listen('3000', function(){
  console.log("Express server listening on port " + '3000');
});


