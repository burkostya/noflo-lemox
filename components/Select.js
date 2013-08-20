var util = require('util');

var noflo     = require('noflo');
var Port      = noflo.Port;
var Component = noflo.AsyncComponent;

var Lemox = require('lemox');

var Select = function() {
  var self = this;

  self.inPorts = {
    "in": new Port('string'),
    node: new Port('string')
  };
  self.outPorts = {
    out:   new Port('object'),
    error: new Port('string'),
    drain: new Port('bang')
  };
  var parser;
  self.doAsync = function(xml, done) {
    var res = parser.write(xml);
    if (res) {
      process.nextTick(function () {
        self.outPorts.drain.send(true);
      });
    }
    done();
  };

  Component.call(this);

  self.inPorts.in.on('disconnect', function () {
    parser.end();
  });
  self.inPorts.node.on('data', function (data) {
    parser = new Lemox({ selector: data });
    parser.on('readable', function () {
      self.outPorts.out.send(parser.read());
    });
    parser.on('end', function () {
      self.outPorts.out.disconnect();
    });
    parser.on('drain', function () {
      self.outPorts.drain.send(true);
    });
    parser.on('error', function (err) {
      if (self.outPorts.error.isAttached()) {
        self.outPorts.error.send(err);
        self.outPorts.error.disconnect();
      }
    });
  });
};

util.inherits(Select, Component);

exports.getComponent = function() {
  return new Select();
};
