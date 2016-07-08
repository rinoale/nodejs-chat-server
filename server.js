// Load the TCP Library
net = require('net');

// Keep track of the chat clients
var clients = [];

function Message(operation, user, message) {
  this.operation = operation;
  this.user = user;
  this.message = message;
}

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
        socket.name = json_data.user;

        // Send a nice welcome message and announce
        json_data.message = 'Welcome ' + socket.name;
        whisper(JSON.stringify(json_data), socket);

        json_data.message = ' joined the chat';
        broadcast(JSON.stringify(json_data), socket);
        break;
      case 'chat':
        broadcast(JSON.stringify(json_data), socket);
        break;
    }
  });

  // Remove the client from the list when it leaves
  socket.on('end', function () {
    var message = new Message('info', socket.name, ' left the chat');
    clients.splice(clients.indexOf(socket), 1);
    broadcast(JSON.stringify(message));
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

  function whisper(message, socket) {
    socket.write(message);
  }

}).listen(1337);

// Put a friendly message on the terminal of the server.
console.log("Chat server running at port 1337\n");
