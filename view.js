/*globals exports*/
/*
  reset
  play
  zoom
  step
  toggle cell
*/

var view;

(function () {
  'use strict';

  var canvas = document.getElementsByTagName('canvas')[0],
    context = canvas.getContext('2d'),
    cellWidth = 20,
    cellHeight = cellWidth;

  view = {
    render: function (cellGroup) {
      cellGroup.each(view.sendToCanvas);
    },
    sendToCanvas: function (cell) {
      view.drawCell(cell);
    },
    drawCell(cell) {

      context.rect();
    }
  };

}());
