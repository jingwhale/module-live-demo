/**
 * ------------------对象合并--------------------------
 * 
 * @module extend
 * @version  1.0
 * @author   hzliujunwei(hzliujunwei@corp.netease.com)
 * @path     pro/common/extend
 * --------------------------------------------------------
 */

NEJ.define(['./adapter/nej.js'], function() {
    /**
    * 判断是否为某个类型对象
    * @method isType
    * @param {String} type 要判断的类型
    */
    function isType(type){
        return function(obj){
            return Object.prototype.toString.call(obj) === '[object '+ type +']';
        }
    }

    var isFunc = isType('Function');
    var isObj = isType('Object');
    var isBool = isType('Boolean');
    var isArr = isType('Array');

    function isWindow(obj){
        return (window === obj);
    }

    /**
    *判断plain对象
    * @method isPlainObject
    */
    function isPlainObject(obj){
        if(!isObj(obj) || obj.nodeType || isWindow(obj)){
            return false;
        }

        if(obj.constructor && !obj.constructor.prototype.hasOwnProperty('isPrototypeOf')){
            return false;
        }

        return true;
    }

    /**
     * 对象合并
     * @method extend
     * @param  {Boolean} _bool    是否深度复制
     * @param  {Object|String|Number|Boolean} _args1被返回的对象
     * @param  {Object|String|Number|Boolean} _args2需要复制的对象

     * @return {Object|String|Number|Boolean} 被返回的对象
     *
     * @example 例: extend(true, {}, {}, {});
     */
     
    function extend(){
        var args = arguments,
            i = 1,
            deep = false,
            target = args[0],
            length = args.length,
            p,
            clone,
            options,
            src,
            copyIsArray,
            copy;

        if(isBool(args[0])){
            deep = args[0];
            target = args[1];
            i++;
        }

        if(i === length){
            return args[0];
        }
        if(typeof target !== 'object' && !isFunc(target)){
            target = {}
        }
        for(; i<length; i++){
            if((options = args[i]) != null){
                for(p in options){
                    src = target[p];
                    copy = options[p];
                    if(src === copy){
                        continue;
                    }
                    if(deep && copy && (isPlainObject(copy) || (copyIsArray = isArr(copy)))){
                        if(copyIsArray){
                            copyIsArray = false;
                            clone = src && isArr(src) ? src : [];
                        }else {
                            clone = src && isPlainObject(src) ? src : {};
                        }
                        target[p] = extend(deep, clone, copy);
                    }else {
                        target[p] = copy;
                    }

                }
            }

        }

        return target;
    }

    return extend;
});
