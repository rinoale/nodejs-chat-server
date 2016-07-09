// Load the TCP Library
var net = require('net');

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

  // Handle incoming messages from clients.
  socket.on('data', function (data) {
    var json_data = JSON.parse(data);

    switch(json_data.operation) {
      case 'inform':
        socket.name = json_data.message;

        message.setNotice('Welcome ' + socket.name);;
        // Send a nice welcome message and announce
        personalcast(JSON.stringify(message), socket);

        message.setInfo(socket.name, ' joined the chat');
        break;
      case 'chat':
        message.setChat(socket.name, json_data.message);
        break;
    }
    broadcast(JSON.stringify(message), socket);
  });

  // Remove the client from the list when it leaves
  socket.on('end', function () {
    message.setInfo(socket.name + ' left the chat');
    broadcast(JSON.stringify(message), socket);
    clients.splice(clients.indexOf(socket), 1);
  });

  socket.on('error', function () {
    console.log(socket.name+' has been disconnected.');
    clients.splice(clients.indexOf(socket), 1);
  });
  
  // Send a message to all clients
  function broadcast(message, sender) {
    clients.forEach(function (client) {
      // Don't want to send it to sender
      // if (client === sender) return;
      client.write(message);
    });
    // Log it to the server output too
    process.stdout.write(message + "\n")
  }

  function personalcast(message, socket) {
    socket.write(message);
  }

}).listen(1337);

// Put a friendly message on the terminal of the server.
console.log("Chat server running at port 1337\n");
