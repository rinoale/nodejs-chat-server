var net = require('net');

var ClientMessage = require('./messages/clientMessage.js');

var message = new ClientMessage();

var server_address = '192.168.33.11';

function UserSocket(name) {
    this.name = name;
}

UserSocket.prototype = new net.Socket();

UserSocket.prototype.sendInfo = function () {
  message.setInfo(null, this.name);
    this.write(JSON.stringify(message));
};

UserSocket.prototype.sendChat = function (chat) {
    message.setChat(chat);
    this.write(JSON.stringify(message));
}

var client = new UserSocket('test_client');

client.connect(1337, server_address, function() {
  console.log('Connected');
  console.log(client.name);
    
    client.sendInfo();
});

client.on('data', function(data) {
  console.log('Received: ' + data);
});

client.on('close', function() {
  console.log('Connection closed');
});

process.stdin.on('data', function (input) {

  client.sendChat(input);
})
