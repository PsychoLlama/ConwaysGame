/*globals exports*/
/*
  reset
  play
  zoom
  step
  toggle cell
*/

var view,
  canvas = document.querySelector('canvas'),
  ctx = canvas.getContext('2d');

(function () {
  'use strict';

  view = {
    port: {
      x: 0,
      y: 0
    },

    scale: 1,

    cell: {
      width: 20
    },

    borderWidth: .08,

    drawGridLines: function() {
      var row,
          col,
          cellHeight = view.cell.height + view.borderWidth,
          cellWidth = view.cell.width + view.borderWidth;

      ctx.beginPath();
      for (row = 0; row < canvas.height / cellHeight; row++) {
        if (row === 0) {
          ctx.moveTo(col * view.cell.height, 0);
          ctx.lineTo(col * view.cell.height, canvas.height);
        } else {
          ctx.moveTo(0, row * cellHeight);
          ctx.lineTo(canvas.width, row * cellHeight);
        }
      }
      for (col = 1; col < canvas.width / cellWidth; col++) {
        if (col === 1) {
          ctx.moveTo(col * view.cell.width, 0);
          ctx.lineTo(col * view.cell.width, canvas.height);
        } else {
          ctx.moveTo(col * cellWidth, 0);
          ctx.lineTo(col * cellWidth, canvas.height);
        }
      }
      ctx.lineWidth = view.borderWidth;
      ctx.strokeStyle = "#303438"
      ctx.stroke();
      ctx.closePath;
    }
  };

}());

view.cell.height = view.cell.width;
view.drawGridLines();
