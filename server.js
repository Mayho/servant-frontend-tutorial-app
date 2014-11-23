var connect = require('connect')
var serveStatic = require('serve-static')

var app = connect();

app.use(serveStatic('./', {
    'index': 'index.html',
    'image': 'image.html'
}));

app.listen(8080)
console.log("Servant Front-End Tutorial Server Listening On Port 8080")