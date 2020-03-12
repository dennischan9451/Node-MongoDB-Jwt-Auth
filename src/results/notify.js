const JsonResult = require('./json');

class NotifyResult extends JsonResult {
  constructor(message, data) {
    super(data);

    this.message = message;
  }
}

module.exports = NotifyResult;
