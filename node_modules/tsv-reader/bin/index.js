#!/usr/bin/env node

const tsvReader = require('../lib/tsvReader');

const arguments = process.argv.splice(2);
const tsvFilename = arguments[0];
const tsvFilenameWithoutExt = tsvFilename.split('.').shift();

const column = arguments[1];

tsvReader.read(tsvFilenameWithoutExt, column);