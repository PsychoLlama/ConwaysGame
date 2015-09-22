/*globals exports, require, parseInt*/
/*jslint node: true */

// MODEL
'use strict';
var delimiter = ":";
var CellGroup = require('./CellGroup.js').CellGroup;
var model = {
  liveCells: new CellGroup(),

  reset: function () {
    this.liveCells = new CellGroup();
    return this;
  },

  isAlive: function (cell) {
    return !!this.liveCells[cell];
  },

  getNeighbors: function (cell) {
    var coordinates = cell.split(delimiter),
      x = coordinates[0],
      y = coordinates[1];

    x = parseInt(x, 10);
    y = parseInt(y, 10);
    return [
      x - 1 + delimiter + (y - 1),
      x - 1 + delimiter + (y + 0),
      x - 1 + delimiter + (y + 1),
      x + 0 + delimiter + (y - 1),
      x + 0 + delimiter + (y + 1),
      x + 1 + delimiter + (y - 1),
      x + 1 + delimiter + (y + 0),
      x + 1 + delimiter + (y + 1)
    ];
  },

  getNumLiveNeighbors: function (cell) {
    var count = 0,
      self = this;
    this.getNeighbors(cell).forEach(function (neighborCell) {
      if (self.isAlive(neighborCell)) {
        count++;
      }
    });
    return count;
  },

  next: function () {
    var neighbors = new CellGroup(),
      deadNeighbors = new CellGroup(),
      nextGeneration = new CellGroup(),
      self = this;


    this.liveCells.each(function (cell) {
      var cellNeighbors = self.getNeighbors(cell);
      neighbors.add(cellNeighbors);
    });

    neighbors.each(function (cell) {
      if (!self.isAlive(cell)) {
        deadNeighbors.add(cell);
      }
    });

    deadNeighbors.each(function (cell) {
      if (self.getNumLiveNeighbors(cell) === 3) {
        nextGeneration.add(cell);
      }
    });

    this.liveCells = nextGeneration;
    return this;
  }
};

exports.model = model;
exports.delimiter = delimiter;
