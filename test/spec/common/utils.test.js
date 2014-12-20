'use strict';

describe('factory: Utils', function(){
  var Utils, scope;
  
  beforeEach(module('app')); // load the controller's module

  beforeEach(inject(function(_Utils_){
    Utils = _Utils_;
  }));
  
  it('should generate an identifier', function(){
    var id = Utils.createUuid();
    expect(id.length).toBe(36);
  });
  
  it('should generate a random identifier', function(){
    var id1 = Utils.createUuid();
    var id2 = Utils.createUuid();
    expect(id1).not.toBe(id2);
  });
});
