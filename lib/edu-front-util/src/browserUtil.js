/**
 * --------------------浏览器对象操作相关的util--------------------
 * @module browserUtil
 * @version  1.0
 * @author   hzlixinxin(hzlixinxin@corp.netease.com)
 * @path     eutil/browserUtil
 * --------------------------------------------------------
 */

NEJ.define(['./adapter/nej.js'], function() {
  var _module = {},
    b = NEJ.P('nej.p'),
    t = true,
    g = (function() {
      return this;
    })(),
    eduUtil = {},
    _useragent = g.navigator.userAgent;

  /**
   * 获取userAgnet
   * @method _$getUserAgent
   * @param {Void}
   * @return {String} useragent
   */
  /* istanbul ignore next */
  _module._$getUserAgent = function() {
    return _useragent;
  };

  /**
   * 检测浏览器
   * @method _$detect
   * @param {Void} 
   * @return {Object} 检测结果，有name和version字段
   * @example
   * 当前浏览器为IE9，则返回的对象中有{msie:true,version:9,name: 'Internet Explorer'}
   */
  _module._$detect = function() {
    var ua = _module._$getUserAgent();

    function getFirstMatch(regex) {
      var match = ua.match(regex);
      return (match && match.length > 1 && match[1]) || '';
    }

    function getSecondMatch(regex) {
      var match = ua.match(regex);
      return (match && match.length > 1 && match[2]) || '';
    }

    var iosdevice = getFirstMatch(/(ipod|iphone|ipad)/i).toLowerCase(),
      likeAndroid = /like android/i.test(ua),
      android = !likeAndroid && /android/i.test(ua),
      chromeBook = /CrOS/.test(ua),
      edgeVersion = getFirstMatch(/edge\/(\d+(\.\d+)?)/i),
      versionIdentifier = getFirstMatch(/version\/(\d+(\.\d+)?)/i),
      tablet = /tablet/i.test(ua),
      mobile = !tablet && /[^-]mobi/i.test(ua),
      result;

    if (/opera|opr/i.test(ua)) {
      result = {
        name: 'Opera',
        opera: t,
        version: versionIdentifier || getFirstMatch(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i)
      }
    } else if (/yabrowser/i.test(ua)) {
      result = {
        name: 'Yandex Browser',
        yandexbrowser: t,
        version: versionIdentifier || getFirstMatch(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)
      }
    } else if (/windows phone/i.test(ua)) {
      result = {
        name: 'Windows Phone',
        windowsphone: t
      }
      if (edgeVersion) {
        result.msedge = t
        result.version = edgeVersion
      } else {
        result.msie = t
        result.version = getFirstMatch(/iemobile\/(\d+(\.\d+)?)/i)
      }
    } else if (/msie|trident/i.test(ua)) {
      result = {
        name: 'Internet Explorer',
        msie: t,
        version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
      }
    } else if (chromeBook) {
      result = {
        name: 'Chrome',
        chromeBook: t,
        chrome: t,
        version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
      }
    } else if (/chrome.+? edge/i.test(ua)) {
      result = {
        name: 'Microsoft Edge',
        msedge: t,
        version: edgeVersion
      }
    } else if (/chrome|crios|crmo/i.test(ua)) {
      result = {
        name: 'Chrome',
        chrome: t,
        version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
      }
    } else if (iosdevice) {
      result = {
          name: iosdevice == 'iphone' ? 'iPhone' : iosdevice == 'ipad' ? 'iPad' : 'iPod'
        }
        // WTF: version is not part of user agent in web apps
      if (versionIdentifier) {
        result.version = versionIdentifier
      }
    } else if (/sailfish/i.test(ua)) {
      result = {
        name: 'Sailfish',
        sailfish: t,
        version: getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
      }
    } else if (/seamonkey\//i.test(ua)) {
      result = {
        name: 'SeaMonkey',
        seamonkey: t,
        version: getFirstMatch(/seamonkey\/(\d+(\.\d+)?)/i)
      }
    } else if (/firefox|iceweasel/i.test(ua)) {
      result = {
        name: 'Firefox',
        firefox: t,
        version: getFirstMatch(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i)
      }
      if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(ua)) {
        result.firefoxos = t
      }
    } else if (/silk/i.test(ua)) {
      result = {
        name: 'Amazon Silk',
        silk: t,
        version: getFirstMatch(/silk\/(\d+(\.\d+)?)/i)
      }
    } else if (android) {
      result = {
        name: 'Android',
        version: versionIdentifier
      }
    } else if (/phantom/i.test(ua)) {
      result = {
        name: 'PhantomJS',
        phantom: t,
        version: getFirstMatch(/phantomjs\/(\d+(\.\d+)?)/i)
      }
    } else if (/blackberry|\bbb\d+/i.test(ua) || /rim\stablet/i.test(ua)) {
      result = {
        name: 'BlackBerry',
        blackberry: t,
        version: versionIdentifier || getFirstMatch(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
      }
    } else if (/(web|hpw)os/i.test(ua)) {
      result = {
        name: 'WebOS',
        webos: t,
        version: versionIdentifier || getFirstMatch(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
      };
      /touchpad\//i.test(ua) && (result.touchpad = t)
    } else if (/bada/i.test(ua)) {
      result = {
        name: 'Bada',
        bada: t,
        version: getFirstMatch(/dolfin\/(\d+(\.\d+)?)/i)
      };
    } else if (/tizen/i.test(ua)) {
      result = {
        name: 'Tizen',
        tizen: t,
        version: getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || versionIdentifier
      };
    } else if (/safari/i.test(ua)) {
      result = {
        name: 'Safari',
        safari: t,
        version: versionIdentifier
      }
    } else {
      result = {
        name: getFirstMatch(/^(.*)\/(.*) /),
        version: getSecondMatch(/^(.*)\/(.*) /)
      };
    }

    // set webkit or gecko flag for browsers based on these engines
    if (!result.msedge && /(apple)?webkit/i.test(ua)) {
      result.name = result.name || "Webkit"
      result.webkit = t
      if (!result.version && versionIdentifier) {
        result.version = versionIdentifier
      }
    } else if (!result.opera && /gecko\//i.test(ua)) {
      result.name = result.name || "Gecko"
      result.gecko = t
      result.version = result.version || getFirstMatch(/gecko\/(\d+(\.\d+)?)/i)
    }

    // set OS flags for platforms that have multiple browsers
    if (!result.msedge && (android || result.silk)) {
      result.android = t
    } else if (iosdevice) {
      result[iosdevice] = t
      result.ios = t
    }

    // OS version extraction
    var osVersion = '';
    if (result.windowsphone) {
      osVersion = getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i);
    } else if (iosdevice) {
      osVersion = getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i);
      osVersion = osVersion.replace(/[_\s]/g, '.');
    } else if (android) {
      osVersion = getFirstMatch(/android[ \/-](\d+(\.\d+)*)/i);
    } else if (result.webos) {
      osVersion = getFirstMatch(/(?:web|hpw)os\/(\d+(\.\d+)*)/i);
    } else if (result.blackberry) {
      osVersion = getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i);
    } else if (result.bada) {
      osVersion = getFirstMatch(/bada\/(\d+(\.\d+)*)/i);
    } else if (result.tizen) {
      osVersion = getFirstMatch(/tizen[\/\s](\d+(\.\d+)*)/i);
    }
    if (osVersion) {
      result.osversion = osVersion;
    }

    // device type extraction
    var osMajorVersion = osVersion.split('.')[0];
    if (tablet || iosdevice == 'ipad' || (android && (osMajorVersion == 3 || (osMajorVersion == 4 && !mobile))) || result.silk) {
      result.tablet = t
    } else if (mobile || iosdevice == 'iphone' || iosdevice == 'ipod' || android || result.blackberry || result.webos || result.bada) {
      result.mobile = t
    }

    return result;
  }

  /**
   * 检测当前是否目标浏览器
   * @method _$test
   * @param  {Array} browserList 目标浏览器数组
   * @return {Boolean}   当前浏览器是否在数组中
   * @example _$test([msie,chrome,firefox])，检测当前浏览器是否为IE，Chrome,firefox之一
   */
  _module._$test = function(browserList) {
    var browser = _module._$detect();
    for (var i = 0; i < browserList.length; ++i) {
      var browserItem = browserList[i];
      if (typeof browserItem === 'string') {
        if (browserItem in browser) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 判断当前浏览器是否是IE（IE6-11)
   *
   * @public
   * @method _$isIE
   * @param {Void} 
   * @return { Boolean} 是否为IE
   */
  _module._$isIE = function() {
    return b._$KERNEL.engine == "trident";
  };

  /**
   * 判断当前浏览器是否小于IE10
   *
   * @public
   * @method _$ltIE10
   * @param {Void} 
   * @return { Boolean} 是否<IE10
   */
  _module._$ltIE10 = function() {
    if (_module._$isIE() && (parseFloat(b._$KERNEL.release)) < 6) {
      return true;
    }
    return false;
  }

  /**
   * 判断当前标签页是否是隐藏状态(此方法只支持IE10及以上,不支持的版本会监听focus/blur事件，但是结果不保证可靠……)
   * As examples, on getting, the hidden attribute returns true when:下列情况会返回true   
   *The User Agent is minimized. 窗口最小化
   *The User Agent is not minimized, but the page is on a background tab. 窗口tab不是当前tab
   *The User Agent is about to unload the page. 页面即将unload
   *The User Agent is about to traverse to a session history entry. 历史页面
   *The Operating System lock screen is shown. 操作系统锁屏
   *Likewise, as examples, on getting, the hidden attribute returns false when:
   *The User Agent is not minimized and the page is on a foreground tab.
   *The User Agent is fully obscured by an Accessibility Tool, like a magnifier, but a view of the page is shown.
   *
   * @public
   * @method _$isPageHidden
   * @param {Void} 
   * @return { Boolean} 是否隐藏
   */
  _module._$isPageHidden = function() {
    var hidden = '';

    if (typeof document.hidden !== "undefined") {
      hidden = "hidden";
    } else if (typeof document.mozHidden !== "undefined") {
      hidden = "mozHidden";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
    } else if (!eduUtil.hasbindChange) {
      eduUtil.hasbindChange = true;
      if ("onfocusin" in document) { //IE9 and lower，绑定监听事件
        document.onfocusin = document.onfocusout = onchange;        
      } else { // All others:
        g.onpageshow = g.onpagehide = g.onfocus = g.onblur = onchange;
      }
    }

    function onchange(evt) {
      var v = true,
        h = false,
        evtMap = {
          focus: v,
          focusin: v,
          pageshow: v,
          blur: h,
          focusout: h,
          pagehide: h
        };

      evt = evt || window.event;
      if(evt.toElement == null && evt.fromElement == null && evt.relatedTarget === undefined){
        if (evt.type in evtMap) {
          eduUtil.hidden = evtMap[evt.type];
        }
      }else{
        return;
      }
      
    }

    if (hidden in document) {
      return document[hidden];
    } else {
      return eduUtil.hidden || false;
    }
  };

  return _module;
});
