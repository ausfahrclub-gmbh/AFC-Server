const path = require('path');
var Service = require('node-windows').Service;

const serverScriptPath = path.join(__dirname, 'server.js')
// Create a new service object
var svc = new Service({
  name:'AFC-Server',
  description: 'Server for Client Connections and Database-Connector.',
  script: serverScriptPath,
  nodeOptions: [
    '--harmony'
  ]
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();