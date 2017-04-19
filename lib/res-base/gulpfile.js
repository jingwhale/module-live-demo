/**
 * 自动生成字体图标
 */
var gulp = require('gulp');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');
var rename = require('gulp-rename');
var async = require('async');
var ejs = require('ejs');
var fs = require('fs');

var fontName = 'ux-icon-edu';

gulp.task('icon', function(done){
    var iconStream = gulp.src(['svg/*.svg'])
        .pipe(iconfont({
            fontName: fontName,
            prependUnicode: true,
            startUnicode: 0xE001,
            formats: ['svg','ttf', 'eot', 'woff'],
            normalize : true,
            centerHorizontally: true,
            fontHeight: 1024 // must need for perfect icon
        }));

        async.parallel([
        function handleGlyphs (cb) {
            iconStream.on('glyphs', function(glyphs, options) {
                glyphs.forEach(function(glyph, idx, arr) {
                    arr[idx].codePoint = glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase()
                });
                gulp.src('template/iconTemplate.css')
                    .pipe(consolidate('lodash', {
                        glyphs: glyphs,
                        fontName: fontName,
                        fontPath: '../res/res-base/fonts/',
                        cssClass: 'ux-icon'
                    }))
                    .pipe(rename("icons.scss"))
                    .pipe(gulp.dest('scss'))
                    .on('finish', cb);
            })
        },
        function handleFonts (cb) {
            iconStream.pipe(gulp.dest('res/res-base/fonts'))
                .on('finish', cb);
        }
    ], done);
});

gulp.task('demo', function(){
    Promise.all([
        readFile('./css/icons.css'),
        readFile('./template/demoTemplate.html')
    ]).then(function (values) {
        var data = {
            total: 0,
            arr: []
        };
        // window \r\n and linux \n
        values[0].replace(/\.(ux-icon-.+):before.+\r?\n.+"\\(.+)"/g, function ($0, $1, $2) {
            var obj = {};
            obj.key = $1;
            obj.value = $2;
            data.arr.push(obj);
            data.total++;
        });
        if(!fs.existsSync('./demo')){fs.mkdirSync('./demo');}
        fs.writeFileSync('./demo/demo.html', ejs.render(values[1], data), 'utf8');

    }).catch(function(err){
        console.log(err);
    });

});

function readFile (fileName) {
    return new Promise(function(resolve, reject) {
        fs.readFile(fileName, 'utf8', function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = gulp;
