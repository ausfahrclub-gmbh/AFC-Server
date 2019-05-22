const electron = require('electron');
const {ipcRenderer} = electron;


var socket;
var sound;



//var ipadress = 'http://localhost:9000';
var ipadress = 'http://25.66.153.178:9000';

ipcRenderer.on('trigger', (e, level) => {
   socket.emit('alarm', {
      id: socket.id,
      type: 'trigger',
      level: level
   });
});

// Startup-sound (autoplay)   -NV
sound = new Howl({
   src: ['./Audio./startup.mp3'],
   preload: true,
   volume: 0.2,
   autoplay: true,
});

/* # # # # # # # # # # # # # # 
   Chat / Socket handling
# # # # # # # # # # # # # # # #*/
window.onload = function () { 

   // Query DOM   -NV
   var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback'),
      status = document.getElementById('status')
      alarmlog = document.getElementById('Alarmlog');

   document.getElementById('adress').innerHTML = '(' + ipadress + ')';
   socket = io.connect(ipadress);

   // Changes the lable on mainWindow.html, to give feedback to the user   -NV
   socket.on('connect', () => {
      status.style.color = "green"
      status.innerHTML = "CONNECTED"
      console.log(socket);
    });
    socket.on('disconnect', () => {
       status.style.color = "red"
       status.innerHTML = "DISCONNECTED"
    });

   



   // Emit events   -NV
   btn.addEventListener('click', function(){
      socket.emit('chat', {
         message: message.value,
         handle: handle.value
      });
      message.value = "";
   });

   message.addEventListener("keyup", function(event){
      if (event.keyCode === 13) {
         event.preventDefault();
         btn.click();
        }
   });

   message.addEventListener('keypress', function(){
      socket.emit('typing', handle.value);
   })

   // Listen for events   -NV
   socket.on('chat', function(data){
      feedback.innerHTML = '';
      output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
   });

   socket.on('typing', function(data){
      feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
   });

   // Listen for incoming alarms  -NV
   socket.on('alarm', function(data){
      
      const {id, type, level} = data;
      
      //Checks if a sound is already playing,if true stops the audio, to prevent overlaying the audio tracks   -NV 
      sound.unload();

      // set and format Timestamp for Alarmlog  -PW
      function timestamp(any){
         var time = new Date().getTime();
         var date = new Date(time); 
         var hours = date.getHours();
         var minutes = date.getMinutes();
         var seconds = date.getSeconds();
         hours = hours < 10 ? '0'+hours : hours;
         minutes = minutes < 10 ? '0'+minutes : minutes;
         seconds = seconds < 10 ? '0'+seconds : seconds;
            
         var hms = hours + ':' + minutes + ':' + seconds;
         return hms;
      }


      // Alarm stop received   -NV
      if(type == 'alarm_stop'){
         console.log(` ${id} Stopped playing ${level} alarm`);
         alarmlog.innerHTML += '<p style="color: red">' + `${timestamp()} - ${id} hat Alarm ${level} gestoppt` + '</p>';
      }

      // Alarm received   -NV
      else{
         console.log('State: ', sound.state());
         sound = playSound(level);
         alarmlog.innerHTML += '<p style="color: green">' + `${timestamp()} - ${id} hat Alarm ${level} gestartet` + '</p>';
      }
   });

  function playSound(level) {
      loadingSound = true;
      var howl = new Howl({
         src: [`./Audio./alarm${level}.mp3`],
         volume: 0.2,
         autoplay: true,
      });
      return howl;
   }
 }


