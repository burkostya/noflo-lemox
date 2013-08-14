var socket = require('noflo').internalSocket;
var expect = require('chai').expect;

var Select = require('../components/Select.js');

describe('Select component', function() {
  var c, ins, node, out, err;
  beforeEach(function() {
    c    = Select.getComponent();
    ins  = socket.createSocket();
    node = socket.createSocket();
    out  = socket.createSocket();
    err  = socket.createSocket();
    c.inPorts.in.attach(ins);
    c.inPorts.node.attach(node);
    c.outPorts.out.attach(out);
    c.outPorts.error.attach(err);
  });
  it('should parse xml', function(done) {
    var xml1 = [
      '<root>',
        '<el id="first"></el>',
        '<el>text'
    ].join('');
    var xml2 = [
          '</el>',
        '<el />',
      '</root>'
    ].join('');
    var elements = [];
    out.on('data', function (data) {
      elements.push(data);
    });
    out.on('disconnect', function () {
      expect(elements).to.have.length(3);
      expect(elements[0]).to.have.property('attributes');
      expect(elements[0].attributes.id).to.equal('first');
      expect(elements[1]).to.have.property('text');
      expect(elements[1].text).to.equal('text');
      expect(elements[2]).to.have.property('name');
      expect(elements[2].name).to.equal('el');
      expect(elements[2].isSelfClosing).to.be.true;
      done();
    });
    node.send('el');
    ins.send(xml1);
    ins.send(xml2);
    ins.disconnect();
  });
  it('should emit error dor bad xml', function(done) {
    var xml = [
      '<root>',
        '<el id="first"></el>',
        '<el>text',
      '</root>'
    ].join('');
    var error;
    err.on('data', function (err) {
      error = err;
    });
    out.on('disconnect', function () {
      expect(error).to.exist;
      done();
    });
    node.send('el');
    ins.send(xml);
    ins.disconnect();
  });
});
