/*globals */
/*jslint node: true, es5: true */

// THE CELLGROUP

'use strict';
var CellGroup = function (cells) {
  this.add(cells);


  Object.defineProperty(this, 'length', {
    get: function () {
      return Object.keys(this).length;
    }
  });
};

var addArray = function (cells, cellGroup) {
  if (cells === undefined || cells.constructor !== Array) {
    return;
  }

  if (cells.constructor === Array) {
    cells.forEach(function (cell) {
      cellGroup.add(cell);
    });
  }
};

CellGroup.prototype = {

  constructor: CellGroup,

  add: function (cell) {
    if (cell === undefined) {
      return this;
    }
    if (cell.constructor === Array) {
      return addArray(cell, this);
    }
    if (cell.constructor !== String) {
      return this;
    }
    if (this[cell] === undefined) {
      this[cell] = cell;
    }
    return this;
  },

  each: function (callback) {
    var cell,
      results = new CellGroup();

    for (cell in this.liveCells) {
      if (this.liveCells.hasOwnProperty(cell)) {
        results.add(callback(cell, this));
      }
    }
    return results;
  }
};

exports.CellGroup = CellGroup;
