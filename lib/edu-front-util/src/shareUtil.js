/**
 * -------------shareUtil模块对象，用于第三方分享----------------
 * 
 * @module   shareUtil
 * @version  1.0
 * @author   tangtianliang(tangtianliang@corp.netease.com)
 * @path     eutil/shareUtil
 * --------------------------------------------------------
 */

NEJ.define(['./adapter/nej.js'], function (_adapter) {
  
  var CONST = {
    netease: 'HrJOJ17S62E4ipIa', //netease weibo appID
    sina: {
      id: '4122644977' //sina weibo appID
    }
  };

  var screen = window.screen;

  var _ustr=[];
      _ustr[0] = 'height=505,width=615,top=' + (screen.height - 280) / 2 ;
      _ustr[1] = 'left=' + (screen.width - 550) / 2 ;
      _ustr[2] = 'toolbar=no, menubar=no, scrollbars=no,';
      _ustr[2] += 'resizable=yes,location=no, status=no';
      
  var _window = _ustr.join(',');

  var _module = {};

  _module.parseUrl = function(path, param){
    var arr = [];
    for( var tmp in param ){
      arr.push(tmp + '=' + encodeURIComponent( param[tmp] || '' ) )
    }
    return path + arr.join('&');
  }

  /**
   * 分享到微信
   * @method shareWeibo
   * @param {Object} _options
   * @param {String} _options.url 
   * @param {String} _options.title 
   * @param {String} _options.pic
   * @return {void}
   */
  _module.shareWeibo = function(_options){
      var param = {
          url: _options.url.replace('${source}','weibo'),
          appkey: CONST.sina.id, /**你申请的应用appkey,显示分享来源(可选)*/
          title: _options.title.replace('${appName}','@网易云课堂 ')+'( 下载客户端 http://study.163.com/appDownload.htm?from=weiboShare )', /**分享的文字内容(可选，默认为所在页面的title)*/
          pic: _options.pic, /**分享图片的路径(可选)*/
          language:'zh_cn' /**设置语言，zh_cn|zh_tw(可选)*/
      }

      window.open(_module.parseUrl('http://service.weibo.com/share/share.php?', param), "_blank", _window); 
  };

  /**
   * 分享到QQ空间
   * @method shareWeibo
   * @param {Object} _options
   * @param {String} _options.url 
   * @param {String} _options.title 
   * @param {String} _options.pic
   * @param {String} _options.description
   * @return {void}
   */
  _module.shareQzone = function(_options){
    var param = {
        url: _options.url.replace('${source}','qzone'),
        title: _options.title.replace('${appName}','云课堂'),
        pics:  _options.pic,
        summary: (_options.description || '').replace('${appName}','云课堂')
    }

    window.open(_module.parseUrl('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?', param), "Qzone", _window); 
  }

  return _module;
});

