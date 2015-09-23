/*globals model, game*/
/*jslint plusplus: true */
/*

√ reset
√ play
√ stop
  zoom
√ step
√ toggle cell

*/

// Life would be easier if the cell border was part of it's height/width

var view,
  canvas = document.querySelector('canvas'),
  ctx = canvas.getContext('2d');

(function () {
  'use strict';

  view = {
    topLeftCellReference: {
      modelCellX: 0,
      modelCellY: 0
    },

    color: {
      untouched: '#EEE',
      live: 'green',
      ghost: '#ccc',
      grid: '#FFF'
    },

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

    borderWidth: 1,

    drawBorder: function (x, y) {
      ctx.lineWidth = view.borderWidth;
      ctx.strokeStyle = view.color.grid;
      ctx.strokeRect(x, y, view.cell.width, view.cell.height);
    },

    paintCell: function (col, row, color) {
      var cellHeight = view.cell.height + view.borderWidth,
        cellWidth = view.cell.width + view.borderWidth,
        topPixel = row * cellHeight,
        leftPixel = col * cellWidth;
      topPixel += view.borderWidth / 2;
      leftPixel += view.borderWidth / 2;

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

    cell: {}
  };

  view.cell.width = 10;
  view.cell.height = view.cell.width;
  view.render();
}());
