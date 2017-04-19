
var exec = require('child_process').exec;
//var file = process.argv[2];

exec(
    'cp -rf ./ux-icon-edu/fonts/* ./res/res-base/fonts ' +
    '&& cp -rf ./ux-icon-edu/*  ./res/res-base/fonts/backup ' +
    '&& rm -rf ./ux-icon-edu');

