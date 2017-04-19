/**
 * log工具类
 */
NEJ.define([

], function(p, o, f, r){

    var _logFlag = false;
    var _externLogFn = null; // 暂时不用

    p.init = function(_playerConfig){
    	if (_playerConfig.isLocal) {
    		_logFlag = true;
            _externLogFn = _playerConfig.onLogInfo; 
    	};
    }

    p.info = function(_str){
        if(!_logFlag) return;
        console.log('[INFO]' + _str);
    }

    p.warn = function(_str){
        if(!_logFlag) return;
        console.log('[WARN]' + _str);
    }

    p.error = function(_str){
        if(!_logFlag) return;
        console.log('[ERROR]' + _str);
    }

    // 可以只传一个对象参数
    p.infoObj = function(_str, _obj){
        if(!_logFlag || !console.table) return;
        
        if(_obj != undefined){
            console.log('[INFO]' + _str);
            console.table(_obj);
        }else{
            console.table(_str);
        }
    }
	    
	// 返回结果可注入给其他文件
    return p;
});
