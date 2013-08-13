var util = require('util');

var noflo     = require('noflo');
var Port      = noflo.Port;
var Component = noflo.Component;

var Lemox = require('lemox');

var Select = function() {
  var self = this;
  Component.call(Select);
  self.inPorts = {
    "in":    new Port(),
    element: new Port()
  };
  self.outPorts = {
    out:   new Port(),
    error: new Port()
  };

  var parser;
  self.inPorts.in.on('data', function (data) {
    parser.write(data);
  });
  self.inPorts.in.on('disconnect', function () {
    parser.end();
  });
  self.inPorts.element.on('data', function (data) {
    parser = new Lemox({ selector: data });
    parser.on('readable', function () {
      self.outPorts.out.send(parser.read());
    });
    parser.on('end', function () {
      self.outPorts.out.disconnect();
    });
    parser.on('error', function (err) {
      self.outPorts.error.send(err);
    });
  });
};

util.inherits(Select, Component);

exports.getComponent = function() {
  return new Select();
};
