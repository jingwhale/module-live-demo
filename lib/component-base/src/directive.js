/**
 *  通用指令
 *
 *  @version  1.0
 *  @author   cqh <hzchenqinhui@corp.netease.com>
 *  @module   pool/component-base/src/directive
 */

NEJ.define([
    'pool/component-editor/src/editor/eduEditor/parseUtil'
],function(
    ParseUtil,
    _p
){
    //富文本过滤（添加class等）
    _p["r-rhtml"] = function(elem, value){
        elem.className = elem.className + ' f-richEditorText';  //该类名全局给加上了富文本中用到的样式
        this.$watch(value, function(val){
            ParseUtil._$renderRich(elem, val);
        });
    };
});

