/*globals require, describe, beforeEach, it, expect */
/*jslint node: true*/
'use strict';
var CellGroup = require('../CellGroup.js'),
  ModelExports = require('../model.js'),
  model = ModelExports.model,
  delimiter = ModelExports.delimiter;

describe('The next generation', function () {
  var expectedCells,

    // Run Test method
    runTest = function () {
      expect(model.next().liveCells).toEqual(expectedCells);
    },

    makeCells = function (cellsArray) {
      var liveCells = [];
      cellsArray.forEach(function (xArray, y) {
        xArray.forEach(function (cell, x) {
          if (cell) {
            var coord = x + delimiter + y;
            liveCells.push(coord);
          }
        });
      });
      return liveCells;
    };

  beforeEach(function () {
    model.reset();
    expectedCells = new CellGroup();
  });

  it('should be empty after empty', function () {
    runTest();
  });

  it('should be empty after one live cell', function () {
    model.liveCells.add('1:1');
    runTest();
  });

  it('should create one live cell after three live neighbors', function () {

    model.liveCells.add(makeCells([
      [1, 0, 1],
      [0, 0, 0],
      [0, 0, 1]
    ]));

    expectedCells.add(makeCells([
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0]
    ]));

    runTest();
  });

  it('should create two live cells to make a spinner after two live neighbors', function () {
    model.liveCells.add(makeCells([
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0]
    ]));

    expectedCells.add(makeCells([
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ]));

    runTest();
  });

  it('should not kill off cells with three neighbors', function () {
    model.liveCells.add(makeCells([
      [1, 1],
      [1, 1]
    ]));

    expectedCells.add(makeCells([
      [1, 1],
      [1, 1]
    ]));

    runTest();
  });

  it('allow gliders', function () {
    model.liveCells.add(makeCells([
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [1, 0, 1, 0],
      [0, 0, 1, 0]
    ]));

    expectedCells.add(makeCells([
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 1, 1],
      [0, 1, 0, 0]
    ]));

    runTest();
  });

});
