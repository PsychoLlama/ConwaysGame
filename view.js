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

    color: {
      untouched: '#FFFFFF',
      live: '#88FF88',
      ghost: '#444444'
    },

    scale: 1,

    cell: {
      width: 20
    },

    borderWidth: 0.08,

    drawGridLines: function () {
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
      ctx.strokeStyle = "#303438";
      ctx.stroke();
      ctx.closePath();
    },

    toggleCell: function (x, y) {
      var cellHeight = view.cell.height + view.borderWidth,
        cellWidth = view.cell.width + view.borderWidth,
        row = Math.floor(x / cellHeight),
        col = Math.floor(y / cellWidth),
        topPixel = row * cellHeight,
        leftPixel = col * cellWidth;
      ctx.fillStyle = view.color.live;
      ctx.fillRect(topPixel, leftPixel, view.cell.width, view.cell.height);
    }
  };

}());

view.cell.height = view.cell.width;
view.drawGridLines();