/**
 * --------------------------------------------------------
 * 校验相关工具方法
 * @version  1.0
 * @author   cqh(hzchenqinhui@corp.netease.com)
 * @path    pool/edu-front-util/src/validateRulesUtil
 * --------------------------------------------------------
 */
NEJ.define([
    './objectUtil.js'
], function(
    _objectUtil,
    _p){

    /**
     * 引入一个文件的所有校验rules并挂载到UI.data上,其中method方法会绑定组件this上下文环境
     * @param validateRules  允许的权限列表数组
     * @param UI
     * @return void
     */
    _p._$importRules = function(validateRules,UI){
        // 加载校验规则
        for(var key in validateRules){
            // 绑定method函数执行上下文
            if(validateRules.hasOwnProperty(key)){
                var rules = [];
                validateRules[key].forEach(function(value){
                    if(value.type == 'method'){
                        // 不共享method
                        var newValue = _objectUtil._$deepCopy(value);
                        newValue.method = newValue.method._$bind(UI);
                        rules.push(newValue);
                    }else {
                        rules.push(value);
                    }
                });
                UI.data[key] = rules;
            }
        }
    };

    return _p;
});
