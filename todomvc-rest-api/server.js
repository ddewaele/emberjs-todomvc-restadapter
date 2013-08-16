var express = require('express'),
    todomgr = require('./todomgr');
 
// Create the express app. 
var app = express();
 
 // ## CORS middleware
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function(req, res, next) {
    console.log("writing cross domain headers...");
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
});

// Create our supported routes. 
app.get('/todos', todomgr.findAll);
app.get('/todos/:id', todomgr.findById);
app.post('/todos', todomgr.addLocation);
app.put('/todos/:id', todomgr.updateLocation);
app.delete('/todos/:id', todomgr.deleteLocation);
 
// Starting listening 
app.listen(3000);
console.log('Listening on port 3000...');