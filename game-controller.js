/*globals model, view*/
// CONTROLLER
var game;
(function () {
  'use strict';
  game = {
    init: function () {
      view.render();

      var controlsWidth = 250;

      view.setCanvasDimensions(
        window.innerWidth - controlsWidth,
        window.innerHeight - 5);

      document.querySelector('#gameControls').style.width = controlsWidth + 'px';

      get('canvas').listen('click', game.relayGameClick);
      get('#stepButton').listen('click', function () {
        game.running = false;
        game.step();

      });
      get('#runPauseButton').listen('click', game.toggle);
      get('#resetButton').listen('click', function () {
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
      } else {
        model.createCell(cellCoord);
      }
      view.render();

    },

    running: false,

    step: function () {
      model.next();
      view.render();

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

  function get(selector) {
    var target = document.querySelector(selector);

    return {
      listen: function (event, handler) {
        target.addEventListener(event, handler);
        return this;
      }
    }
  }

  game.init();
}());
