function Message() {
    // this.operation = operation;
    // this.message = message;
}

Message.prototype.setInfo = function (name, message) {
    this.operation = 'inform';
    this.name = name;
    this.message = message;
}

Message.prototype.setChat = function (name, message) {
    this.operation = 'chat';
    this.name = name;
    this.message = message;
}

Message.prototype.setNotice = function (message) {
    this.operation = 'notice';
    this.message = message;
}

module.exports = Message;
