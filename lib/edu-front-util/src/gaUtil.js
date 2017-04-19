/**
 * ---------------------ga 相关的util-------------------------
 * 
 * @module gaUtil
 * @version  1.0
 * @author   hzcaohuanhuan(hzcaohuanhuan@corp.netease.com)
 * @path     eutil/gaUtil
 * --------------------------------------------------------
 */

NEJ.define(['./adapter/nej.js', 'util/encode/md5'], function (_adp, _md5) {
  var _module = {},
      g = (function(){return this;})(),

      _product = (g.eduProduct && g.eduProduct.gaProduct) || g.gaProduct || 'study';

  /**
   * 往本地打log
   * @method pushLog
   * @param  {Object} _data 数据vo
   */
  var pushLog = (function pushLog(){
    var _e = document.createElement('img');

    return function(_data){
      _e.src = 'http://log.study.163.com/__utm.gif?p='+_product+'&dt='+_md5._$str2hex(_data);
    };
  })();

  /**
   * 使用ga跟踪页面view点击
   * @method _$trackPageView
   * @param {String} _showHash 显示的Hash
   * @param {String} _pageSelfName 页面名字
   */
  _module._$trackPageView = function(_showHash, _pageSelfName){
    var _obj;

    if(!_pageSelfName){
      _pageSelfName = location.pathname + location.search;
    }
    _pageSelfName += (!!_showHash ? location.hash:"");
    //google统计
    if(!!g[g.gaqStr]){
      g[g.gaqStr].push([g.gaTrackPageview,_pageSelfName]);
    }

    
    
    //studylog
    _obj = {
      "action": 'pageview',
      "Utmp": location.href || '',
      "Utmr": document.referrer || ''
    };
    pushLog(JSON.stringify(_obj));
  }

  /**
   * 使用ga跟踪事件点击处理
   * @method _$trackEvent
   * @param {String} _category 必填
   * @param {String} _action 必填
   * @param {String} _opt_label 选填
   * @param {number} _opt_value 选填
   * @return void
   * 
   * @example（0.3+0.2）=> 0.5
   */
  _module._$trackEvent = function(_category, _action, _opt_label, _opt_value){
    if(!!_category && !!_action){
      var _arr = [g.gaTrackEvent,_category,_action];
      if(!!_opt_label){
        _arr.push(_opt_label);
        if((_opt_value != undefined) && (_opt_value != null)){
          _arr.push(parseInt(_opt_value));
        }
      }
      //google统计
      if(!!g[g.gaqStr]){
        g[g.gaqStr].push(_arr);
      }
    }
  }

  /**
   * @method _$log
   * @param  {Object} _obj 对象
   * @return {Void}
   */
  _module._$log = function(_obj){
    pushLog(JSON.stringify(_obj));
  }

  return _module;
});
