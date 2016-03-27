/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint node: true*/
	// CONTROLLER
	var view = __webpack_require__(1);
	var model = __webpack_require__(2).model;

	var game;
	(function () {
		'use strict';


		function get(selector) {
			var target = document.querySelector(selector);

			return {
				listen: function (event, handler) {
					target.addEventListener(event, handler);
					return this;
				}
			};
		}


		game = {
			init: function () {
				// We always need initial rendering
				view.render();

				var controlsWidth = 250;

				view.setCanvasDimensions(
					window.innerWidth,
					window.innerHeight - 6
				);

				document.querySelector('#gameControls').style.width = controlsWidth + 'px';

				get('canvas').listen('click', game.relayGameClick);
				get('#stepButton').listen('click', function () {
					game.running = false;
					game.step();
				});
				get('#runPauseButton').listen('click', game.toggle);
				get('#resetButton').listen('click', function () {
					// Keep this
					model.reset();
					view.render();
				});
			},

			relayGameClick: function (e) {
				var pixelX = e.layerX,
					pixelY = e.layerY,
					// get row and cell in the view
					row = view.getModelRefY(pixelY),
					col = view.getModelRefX(pixelX),
					cellCoord = model.getCoord(col, row),
					cellIsAlive = model.isAlive(cellCoord);

				if (cellIsAlive) {
					model.killCell(cellCoord);
					view.renderCell(cellCoord, view.color.ghost);
				} else {
					model.createCell(cellCoord);
					view.renderCell(cellCoord, view.color.live);
				}
			},

			running: false,

			step: function () {
				model.next();
				view.renderGroup(model.newAliveCells, view.color.live);
				view.renderGroup(model.newDeadCells, view.color.ghost);

				if (model.liveCells.length === 0) {
					game.stop();
				}
				if (game.running) {
					window.requestAnimationFrame(game.step);
				}
			},

			run: function () {
				game.running = true;
				game.step();
			},

			toggle: function () {
				game.running = !game.running;
				if (game.running === true) {
					game.step();
				}
			},

			stop: function () {
				game.running = false;
			}
		};

		game.init();
	}());


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint plusplus: true, node: true */
	/*

	√ reset
	√ play
	√ stop
	  zoom
	√ step
	√ toggle cell

	*/

	// Life would be easier if the cell border was part of it's height/width

	var model = __webpack_require__(2).model;
	var delimiter = __webpack_require__(2).delimiter;

	var view,
		canvas = document.querySelector('canvas'),
		ctx = canvas.getContext('2d');

	(function () {
		'use strict';

		view = {
			topLeftCellReference: {
				modelCellX: 4,
				modelCellY: 0
			},

			setCanvasDimensions: function (x, y) {
				canvas.width = x;
				canvas.height = y;
				view.render();
			},

			color: {
				untouched: '#EEE',
				live: 'green',
				ghost: '#ccc',
				grid: 'white'
			},

			borderWidth: 1,
			scale: 1,

			// Partial cell in the top left corner will change this
			getModelRefY: function (pixelY) {
				return view.getModelCoordY(Math.floor(pixelY / (view.cell.height + view.borderWidth)));
			},
			getModelRefX: function (pixelX) {
				return view.getModelCoordX(Math.floor(pixelX / (view.cell.width + view.borderWidth)));
			},

			getModelCoordX: function (col) {
				return col + view.topLeftCellReference.modelCellX;
			},

			getModelCoordY: function (row) {
				return row + view.topLeftCellReference.modelCellY;
			},

			drawBorder: function (x, y) {
				if (view.borderWidth === 0) {
					return;
				}
				ctx.lineWidth = view.borderWidth;
				ctx.strokeStyle = view.color.grid;
				ctx.strokeRect(x, y, view.cell.width, view.cell.height);
			},

			paintCell: function (col, row, color) {
				var cellHeight = view.cell.height + view.borderWidth,
					cellWidth = view.cell.width + view.borderWidth,
					topPixel = row * cellHeight,
					leftPixel = col * cellWidth;

				view.drawBorder(leftPixel, topPixel);
				ctx.fillStyle = color;
				ctx.fillRect(leftPixel, topPixel, view.cell.width, view.cell.height);
			},

			render: function () {
				var col, row,
					totalRows = Math.ceil(canvas.height / view.cell.height),
					totalCols = Math.ceil(canvas.width / view.cell.width),
					coordX, coordY, color, coord;

				for (row = 0; row < totalRows; row++) {
					for (col = 0; col < totalCols; col++) {
						// TODO: move getCoord interface to controller
						coordX = view.getModelCoordX(col);
						coordY = view.getModelCoordY(row);
						color = view.color.untouched;
						coord = model.getCoord(coordX, coordY);

						if (model.liveCells[coord]) {
							color = view.color.live;
						} else if (model.cellHistory[coord]) {
							color = view.color.ghost;
						} else {
							color = view.color.untouched;
						}
						view.paintCell(col, row, color);
					}
				}
			},

			renderCell: function (cell, color) {
				var col, row, coord;
				coord = cell.split(delimiter);
				col = coord[0] - view.topLeftCellReference.modelCellX;
				row = coord[1] - view.topLeftCellReference.modelCellY;

				view.paintCell(col, row, color);
			},

			renderGroup: function (group, color) {
				group.each(function (coord) {
					view.renderCell(coord, color);
				});
			},

			cell: {}
		};

		view.cell.width = 5;
		view.cell.height = view.cell.width;
		view.render();
	}());

	module.exports = view;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/*jslint plusplus: true, node: true*/
	var model, delimiter;
	var CellGroup = __webpack_require__(3);

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

				model.newDeadCells = new CellGroup();
				model.newAliveCells = new CellGroup();

				this.liveCells.each(function (cell) {
					var cellNeighbors = self.getNeighbors(cell),
						liveNeighbors = self.getNumLiveNeighbors(cell);
					neighbors.add(cellNeighbors);

					if (liveNeighbors === 2 || liveNeighbors === 3) {
						nextGeneration.add(cell);
						self.cellHistory.add(cell);
					} else {
						model.newDeadCells.add(cell);
					}
				});
				/*
				 * We could try to render these
				 * out as soon as they die...
				 **/

				neighbors.each(function (cell) {
					if (!self.isAlive(cell)) {
						deadNeighbors.add(cell);
					}
				});

				deadNeighbors.each(function (cell) {
					if (self.getNumLiveNeighbors(cell) === 3) {
						nextGeneration.add(cell);
						model.newAliveCells.add(cell);
						self.cellHistory.add(cell);
					}
				});
				/*
				 * ...and we could then render
				 * these as soon as they are born.
				 **/

				this.liveCells = nextGeneration;
				this.numOfCurrentGen++;
	//			console.count("Generation Number");

				return this;
			}
		};


	}());

	module.exports = {
		model: model,
		delimiter: delimiter
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*jslint es5: true, node: true*/

	var CellGroup;

	// THE CELLGROUP
	(function () {
		'use strict';
		CellGroup = function (cells) {
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
					//        TODO: validate string
				}
				if (this[cell] === undefined) {
					this[cell] = cell;
				}
				return this;
			},

			each: function (callback) {
				var cell, results = new CellGroup();

				for (cell in this) {
					if (this.hasOwnProperty(cell)) {
						results.add(callback(cell, this));
					}
				}
				return results;
			}
		};
	}());

	module.exports = CellGroup;


/***/ }
/******/ ]);
