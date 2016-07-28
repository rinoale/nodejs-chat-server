var net = require('net');

var TestSocket = require('./sockets/testSocket.js');

var server = net.createServer(function (socket) {
  var testSocket = new TestSocket(socket);
  console.log('new socket connected');
  testSocket.onData();
});

server.listen(1337);

/////////////////////////


operationList = {};

function TestSocket(socket) {
  this.socket = socket;
};


TestSocket.prototype.onData = function () {
  this.socket.on('data', function (data) {

    console.log(data.toString().split('\n'));
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

operationList.setUser = function (data) {
  this.id = data;

  console.log('test socket : ' + this.id);
};

operationList.auth = function (data) {

};

module.exports = TestSocket;

