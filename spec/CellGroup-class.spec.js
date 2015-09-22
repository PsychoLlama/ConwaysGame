/*globals require, describe, beforeEach, Map, it, expect */
'use strict';
var CellGroup = require('../CellGroup.js').CellGroup;

describe('The cell group', function () {
  var cells;

  beforeEach(function () {
    cells = new CellGroup();
  });

  /*
  constructor with no arguments
  constructor with String argument
  constructor with Array argument
  constructor with CellGroup argument
  add a String
  add an Array of Strings
  add a CellGroup
  */

  describe('constructor', function () {

    it('with no arguments should create an empty cell group', function () {
      expect(cells.length).toBe(0);
    });

    it('should accept an array', function () {
      cells = new CellGroup([
        '0:0',
        '0:1',
        '0:1',
        '0:3'
      ]);
      expect(cells.length).toBe(3);
    });
  });

  it('should compare in Jasmine', function () {
    var a = new CellGroup();
    var b = new CellGroup();
    a.add("1:0");
    a.add("1:1");
    a.add("1:2");
    b.add("1:0");
    b.add("1:1");
    b.add("1:2");
    expect(a).toEqual(b);
  });

  it('should only add new cells', function () {
    cells.add('1:1')
      .add('1:1')
      .add('1:5')
      .add('1:1')
      .add('1:1')
      .add('1:1');
    expect(cells.length).toBe(2);
  });

  it('should accept an array of cells', function () {
    cells = new CellGroup([
      '1:1',
      '1:2',
      '2:1',
      '2:2'
    ]);
    expect(cells.length).toBe(4);
  });

  it('should not add wrong types', function () {
    cells.add([
      '1:1',
      '1:2',
      '2:1',
      '2:2'
    ]);
    expect(cells.length).toBe(4);
  });

});
