var ServerMessage = require('../messages/serverMessage.js');

var message = new ServerMessage();

function UserSocket(socket) {
  this.socket = socket;
  this.userSocketList.push(this.socket);

  operationList = {};

  operationList.chat = function (data) {
    message.setChat(this.name, data);

    broadcast(message);
  };

  operationList.inform = function (data) {
    this.name = data;

    message.setNotice('Welcome ' + this.name);

    personalcast(message);

    message.setInfo(this.name, ' joined the chat');

    broadcast(message);
  };

  this.onData = function () {
    this.socket.on('data', function (data) {

      messageArray = data.toString().split('\n');

      messageArray.forEach(function (message) {
        if (message.length == 0) return;

        var json_data = JSON.parse(message);

        var operation = json_data.operation;

        if (typeof operationList[operation] === 'function'){
          operationList[operation](json_data.message);
        }
        else {
          console.log('command ' + operation + ' is not defined');
        }
      });
    });
    this.socket.on('end', function () {
      message.setInfo(this.name + ' left the chat');
      broadcast(JSON.stringify(message));
      this.userSocketList.splice(this.userSocketList.indexOf(this.socket), 1);
    });

    this.socket.on('error', function () {
      console.log(this.name+' has been disconnected.');
      this.userSocketList.splice(this.userSocketList.indexOf(this.socket), 1);
    });
  }
};

UserSocket.prototype.userSocketList = [];

UserSocket.prototype.getSocket = function () {
  console.log('getting this socket' + this.socket);
  return this.socket;
};

function broadcast(message) {
  console.log(this);
  console.log(typeof this);
  UserSocket.prototype.userSocketList.forEach(function (client) {
    // Don't want to send it to sender
    // if (client === sender) return;
    client.write(JSON.stringify(message));
  });
  // Log it to the server output too
  process.stdout.write(JSON.stringify(message) + "\n")
}

function personalcast(message) {
  console.log(UserSocket.prototype.getSocket());
}

module.exports = UserSocket;
