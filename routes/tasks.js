var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}));

router.route('/')
    .get(function(req, res, next) {
        mongoose.model('Task').find({}, function (err, registries) {
            if (err) {
                return console.error(err);
            } else {
                res.format({
                    html: function() {
                        res.render('tasks/index', {
                            title: 'All tasks',
                            "tasks" : registries
                        });
                    },
                    json: function() {
                        res.json(registries);
                    }
                });
            }
        });
    })
    .post(function(req, res) {
        var name = req.body.name;
        var doUntil = req.body.doUntil;

        mongoose.model('Task')
            .create({
            name : name,
            doUntil : doUntil,
            createdAt : Date.now()
        }, function (err, registry) {
            if (err) {
                console.log(err);
                return res.send("There was a problem adding the information to the database.");
            }

            res.format({
                html: function() {
                    res.location("tasks");
                    res.redirect("/tasks");
                },
                json: function() {
                    res.json(registry);
                }
            });
        })
    });

router.get('/new', function(req, res) {
    res.render('tasks/new', { title: 'Add New Blob' });
});

/**
 * Overriding for every time the :id parameter was used
 */
router.param('id', function(req, res, next, id) {
    mongoose.model('Task').findById(id, function (err, registry) {
        if (err) {
            var err = new Error('Task Not Found');
            err.status = 404;

            res.status(404);

            return res.format({
                html: function() {
                    next(err);
                },
                json: function() {
                    res.json({message : err.status  + ' ' + err});
                }
            });
        }

        console.log(registry);
        req.id = id;
        next();
    });
});

router.route('/:id')
    .get(function(req, res) {
        mongoose.model('Task').findById(req.id, function (err, registry) {
            if (err) {
                return console.log('GET Error: There was a problem retrieving: ' + err);
            }

            res.format({
                html: function(){
                    res.render('tasks/show', {
                        "task" : registry
                    });
                },
                json: function(){
                    res.json(registry);
                }
            });
        });
    });

router
    .get('/:id/edit', function(req, res) {
    mongoose.model('Task').findById(req.id, function (err, registry) {
        if (err) {
            return console.log('GET Error: There was a problem retrieving: ' + err);
        }

        res.format({
            html: function() {
                res.render('tasks/edit', {
                    "task" : registry
                });
            },
            json: function() {
                res.json(blob);
            }
        });
    });
})

router.put('/:id/edit', function(req, res) {
    var name = req.body.name;

    mongoose.model('Task').findById(req.id, function (err, registry) {
        registry.update({
            name : name
        }, function (err, registryId) {
            if (err) {
                res.send("There was a problem updating the information to the database: " + err);

                return;
            }

            res.format({
                html: function() {
                    res.redirect("/tasks/" + registry._id);
                },
                json: function() {
                    res.json(registry);
                }
            });
        })
    });
})

router.delete('/:id/edit', function (req, res) {
    mongoose.model('Task').findById(req.id, function (err, registry) {
        if (err) {
            return console.error(err);
        }

        blob.remove(function (err, blob) {
            if (err) {
                return console.error(err);
            }

            res.format({
                html: function() {
                    res.redirect("/tasks");
                },
                json: function() {
                    res.json({
                        message : 'deleted',
                        item : registry
                    });
                }
            });
        });
    });
});

module.exports = router;