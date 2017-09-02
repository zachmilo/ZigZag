var express = require("express");
var apiCall = require('request');
var app = express();
const client = process.env.spotifyClient || "05d5da3b5eda442d9994c27646b68a55";
const secret = process.env.SpotifySecret || "ee5809c6468c412d86b44e918c2905ca";

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname));

// views is directory for all template files
app.set('views', __dirname);
//app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function(request, response) {
  response.render('index');
});

app.get('/results', function(request, response) {
   // response.redirect('/results.html');
   response.render('results')
 });

app.get('/test', function(request, response) {
  response.render('test/runTest');
});

app.get('/spotifyId', getSpotifyToken, function(request, response) {
  response.send(response.spotifyToken);
});

function getSpotifyToken(request,response,next) {
  var options = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      grant_type: "client_credentials"
    },
    headers:{
      "Authorization": "Basic " + (new Buffer(client + ":" + secret).toString("base64"))
    },
    json:true
  };
  apiCall.post(options,function(error,res,body) {
    if(!error && res.statusCode === 200) {
      response.spotifyToken = body;
      next();
    }
  });
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
