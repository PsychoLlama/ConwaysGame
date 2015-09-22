/*globals exports, require, parseInt, CellGroup*/
var model,
  delimiter;

// MODEL
(function () {
  'use strict';
  delimiter = ":";

  model = {
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
          count += 1;
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
        var cellNeighbors = self.getNeighbors(cell),
          liveNeighbors = self.getNumLiveNeighbors(cell);
        neighbors.add(cellNeighbors);

        if (liveNeighbors === 2 || liveNeighbors === 3) {
          nextGeneration.add(cell);
        }
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


}());
