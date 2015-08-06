#!/usr/bin/env node

var spawn = require("child_process").spawn;
var args = process.argv.slice(2);
var child = spawn(process.execPath, [ "--harmony", __dirname +  "/bin/main" ].concat(args), {
    cwd: process.cwd(),
    stdio: [0,1,2]
});

if (child.stdout) {
    child.stdout.on("data", function( data ) {
        console.log(data);
    });
}

if (child.stdout) {
    child.stderr.on("data", function( data ) {
        console.error(data);
    });
}

