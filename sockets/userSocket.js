operationList = {};

function UserSocket(socket) {
  this.socket = socket;
  this.userSocketList.push(socket);
};

UserSocket.prototype.userSocketList = [];

UserSocket.prototype.onData = function () {
  this.socket.on('data', function (data) {

    messageArray = data.toString().split('\n');

    messageArray.forEach(function (message) {
      if (message.length == 0) return;

      var json_data = JSON.parse(message);

      var operation = json_data.operation;

      if (typeof operationList[operation] === 'function'){
        operationList[operation](json_data.data);
      }
      else {
        console.log('command ' + operation + ' is not defined');
      }
    });


  });
}

operationList.chat = function (data) {
  this.id = data;

  console.log('test socket : ' + this.id);
};

operationList.inform = function (data) {

};

module.exports = UserSocket;
