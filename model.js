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

  alive: function (cell) {
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

  next: function () {
    var neighbors = new CellGroup(),
      deadNeighbors = new CellGroup(),
      nextGeneration = new CellGroup();


    this.liveCells.each(function (cell) {
      var cellNeighbors = this.getNeighbors(cell);
      neighbors.add(cellNeighbors);
    });

    neighbors.each(function (cell) {
      if (!this.alive(cell)) {
        deadNeighbors.add(cell);
      }
    });

    deadNeighbors.each(function (cell) {
      if (this.getNeighbors(cell).length === 3) {
        nextGeneration.add(cell);
      }
    });

    this.liveCells = nextGeneration;
    return this;
  }
};

exports.model = model;
exports.delimiter = delimiter;
