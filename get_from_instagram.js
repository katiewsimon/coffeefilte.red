<!DOCTYPE html>
<html>
<head>
<script>

// oauth

var http = require('http');
var express = require('express');
var api = require('instagram-node').instagram();
var app = express();

var pictures;


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

  });
};

// This is where you would initially send users to authorize
app.get('/authorize_user', exports.authorize_user);
// This is your redirect URI
app.get('/oauth', exports.handleauth);


// ajax 

function readFile()
{
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
         xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
     }

     xmlhttp.onreadystatechange=function()
     {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
             document.getElementById("link").innerHTML=xmlhttp.responseText.split("\n");
        }
     }


     xmlhttp.open("GET","https://api.instagram.com/v1/locations/{location-id}?access_token=ACCESS-TOKEN",true);
     xmlhttp.send();
 }
 </script>
 </head>
 <body>

 <div id="myDiv"><h2>"FILE.txt"</h2></div>
 <button type="button" onclick="readFile()">FILE</button>

 </body>
 </html>