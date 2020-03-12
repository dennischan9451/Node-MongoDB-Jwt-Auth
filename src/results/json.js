class JsonResult {
  constructor(data) {
    Object.keys(data || {}).forEach((key) => {
      this[key] = data[key];
    });
  }
}

module.exports = JsonResult;
