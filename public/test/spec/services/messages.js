'use strict';

describe('Service: Messages', function () {

  // load the service's module
  beforeEach(module('appApp'));

  // instantiate service
  var Messages;
  beforeEach(inject(function (_Messages_) {
    Messages = _Messages_;
  }));

  it('should do something', function () {
    expect(!!Messages).toBe(true);
  });

});
