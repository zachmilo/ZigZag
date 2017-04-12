// var express = require('express');
// var app = express();
// var path = require('path');
//
// app.set('port', (process.env.PORT || 5000));
// // viewed at http://localhost:8080
// app.get('/', function(req, res) {
//     res.sendFile(path.join(__dirname + 'index.html'));
// });
//
// app.listen(app.get('port'), function() {
//     console.log('Node app is running on port', app.get('port'));
// });


var express = require('express');
var app = express();

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


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
