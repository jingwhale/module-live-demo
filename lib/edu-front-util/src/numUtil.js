/**
 * ----------------------数字格式化util-----------------------
 * 
 * @module numUtil
 * @version  1.0
 * @author   hzliujunwei(hzliujunwei@corp.netease.com)
 * @path     pro/common/numUtil
 * --------------------------------------------------------
 */

NEJ.define(['./adapter/nej.js'], function (_adapter) {
    
    var _module = {},
        g = (function(){return this;})();
    var isNum = function(_num){
        return (isType('Number'))(_num) && _num === _num;
    };

    function isType(type){
        return function(obj){
            return Object.prototype.toString.call(obj) === '[object '+ type +']' ;
        }
    }

    /**
     * 格式化货币显示
     * @method _$formatNum
     * @param  {Number} _maxNum 需要格式化的数字
     * @param  {String} cUnit 货币单位
     * @return {Number} 格式化后的数字,默认和异常都为0
     */
    _module._$formatNum = function(_maxNum, cUnit){
        return function(_num){
            var _retNum;
            _num = +_num;
            if(!isNum(_num)){
                return 0;
            }
            var _tenthMaxNum = _maxNum / 10;
            //4.0万的时候会显示成4万，4.1万会显示4.1万
            _retNum = _num > _maxNum ? (_num % _maxNum >= _tenthMaxNum ? (_num / _maxNum).toFixed(1) : (_num / _maxNum).toFixed(0)) : _num;
            //_retNum = _num > _maxNum ? (_num / _maxNum).toFixed(1) : _num;
            return (_num > _maxNum)?(_retNum + cUnit):_retNum;
        }
    };

    _module._$num10000 = _module._$formatNum(10000, '万');

    /**
     * 格式化计算文件大小
     * @method _$formatFileSize
     * @param  {Number} _bytes 字节数
     * @return string
     */
    _module._$formatFileSize = function(_bytes){
        if (_bytes === 0) return '0B';

        var _k = 1024;

        var _sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        
        var _i = Math.floor(Math.log(_bytes) / Math.log(_k));
        
        return (_bytes / Math.pow(_k, _i)).toFixed(2) + _sizes[_i];
    };

      
    return _module;
});
