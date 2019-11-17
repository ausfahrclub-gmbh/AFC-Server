var express = require('express');
var socket  = require('socket.io');

const PORT = 9000; 
var currentAlarmLevel;

//For shoptimer xD
var timerID;
var isTimerRunning = false;

//App
var app = express();
var server = app.listen(PORT,() => {console.log(`Server running on port ${PORT}`);})

var bodyParser = require('body-parser')
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

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
    
        else if(level == 'shop'){
            if(isTimerRunning){
                isTimerRunning = false;
                clearInterval(timerID);
                console.log('timer stop');
                //Emit stop signal for timer
                io.sockets.emit('alarm', {
                    id: id,
                    type: 'shop',
                    level: 'shop',
                    status: 'disabled'
                    
                });
            }
            else{
                console.log('timer emit');
                io.sockets.emit('alarm', {
                    id: id,
                    type: 'shop',
                    level: 'shop',
                    status: 'active'
                    
            });
                timerID = setInterval(function() {
                    //Emit start signal for timer
                        io.sockets.emit('alarm', {
                            id: id,
                            type: 'shop',
                            level: 'shop',
                            status: 'active'
                            
                    });
                    console.log('intervall');
                }, 180 * 1000); 

                isTimerRunning = true;
            }
        }
        // Emit Normal alarm
        else{ 
            io.sockets.emit('alarm', data);
            console.log(data);
            currentAlarmLevel = level;
        } 

    }); 
});
