var socket = require('noflo').internalSocket;
var expect = require('chai').expect;

var Select = require('../components/Select.js');

describe('Select component', function() {
  var c, ins, el, out, err;
  beforeEach(function() {
    c   = Select.getComponent();
    ins = socket.createSocket();
    el  = socket.createSocket();
    out = socket.createSocket();
    err = socket.createSocket();
    c.inPorts.in.attach(ins);
    c.inPorts.element.attach(el);
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
    el.send('el');
    ins.send(xml1);
    ins.send(xml2);
    ins.disconnect();
  });
});
