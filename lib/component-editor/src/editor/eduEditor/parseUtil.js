/*
 * ------------------------------------------
 * uparse工具方法
 * @version  1.0
 * @author   hzwujiazhen(hzwujiazhen@corp.netease.com)
 * ------------------------------------------
 */

NEJ.define([
    '{lib}base/global.js', 
    '{lib}util/template/jst.js',
    './edueditor.parse.js'
], function(
        _global, 
        _jst, 
        _parse,
        _p){
    var _  = NEJ.P,
        _f = NEJ.F,
        _g = window,
        _e = _('nej.e'),
        _u = _('nej.u');

    /**
     * 渲染富文本的方法
     * _el  节点
     * _richStr 富文本内容
     */
    _p._$renderRich = (function(){
        if (!_g.uParse) {
            return null;
        };

        var _parseId = 0;

        // _richStr需要过滤
        return function(_el, _richStr){
            if (!_el) {
                return;
            };
            
            if (_richStr) {
                _el.innerHTML = _richStr;
            }
             
            var _selector;

            if (_el.id) {
                _selector = '#' + _el.id;
            }else{
                _selector = 'edueditor_styleclass_' + _parseId++;
                _e._$addClassName(_el, _selector);
                _selector = '.' + _selector;
            }
                
            //_g.uParse(_selector);
            _g.uParse2(_el, _selector);
        }

    })();

    //获取被转义后的text，安全
    _p._$renderRich2 = (function(){
        if (!_g.uParse) {
            return null;
        };

        var _parseId = 0;

        // _richStr需要过滤
        return function(_innerHTML){
            if(!_innerHTML){
                return;
            }

            var _el = document.createElement('div');
            var _selector;

            _el.innerHTML = _innerHTML;

            _selector = 'edueditor_styleclass_' + _parseId++;
            _e._$addClassName(_el, _selector);
            _selector = '.' + _selector;

            //_g.uParse(_selector);
            _g.uParse2(_el, _selector);
            return _el.innerHTML;
        }

    })();

    _u._$renderRich = _p._$renderRich;
    _u._$renderRich2 = _p._$renderRich2;

    /**
     * 对jst的_$getHtmlTemplate做aop，如果有需要parse的节点则在取到后parse
     * jst中加入类名'f-richEditorText'
     */
    _e._$getHtmlTemplate = _e._$getHtmlTemplate._$aop(_f,function(_event){
        var _node = _e._$html2node(_event.value),
            _parseNode = _e._$getByClassName(_node, 'f-richEditorText'),
            _wrapNode = _e._$create('div');
                              
        if(!_parseNode || _parseNode.length <= 0){
            return _event;
        }

        try{
            _u._$forEach(_parseNode,function(_item){
                _u._$renderRich(_item);
            });
                                  
            _wrapNode.appendChild(_node);
            _event.value = _wrapNode.innerHTML;
                                  
            return _event;
        }catch(_error){
            return _event;
        }
    });

    return _p;

});

