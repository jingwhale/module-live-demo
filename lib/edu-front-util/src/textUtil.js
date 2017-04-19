/**
 * -------------textUtil模块对象，用于获取或修改字符串信息----------------
 * 
 * @module textUtil
 * @version  1.0
 * @author   tangtianliang(tangtianliang@corp.netease.com)
 * @path     eutil/textUtil
 * --------------------------------------------------------
 */

NEJ.define(['./adapter/nej.js'], function (_adapter) {
  
  
  var _module = {},
      g = (function(){return this;})();

  /**
   * 去掉回车换行tab,将多于的空格变成一个空格
   * @method _$removeNRNBSP
   * @param {String} _text 字符串
   * @return {String} 去掉空格之后的字符串
   */
  _module._$removeNRNBSP = function(_text){
    return (_text || '').replace(/[\t\r\n]+/gi,' ').replace(/[ ]+/gi,' ');
  };


  /**
   * 过滤富文本标签得方法
   * @method _$filterText
   * @param {String} _richText 带标签的富文本
   * @return {String} 转化为字符串的富文本
   */
  _module._$filterText = function(_richText){
    var _div = document.createElement('div');
    _div.innerHTML = _richText;
    return _module._$removeNRNBSP(_div.innerText);
  };
  
  /**
   * 获取字符串长度，中文是长度是2
   * @method _$getStringLength
   * @param  {String} _string 输入的字符串
   * @return {Number}         字符串长度
   */
  _module._$getStringLength = function(_string){
    _string = _string || '';
    _string = _string.replace(/^\n+|\n+$/g, ""); //将富文本中\n过滤
    var _entryLen0 = _string.length,
      _entryLen = 0;
    var _cnChar = _string.match(/[^\x00-\x80]/g); //利用match方法检索出中文字符并返回一个存放中文的数组 
    if (!!_cnChar && _cnChar.length > 0)
      _entryLen = _cnChar.length || 0; //算出实际的字符长度
    return _entryLen0 + _entryLen;
  }

  /**
   * 截断字符串，处理中英文情况
   * @method _$sliceStrByLength
   * @param  {String} _string    输入的字符串
   * @param  {Number} _maxLength 需要截断的长度, 实际的长度，中文算两个，则传入的_maxLength为*2
   * @return {String}            返回截断后的字符串
   */
  _module._$sliceStrByLength = function(_string, _maxLength){
    _string = _string || '';
    var _ret = '',
      _length = _string.length,
      _string = _string.split(''),
      _readLength = 0;
    for (var i = 0; i < _length; i++) {
      var _char = _string[i];
      var _arr = _char.match(/[^\x00-\x80]/g);
      if (!!_arr && _arr.length > 0) {
        _readLength += 2; //中文字符
      } else {
        _readLength += 1; //英文字符
      }
      if (_readLength > _maxLength) {
        break;
      }
      _ret += _char;
    }
    return _ret;
  }

  /**
   * 截断字符串，如果超出字数限制，追加... 
   * @method _$ellipsisStrByLength
   * @param  {String} _string    输入的字符串
   * @param  {Number} _maxLength 需要截断的长度
   * @return {String}            返回截断后的字符串，如果超出字数限制，追加... 
   */
  _module._$ellipsisStrByLength = function(_string, _maxLength){
    var _str = _string;
    if(_module._$getStringLength(_str) > _maxLength){
        _str = _module._$sliceStrByLength(_str, _maxLength) + '...';
    }
    return _str;
  };

  /**
   * 截取字符长度,中英文算1个,符号不算 
   * @method _$getStringLengthForEditor
   * @param  {String} _string    输入的字符串
   * @return {String}            返回字符个数 
   */
  _module._$getStringLengthForEditor = function(_string){     
    _string = _string || '';     
    _string = _string.replace(/\s/g,'');//过滤空格     
    //_string = _string.replace(/[\ |\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,'');//过滤常见符号     
    _string = _string.replace(/^\n+|\n+$/g, ""); //将富文本中\n过滤     
    var _entryLen0 = _string.length;     
    return _entryLen0; 
  }


  return _module;
});

