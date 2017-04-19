/*
 * ------------------------------------------
 * 交替显示的按钮实现文件
 * @version  1.0
 * @author   hzwujiazhen(hzwujiazhen@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _c = _('nej.c'),
        _e = _('nej.e'),
        _u = _('nej.u'),
        _t = _('nej.ut'),
        _p = _('nej.ui'),
        _v = _('nej.v');

    var _allPopups = []; // 保存所以的弹出对象

    function _closeAllPopup(){
        for ( var i = 0; i < _allPopups.length; i++ ) {
            var _pop = _allPopups[i];
            
            if (!!_pop.__hidePop) {
                _pop.__hidePop();
            };
        }
    }

    _v._$addEvent(document, 'mousedown', _closeAllPopup);

    /**
     * popup类
     * @class   {nej.ui._$$Popup} 富媒体编辑器基类封装
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *              onclick 点击处理    
     */

    var _proPopup, _supPopup;

    _p._$$Popup = NEJ.C();
    _proPopup = _p._$$Popup._$extend(_p._$$Abstract);
    _supPopup = _p._$$Popup._$supro;

    _proPopup.__init = function(){
        this.__supInit();

        _allPopups.push(this);
    }

    _proPopup.__hidePop = function(){
        
    }

    return _p._$$Popup;
};

NEJ.define(
      ['{lib}ui/base.js'],f);


