// Load the TCP Library
var net = require('net');

var UserSocket = require('./sockets/userSocket.js');

var ServerMessage = require('./messages/serverMessage.js');

var message = new ServerMessage();

// Keep track of the chat clients
var clients = [];

// Start a TCP Server
net.createServer(function (socket) {

  // Identify this client
  socket.name = socket.remoteAddress + ":" + socket.remotePort 

  // Put this new client in the list
  clients.push(socket);

  var userSocket = new UserSocket(socket);
  userSocket.onData();
}).listen(1337);
// Put a friendly message on the terminal of the server.
console.log("Chat server running at port 1337\n");
