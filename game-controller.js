// CONTROLLER
var game = {
  relayGameClick: function(e) {
    var x = e.layerX,
      y = e.layerY;
//      row = view.getRow(y),
//      col = view.getCol(x),
//      coor;
    view.toggleCell(x, y);
  }
};
document.querySelector('canvas').addEventListener('click', game.relayGameClick);