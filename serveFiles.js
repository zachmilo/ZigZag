var static = require('node-static');
var fileServer = new static.Server('.');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response, function (e, res) {
            fileServer.serveFile('index.html',200, {}, request, response);
        });
    }).resume();
}).listen(8080);
