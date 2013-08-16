var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});

db = new Db('tododb', server, {safe:false});
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'tododb' database");
        db.collection('todos', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'todos' collection doesn't exist yet.");
            }
        });
    } else {
        console.log("Error while connecting to the tododb : " + err);
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving todo with _id = [ ' + id + ']');
    
    db.collection('todos', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.json({todo:item});
        });
    });
};
 
exports.findAll = function(req, res) {

    console.log('Retrieving all todos');

    db.collection('todos', function(err, collection) {
        collection.find().toArray(function(err, items) {
            // Wrap the array in a root element called todos.
            var allLocations = {
                todos:items
            };
            res.send(allLocations);
        });
    });
};
 
exports.addLocation = function(req, res) {
    
    var todo = req.body.todo;
    
    console.log('Adding todo: ' + JSON.stringify(todo));

    db.collection('todos', function(err, collection) {
        collection.insert(todo, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                var record = result[0];
                res.json({todo:record});
            }
        });
    });
}
 
exports.updateLocation = function(req, res) {
    
    var id = req.params.id;
    var todo = req.body.todo;
    
    console.log('Updating todo with id [' + id + ']');
    console.log('Todo payload = ' + JSON.stringify(todo));
    
    db.collection('todos', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, todo, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating todo: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                todo._id = id;
                res.json({todo:todo});
            }
        });
    });
}
 
exports.deleteLocation = function(req, res) {
    var id = req.params.id;
    console.log('Deleting todo: ' + id);
    db.collection('todos', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.json({});
            }
        });
    });
}
