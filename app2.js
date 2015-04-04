
var http = require('http');
var express = require('express');
var api = require('instagram-node').instagram();
var app = express();

var access_token;

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
      access_token = result.access_token;
      //res.send('You made it!!'); // send js object converted to string

      // limit for more
      res.redirect('/');
    }
  });
};

exports.getcoffee = function (req, res) {
    var pictures = [];
    api.use({ access_token: access_token });
    api.tag_media_recent('latteart', function(err, medias, pagination, remaining, limit) {

      for (var i = 1; i < medias.length; i++) {
        
        var loc = medias[i].location;
        if (loc != null ) {
          var latitude = medias[i].location.latitude;
          var longitude = medias[i].location.longitude;
          if (latitude != undefined && longitude != undefined) {
                    pictures.push({
                type: 'Feature',
                // this is the line where we need to add the coffee shop coordinates
                "geometry": { "type": "Point", "coordinates": [longitude,latitude]},
                // [medias[1].location.latitude, medias[1].location.longitude]
                "properties": {
                  // name of the coffee shop? 
                    
                    'marker-color': '#5f1d11',
                    'marker-symbol': 'cafe',
                    'marker-size': 'medium',

                    // Store the image url and caption in an array.
                    // need links from IG --> either to the whole instagram post or just the images
                    'images': [
                      [medias[i].images.standard_resolution.url]
                  ]
            }
        })
        }
      }
    }
    res.send(JSON.stringify(pictures));
  });
}

exports.isauthenticated = function (req, res) {
  res.send({authenticated : (typeof access_token !== "undefined") });
}

app.get('/authenticated', exports.isauthenticated)

app.get('/coffee', exports.getcoffee);

// This is where you would initially send users to authorize
app.get('/authorize_user', exports.authorize_user);
// This is your redirect URI
app.get('/oauth', exports.handleauth);

app.get('/', function(req, res) {
    res.sendFile('/Users/katiesimon/Dropbox/hackathons/hackholyoke/index2.html');
});
app.get('/require.js', function(req, res) {
    res.sendFile('/Users/katiesimon/Dropbox/hackathons/hackholyoke/require.js');
});

http.createServer(app).listen('3000', function(){
  console.log("Express server listening on port " + '3000');
});


