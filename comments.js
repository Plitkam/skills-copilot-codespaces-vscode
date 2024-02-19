// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var qs = require('querystring');
var comments = [];

http.createServer(function(req, res) {
    var urlObj = url.parse(req.url, true);
    var pathname = urlObj.pathname;
    if (pathname === '/') {
        var htmlPath = path.join(__dirname, 'index.html');
        var htmlContent = fs.readFileSync(htmlPath);
        htmlContent = htmlContent.toString('utf8');
        var commentsStr = '';
        comments.forEach(function(item) {
            commentsStr += '<p>' + item + '</p>';
        });
        htmlContent = htmlContent.replace('&&&comments&&&', commentsStr);
        res.setHeader('Content-Type', 'text/html; charset=utf8');
        res.end(htmlContent);
    } else if (pathname === '/submit') {
        var dataStr = '';
        req.on('data', function(chunk) {
            dataStr += chunk;
        });
        req.on('end', function() {
            var comment = qs.parse(dataStr).comment;
            comments.push(comment);
            res.statusCode = 302;
            res.statusMessage = 'Found';
            res.setHeader('Location', '/');
            res.end();
        });
    } else {
        var filePath = path.join(__dirname, pathname);
        fs.readFile(filePath, 'binary', function(err, fileContent) {
            if (err) {
                res.setHeader('Content-Type', 'text/plain; charset=utf8');
                res.statusCode = 404;
                res.end('404 Not Found');
            } else {
                res.write(fileContent, 'binary');
                res.end();
            }
        });
    }
}).listen(8080);
console.log('Server is running at http://