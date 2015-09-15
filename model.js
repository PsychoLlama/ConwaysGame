/*globals exports, Map*/
var model = {
  grid: new Map(),

  reset: function () {
    this.grid = new Map();
    return this;
  },

  next: function () {
    return this;
  }
};

exports.model = model;