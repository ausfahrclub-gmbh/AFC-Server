# AFC-Website
<b> this really be a bruh moment </b>

# AFC-Alarm
## System architecture - Alarm

<img src="Images/AlarmArchitecture.png" />

### Server

Socket IO is listening on the webserver for incoming socket connections. 
It receives alarm requests from the clients and transmits to every connected client the incoming alarm.  

### Client

The client can send an 'Alarm' request to the server.
It receives incoming alarm and plays the corresponding sound to the alarm-level.


To establish a connection over diffrent networks, the clients and the server have to be in private network. To realise that, we use [**LogMeIn Hamachi**](https://www.vpn.net/).

<img src="Images/AlarmConnection.png" />

## Setup 
### Requires [NPM](https://nodejs.org/en/download/)

Execute commands in the Client and Server folder:
```
//Installing dependencies
npm install

//Run the application    
npm start
```


## Used technologies

<img width="50%" src="Images/nodejs.png" />
<img width="50%" src="Images/electron.png" />
<img width="50%" src="Images/express.png" />
<img width="50%" src="Images/socket-io.png" />
<img width="70%" src="Images/howler.png" />

