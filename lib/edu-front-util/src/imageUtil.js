/**
 * -----------------------图片压缩相关的util--------------------
 * 
 * @module imageUtil
 * @version  1.0
 * @author   hzshaoyy(hzshaoyy@corp.netease.com)
 * @path     eutil/imageUtil
 * --------------------------------------------------------
 */

NEJ.define(['./adapter/nej.js'], function() {
  var _module = {},
      g = (function(){return this;})();

  var _isNos = new RegExp('^http://nos.netease.com/'),
      _isNosMain = new RegExp('^http:\/\/nos.netease.com\/.*thumbnail=(\\d*)y(\\d*).*'),
      _retUrl = "http://imgsize.ph.126.net/?enlarge=true&imgurl=";
  /**
   * 通过相册或者的服务动态缩放图片,走CDN
   * @method _$scaleImage
   * @param {String} _url 图片地址
   * @param {Number} _width 图片压缩后的宽
   * @param {Number} _height 图片压缩后的高
   * @param {String} _otherProp 附加属性，默认为1x95，可以不传
   * 
   */
  _module._$scaleImage = _module._$scalePicDynamic = function(_url,_width,_height,_otherProp){
      var _isNos = new RegExp('^http://nos.netease.com/'),
          _isNosCdn = new RegExp('^http://edu-image.nosdn.127.net'),
            _isNosMain = new RegExp('^http:\/\/nos.netease.com\/.*thumbnail=(\\d*)y(\\d*).*'),
            _retUrl = "http://imgsize.ph.126.net/?enlarge=true&imgurl=";

      var _prop, _suffix, _returnUrl;

      if(!_url){
        return _url;
      }

      if(_isNos.test(_url)){
          //将edu-image的nos图片地址修改为nosdn图片地址,test-edu-image的图片地址保持不变
          var temp_url_arr = _url.split('/');
          if(temp_url_arr[3] == 'edu-image'){
            temp_url_arr[2] = 'edu-image.nosdn.127.net';
            temp_url_arr.splice(3, 1);
            _url = temp_url_arr.join('/');
          }       
      }

      if(_isNosCdn.test(_url) || _isNos.test(_url)){
        //nos图片压缩
        _url = (_url.split('?') || [])[0];
        _returnUrl = _url + '?imageView&thumbnail='+_width+'y'+_height+'&quality=100';

        if(_otherProp){
          _returnUrl += ('&' + _otherProp);
        }
      }else{
        //历史遗留相册接口
        _prop = '1x95';
        _suffix = _url.substring(_url.lastIndexOf("."));
        if(_suffix == ".gif"){//gif不压缩处理
              return _url;
          }
        if(_width && _height){ //传了宽高，进行压缩处理
          _returnUrl = _retUrl + _url + '_' + _width + "x" + _height + "x" + _prop + _suffix;
        }else{ //否则不处理，直接返回原链接
          _returnUrl =  _url ;
        }
      }

      return _returnUrl;
    }
  
  return _module;
});
