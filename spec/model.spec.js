/*globals require, describe, beforeEach, it, expect */
/*jslint node: true*/
'use strict';
var CellGroupExports = require('../CellGroup.js'),
  model = require('../model.js').model,
  delimiter = CellGroupExports.delimiter,
  CellGroup = CellGroupExports.CellGroup;

describe('The next generation', function () {
  var expectedCells,
    runTest = function () {
      expect(model.next().liveCells).toEqual(expectedCells);
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

});
