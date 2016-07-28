var ServerMessage = require('../messages/serverMessage.js');

var message = new ServerMessage();


function UserSocket(socket) {
  userSocket = socket;
  this.userSocketList.push(userSocket);


  chat = function (data) {
    message.setChat(this.name, data);

    broadcast(message);
  };

  inform = function (data) {
    this.name = data;

    message.setNotice('Welcome ' + data);

    personalcast(message);

    message.setInfo(data, ' joined the chat');

    broadcast(message);
  };

  this.onData = function () {
    userSocket.on('data', function (data) {

      messageArray = data.toString().split('\n');

      messageArray.forEach(function (message) {
        if (message.length == 0) return;

        var json_data = JSON.parse(message);

        var operation = json_data.operation;

        if (typeof this[operation] === 'function'){
          this[operation](json_data.message);
        }
        else {
          console.log('command ' + operation + ' is not defined');
        }
      });
    });
    userSocket.on('end', function () {
      message.setInfo(this.name + ' left the chat');
      broadcast(JSON.stringify(message));
      this.userSocketList.splice(this.userSocketList.indexOf(this.socket), 1);
    });

    userSocket.on('error', function () {
      console.log(this.name+' has been disconnected.');
      this.userSocketList.splice(this.userSocketList.indexOf(this.socket), 1);
    });
  }
};

UserSocket.prototype.userSocketList = [];

//the scope of this in this function is the same as UserSocket
function broadcast(message) {
  UserSocket.prototype.userSocketList.forEach(function (client) {
    // Don't want to send it to sender
    // if (client === sender) return;
    client.write(JSON.stringify(message));
  });
  // Log it to the server output too
  process.stdout.write(JSON.stringify(message) + "\n")
}

function personalcast(message) {
  this.userSocket.write(JSON.stringify(message));
}

module.exports = UserSocket;
