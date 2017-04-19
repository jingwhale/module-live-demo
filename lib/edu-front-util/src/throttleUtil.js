/**
 * -------------throttleUtil模块对象，用于函数节流----------------
 *
 * @module throttleUtil
 * @version  1.0
 * @author   hzliujunwei(hzliujunwei@corp.netease.com)
 * @path     eutil/throttleUtil
 * --------------------------------------------------------
 */

NEJ.define([], function () {


    var _module = {},
        g = (function(){return this;})();

    /**
     * 函数节流，某一周期时间内只执行一次，用于频繁被触发的函数提升性能
     * @method _$removeNRNBSP
     * @param {Function} _fn 逻辑函数
     * @param {Boolean} _firstTime 第一次是否执行
     * @param {Number} _delay 周期ms
     * @return {Function} 具体被执行的函数
     */
    _module._$throttle = function throttle(_fn, _firstTime, _delay){
        if(typeof arguments[1] === 'number'){
            _delay = _firstTime;
        }
        if(_firstTime === undefined || _firstTime === null){
            _firstTime = true;
        }
        if(_delay === undefined){
            _delay = 300;
        }
        var _timer;
        var _last;
        var _that = this,
            args,
            _now;
        function done(){
            _fn.apply(this, args);
            _last = _now;
            clearTimeout(_timer);
            _timer = null;
        }
        return function(){
            args = arguments;
            _now = +new Date();
            if(_firstTime){
                _firstTime = false;
                _fn.apply(this, args);
                return;
            }
            _last = _last || +new Date();
            if(_delay*2 > _now - _last >= _delay){
                done();
                return;
            }
            if(_timer){
                return;
            }
            _timer = setTimeout(function(){
                done();
            }, _delay);
        }
    };





    return _module;
});

