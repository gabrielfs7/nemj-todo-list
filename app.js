var db = require('./model/db'),
    task = require('./model/tasks'),
    express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    routes = require('./routes/index'),
    tasks = require('./routes/tasks');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Routes mapping
 */
app.use('/', routes);
app.use('/tasks', tasks);

/**
 * 404 Error view
 */
app.use(
    function(req, res, next)
    {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    }
);

/**
 * Development error view
 */
if (app.get('env') === 'development') {
    app.use(
        function(err, req, res, next)
        {
            res.status(err.status || 500);
            res.render(
                'error',
                {
                    message: err.message,
                    error: err
                }
            );
        }
    );
}

/**
 * Production error view
 */
app.use(
    function(err, req, res, next)
    {
        res.status(err.status || 500);
        res.render(
            'error',
            {
                message: err.message,
                error: {}
            }
        );
    }
);

module.exports = app;