/*jslint node: true*/
// CONTROLLER
var view = require("./view");
var model = require("./model").model;

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
				window.innerWidth - controlsWidth,
				window.innerHeight - 5
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
//			view.render();

		},

		running: false,

		step: function () {
			model.next();
//			view.render();
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
