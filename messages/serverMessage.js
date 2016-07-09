function ServerMessage() {
    // this.operation = operation;
    // this.message = message;
}

ServerMessage.prototype.setInfo = function (name, message) {
    this.operation = 'inform';
    this.name = name;
    this.message = message;
}

ServerMessage.prototype.setChat = function (name, message) {
    this.operation = 'chat';
    this.name = name;
    this.message = message;
}

ServerMessage.prototype.setNotice = function (message) {
    this.operation = 'notice';
    this.message = message;
}

module.exports = ServerMessage;
