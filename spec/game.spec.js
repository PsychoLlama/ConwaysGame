/*globals require, describe, beforeEach, Map, it, expect */
var model = require('../model.js').model;

describe('The grid', function () {
  var expectedMap;

  beforeEach(function () {
    model.reset();
    expectedMap = new Map();
  });

  it('should be empty after empty', function () {
    //    expectedMap.add('0:0');
    expect(model.next().grid).toEqual(expectedMap);
  });

});