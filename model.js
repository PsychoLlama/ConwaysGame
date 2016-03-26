/*globals exports, require, parseInt, CellGroup, console*/
/*jslint plusplus: true*/
var model,
	delimiter;
var CellGroup = require('./CellGroup').CellGroup;

// MODEL
(function () {
	'use strict';
	delimiter = ":";
	model = {
		liveCells: new CellGroup(),
		cellHistory: new CellGroup(),
		numOfCurrentGen: 0,

		reset: function () {
			this.liveCells = new CellGroup();
			this.cellHistory = new CellGroup();
			return this;
		},

		getCoord: function (x, y) {
			return x + delimiter + y;
		},

		killCell: function (coord) {
			delete this.liveCells[coord];
		},

		createCell: function (coord) {
			this.liveCells.add(coord);
			this.cellHistory.add(coord);
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
        this.getCoord(x - 1, y - 1),
        this.getCoord(x - 1, y + 0),
        this.getCoord(x - 1, y + 1),
        this.getCoord(x + 0, y - 1),
        this.getCoord(x + 0, y + 1),
        this.getCoord(x + 1, y - 1),
        this.getCoord(x + 1, y + 0),
        this.getCoord(x + 1, y + 1)
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
					self.cellHistory.add(cell);
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
					self.cellHistory.add(cell);
				}
			});

			this.liveCells = nextGeneration;
			this.numOfCurrentGen++;
//			console.count("Generation Number");

			return this;
		}
	};


}());

if (typeof module === 'object') {
	module.exports = {
		model: model,
		delimiter: delimiter
	};
}