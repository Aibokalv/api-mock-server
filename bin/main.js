#!/bin/sh ":" //# comment; exec /usr/bin/env node --harmony "$0" "$@"

var program = require('commander');
var path = require('path');

program
    .version('0.0.1')
    .option('-c, --config [path]', '设置配置文件', path.join(process.cwd(), 'mock-config.js'))
    .parse(process.argv);


require('./init')(require(program.config));