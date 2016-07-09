function ClientMessage() {
    // this.operation = operation;
    // this.message = message;
}

ClientMessage.prototype.setInfo = function (message) {
    this.operation = 'inform';
    this.message = message;
}

ClientMessage.prototype.setChat = function (message) {
    this.operation = 'chat';
    this.message = message;
}

module.exports = ClientMessage;
