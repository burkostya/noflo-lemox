# noflo-lemox
[![Build Status](https://travis-ci.org/burkostya/noflo-lemox.png?branch=master)](https://travis-ci.org/burkostya/noflo-lemox) [![Dependency Status](https://gemnasium.com/burkostya/noflo-lemox.png)](https://gemnasium.com/burkostya/noflo-lemox) [![NPM version](https://badge.fury.io/js/noflo-lemox.png)](http://badge.fury.io/js/noflo-lemox)

NoFlo components for xml.

## Components

### Select

Parse xml into objects by selector.

#### In ports:

- NODE: name of nodes that will be thrown to OUT port
- IN: chunks of xml

#### Out ports:

- OUT: object with next fields: name, attributes, text, isSelfClosing
- DRAIN: emits `true` when component can consume more xml
- ERROR: error