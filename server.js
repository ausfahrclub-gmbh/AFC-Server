var express = require('express');
var socket  = require('socket.io');

var db = require('./database');

const PORT = 9000; 
var currentAlarmLevel;

//App
var app = express();
var server = app.listen(PORT,() => {console.log(`Server running on port ${PORT}`);})

var bodyParser = require('body-parser')
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// // create application/json parser
// var jsonParser = bodyParser.json()
 
// // create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

//Static files
app.use(express.static('public'), function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin','*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Get all movies
app.get('/movies', async function(req, res){
    var results = await db.getAllMovies()
    //console.log('query results', results);
    res.send(results)
});

app.get('/movieRatings/:movieName', async function(req, res){
    //console.log('rating req:' + req.params.movieName + ' return: ' + await db.getAllRatingsByMovie(req.params.movieName)[0]);
    res.send(await db.getAllRatingsByMovie(req.params.movieName))
})

// POST method route
app.post('/movieRatings', function (req, res) {
    //console.log('req:', req.body.movie);
    var r = db.addMovieRating(req.body);
    if(r == null){
        res.status(500).send('Something broke!');
    }else{
        res.send();
    }
});

// Socket setup & pass server
var io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);
    
    // Handle chat event
    socket.on('chat', function(data){
        // console.log(data);
        io.sockets.emit('chat', data);
        console.log(data);
    });

    // Handle typing event
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
        console.log(data);
    });

    socket.on('disconnect', (socket)  => {
        console.log('socket disconnected:', socket.id);
    });
    
    socket.on('alarm', function(data){

        const {id, level, type} = data;

        // If the same alarm is requested twice in a row, it will be cancelled
        if(level == 'holdup'){
            //Send a custom package to the client, that will stop the current playing alarm(sound) 
            io.sockets.emit('alarm', {
                id: id,
                type: 'alarm_stop',
                level: level
            });
            console.log('Stopped:');         
            currentAlarmLevel = -1;        
        }
        // Emit Normal alarm
        else{ 
            io.sockets.emit('alarm', data);
            console.log(data);
            currentAlarmLevel = level;
        } 

    }); 
});
