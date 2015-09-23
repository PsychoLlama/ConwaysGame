/*globals model, view*/
// CONTROLLER
var game;
(function () {
  'use strict';
  game = {
    init: function () {
      view.render();

      document.getElementsByTagName('canvas')[0]
        .addEventListener('click', game.relayGameClick);
      document.getElementById('step')
        .addEventListener('click', function () {
          game.running = false;
          game.step();
        });
      document.getElementById('toggle')
        .addEventListener('click', game.toggle);

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

  game.init();
}());
