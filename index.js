const express = require('express');

const app = express();

app.get('/', function (request, response) {
    response.send("Hello World")
});

app.get('/about', function (request, response) {
    response.send("ini halaman aboutjkjkss");
});

app.listen(5000, function () {
    console.log('Srver Startng on port 5000')
})