/**
 * srt字幕解析类
 */
NEJ.define([

], function(p, o, f, r){

    var _parseSrt = function(_data){
        var _arr = [{begin:0,text:''}];
            
        // Trim whitespace and split the list by returns.
        _data = _data.replace(/^\s+/, '').replace(/\s+$/, '');
            
        var lst = _data.split("\r\n\r\n");
            
        if(lst.length == 1) { 
            lst = _data.split("\n\n"); 
        }
            
        for(var i=0; i<lst.length; i++) {
            // Parse the caption
            var _obj = _parseCaption(lst[i]);
            
            if(_obj['text']) {
                _arr.push(_obj);
                // Insert empty caption at the end.
                if(_obj['end']) {
                    _arr.push({begin:_obj['end'],text:''});
                    delete _obj['end'];
                }
            }
        }
        
        return _arr;
    }

    /** 
      * 解析单行srt
      * @param _str
      * @return object {begin:xxx,end:xxx,text:xxx}
      */
    var _parseCaption = function(_str) {
        var _obj = {};
        var _arr = _str.split("\r\n"); 
        
        if(_arr.length == 1) { _arr = _str.split("\n"); }
        
        try {
            // First line contains the start and end.
            var _idx = _arr[1].indexOf(' --> ');
            if(_idx > 0) {
                _obj['begin'] = _getSeconds(_arr[1].substr(0,_idx));
                _obj['end'] = _getSeconds(_arr[1].substr(_idx+5)); 
            }
            // Second line starts the text.
            if(_arr[2]) {
                _obj['text'] = _arr[2];
                // Arbitrary number of additional lines.
                for (var _i = 3; _i < _arr.length; _i++) {
                    _obj['text'] += '\n'+_arr[_i];
                }
            }
        } catch (err) {}

        return _obj;
    };

    // 格式化srt文件中的时间，转化为秒
    var _getSeconds = function(_str) {
        _str = _str.replace(',', '.');
            
        var _arr = _str.split(':');
        var _sec = 0;

        if (_str.substr(-2).toLocaleLowerCase() == 'ms') {
            _sec = Number(_str.substr(0, _str.length - 2)) / 1000;
        } else if (_str.substr(-1).toLocaleLowerCase() == 's') {
            _sec = Number(_str.substr(0, _str.length - 1));
        } else if (_str.substr(-1).toLocaleLowerCase() == 'm') {
            _sec = Number(_str.substr(0, _str.length - 1)) * 60;
        } else if (_str.substr(-1).toLocaleLowerCase() == 'h') {
            _sec = Number(_str.substr(0, _str.length - 1)) * 3600;
        } else if (_arr.length > 1) {
            _sec = Number(_arr[_arr.length - 1]);
            _sec += Number(_arr[_arr.length - 2]) * 60;
        
            if (_arr.length == 3) {
                _sec += Number(_arr[_arr.length - 3]) * 3600;
            }
        } else {
            _sec = Number(_str);
        }

        return _sec;
    }

    p.parseSrt = _parseSrt;
    
    // 返回结果可注入给其他文件
    return p;
});
