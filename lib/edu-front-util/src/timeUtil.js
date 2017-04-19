/**
 * -------TimerUtil模块对象，用于获取时间，以及格式化时间-------------
 *
 * @module timeUtil
 * @version  1.0
 * @author   tangtianliang(tangtianliang@corp.netease.com)
 * @path     eutil/timeUtil
 * @requires module:encodeUtil
 * --------------------------------------------------------
 */
// !function (name, definition) {
//   if (typeof module != 'undefined' && module.exports) module.exports = definition();
//   else if (typeof NEJ !== 'undefined' && NEJ.define) NEJ.define(['eutil/adapter/nej', 'eutil/encodeUtil'],definition);
//   else this[name] = definition()
// }('timeUtil', function (_adapter, EncodeUtil) {

  // if (typeof module !== 'undefined' && module.exports) {
  //   EncodeUtil = require('./encodeUtil');
  // }
NEJ.define(['./adapter/nej.js', './encodeUtil.js'], function(_adapter, EncodeUtil){


  var _module = {},
      g = (function(){return this;})();

  /**
   * 获取服务器渲染相应页面的时间
   * @method _$getServerRespondTime
   * @param {Void}
   * @return {millisec} 返回服务器渲染相应页面的时间毫秒
   */
  /* istanbul ignore next */
  _module._$getServerRespondTime = (function(){
    var _time = new Date().getTime();

    return function(){
      return g.serverTimeDiff ? (_time - g.serverTimeDiff) : _time;
    };
  })();


  /**
   * 返回当前服务器的时间
   * @method _$getCurServerTime
   * @param {Void}
   * @return {millisec} 返回当前服务器的时间毫秒
   */
  _module._$getCurServerTime = function(){
    var _time = new Date().getTime();
    return g.serverTimeDiff ? (_time - g.serverTimeDiff) : _time;
  }


  /**
   * 返回时间类型串
   * 格式化时间，yyyy|yy|MM|cM|eM|M|dd|d|HH|H|mm|ms|ss|m|s|w
   *
   * 各标识说明：
   *
   * | 标识  | 说明 |
   * | :--  | :-- |
   * | yyyy | 四位年份，如2001 |
   * | yy   | 两位年费，如01 |
   * | MM   | 两位月份，如08 |
   * | M    | 一位月份，如8 |
   * | dd   | 两位日期，如09 |
   * | d    | 一位日期，如9 |
   * | HH   | 两位小时，如07 |
   * | H    | 一位小时，如7 |
   * | mm   | 两位分钟，如03 |
   * | m    | 一位分钟，如3 |
   * | ss   | 两位秒数，如09 |
   * | s    | 一位秒数，如9 |
   * | ms   | 毫秒数，如234 |
   * | w    | 中文星期几，如一 |
   * | ct   | 12小时制中文后缀，上午/下午 |
   * | et   | 12小时制英文后缀，A.M./P.M. |
   * | cM   | 中文月份，如三 |
   * | eM   | 英文月份，如Mar |
   *
   * @method _$getTimeData
   * @param {millisec} _time 时间毫秒
   * @param {millisec} _12time 指定格式的时间串
   * @return {Object} 格式化时间对象
   *
   */
  _module._$getTimeData = (function(){
    var _map = {i:!0,r:/\byyyy|yy|MM|cM|eM|M|dd|d|HH|H|mm|ms|ss|m|s|w|ct|et\b/g},
        _12cc = ['上午','下午'],
        _12ec = ['A.M.','P.M.'],
        _week = ['日','一','二','三','四','五','六'],
        _cmon = ['一','二','三','四','五','六','七','八','九','十','十一','十二'],
        _emon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
    var _fmtnmb = function(_number){
      _number = parseInt(_number)||0;
      return (_number<10?'0':'')+_number;
    };
    var _fmtclc = function(_hour){
      return _hour<12?0:1;
    };

    return function(_time, _12time){
      if (!_time)
        return '';
      _time = new Date(_time*1);
      _map.yyyy = _time.getFullYear();
      _map.yy   = (''+_map.yyyy).substr(2);
      _map.M    = _time.getMonth()+1;
      _map.MM   = _fmtnmb(_map.M);
      _map.eM   = _emon[_map.M-1];
      _map.cM   = _cmon[_map.M-1];
      _map.d    = _time.getDate();
      _map.dd   = _fmtnmb(_map.d);
      _map.H    = _time.getHours();
      _map.HH   = _fmtnmb(_map.H);
      _map.m    = _time.getMinutes();
      _map.mm   = _fmtnmb(_map.m);
      _map.s    = _time.getSeconds();
      _map.ss   = _fmtnmb(_map.s);
      _map.ms   = _time.getMilliseconds();
      _map.w    = _week[_time.getDay()];
      var _cc   = _fmtclc(_map.H);
      _map.ct   = _12cc[_cc];
      _map.et   = _12ec[_cc];
      if (!!_12time){
        _map.H = _map.H%12;
      }

      return _map;
    };
  })();

  /**
   * 格式化时间戳
   * @method _$formatTime
   * @param  {number} _time   时间毫秒
   * @param  {string} _format 格式化规则
   * @return {string}         格式化后的规则
   */
  _module._$formatTime = function(_time, _format, _12time){
    return EncodeUtil._$encode(_module._$getTimeData(_time, _12time),_format || 'yyyy-MM-dd');
  };

  /**
   * 通用格式化时间
   * @method _$formatCommonTime
   * @param  {Number}       _time 时间毫秒
   * @return {String}       待定或yyyy年MM月dd日 HH:mm格式的时间
   */
  _module._$formatCommonTime = function(_time){
    if(_time == 32503651201000 || _time == 32535187201000){
      return '待定';
    }
    return _module._$formatTime(_time, 'yyyy年MM月dd日 HH:mm');
  }

  /**
   * 格式化时间段
   * @method _$formatPeriod
   * @param  {number} _fromTime   开始时间毫秒
   * @param  {number} _toTime     结束时间毫秒
   * @param  {string} _format     格式化规则
   * @param  {string} _conjunction 连接符
   * @return {string}         格式化后的时间段
   */
  _module._$formatPeriod = function(_fromTime, _toTime, _format, _conjunction){
    _fromTime = _fromTime || (+new Date());
    _toTime = _toTime || (+new Date());
    _format = _format || 'yyyy-MM-dd';

    if(_fromTime == 32503651201000 && _toTime == 32535187201000){
      return '待定';
    }

    return (EncodeUtil._$encode(_module._$getTimeData(_fromTime),_format)
    + (_conjunction?_conjunction:' - ')
    + EncodeUtil._$encode(_module._$getTimeData(_toTime),_format));
  };

  /**
   * 生成倒计时时间对象
   * @method _$tiktok
   * @param  {number} _endTime 截止时间毫秒
   * @param  {number} _curTime 当前时间毫秒
   * @return {Object} 格式化时间对象
   */
  _module._$tiktok = function(_endTime, _curTime){
    var _now = _curTime || this._$getCurServerTime(),
        _offtime = _endTime - _now,
        _d,_h,_m,_s;

    //小于1000毫秒 相当于时间截止
    if(_offtime < 1000){
      return null;
    }

    _offtime = ~~(_offtime/1000);
    _d = ~~(_offtime/(3600*24));
    _h = ~~((_offtime - 3600*24*_d)/3600);
    _m = ~~((_offtime - 3600*24*_d - 3600*_h)/60);
    _s = _offtime - 3600*24*_d - 3600*_h - _m*60;

    return {
      d: _d||0,
      h: _h||0,
      m: _m||0,
      s: _s||0
    };
  }

  /**
   * 格式化倒计时的时间
   * @param {Number} _seconds 目标时间
   * @return {String} 格式化后的字符串,如'12:25:36'
   */
  _module._$formateTiktokByHMS = function(_end){
      var _last = this._$tiktok(_end);
      var _h,_m,_s;
      if (!!_last){
          _h = (_last.h+_last.d*24) < 10?'0'+(_last.h+_last.d*24) : (_last.h+_last.d*24);
          _m = _last.m<10?'0'+_last.m : _last.m;
          _s = _last.s<10?'0'+_last.s : _last.s;
          return (_h + ':' + _m +':'+ _s);
      }
      return '';
  }

  /**
   * 格式化倒计时的时间
   * @method _$formatTiktokTime
   * @param {Number} _endTime 目标时间
   * @param {Number} _curTime 当前时间
   * @return {String} 格式化后的字符串,
   *                  倒计时长大于1天         5天5时5分钟
   *                  倒计时长大于1时小于1天   5时5分钟
   *                  倒计时长大于1分小于1时   5分钟
   *                  倒计时长大于1秒小于1分   5秒钟
   */
  _module._$formatTiktokTime = function(_endTime, _curTime){
    var _last = this._$tiktok(_endTime, _curTime);

    if(!_last){
      return null;
    }

    if(_last.d >= 1){
      return (_last.d +'天' + _last.h +'小时'+_last.m +'分钟');
    }else if(_last.h >= 1){
      return (_last.h +'小时' + _last.m +'分钟');
    }else if(_last.m >= 1){
      return (_last.m +'分钟');
    }else{
      return (_last.s +'秒钟');
    }
  }

  /**
   * 获取当前是上午、下午等等
   * @method _$getCurDayPharse
   * @return {string} 时间状态
   */
  _module._$getCurDayPharse = function() {
    var _now = new Date(this._$getCurServerTime()),
        _hour = _now.getHours(),
        _str = '';

    if (_hour < 6) {
      _str = '凌晨';
    } else if (_hour < 9) {
      _str = '早上';
    } else if (_hour < 12) {
      _str = '上午';
    } else if (_hour < 14) {
      _str = '中午';
    } else if (_hour < 17) {
      _str = '下午';
    } else if (_hour < 24) {
      _str = '晚上';
    }

    return _str;
  };

  /**
  * 获取回复时间
  * @description 显示规则：
  *             一分钟内：4s 前
  *             今天：19：52
  *             昨天以前：3月2日
  *             一年前（自然年）：2015年11月21日
  * @method _$getReplyTime
  * @param {number} _millisec 时间毫秒
  * @return {string} 时间状态
  */
  _module._$getReplyTime = function(_millisec) {
    var _replyTime = new Date(_millisec || 0); //设置需要格式化的时间
    var _curTime = new Date(this._$getCurServerTime()); //当前时间

    if(_curTime.getTime() < _replyTime.getTime()){
      //客户端时间反而更小
      return '1秒前';
    }
    else if(_curTime.getFullYear() != _replyTime.getFullYear()){
      //非同一年
      return _module._$formatTime(_millisec, 'yyyy年MM月dd日');
    }
    else if((_curTime.getMonth() != _replyTime.getMonth()) || (_curTime.getDate() != _replyTime.getDate())){
      //大于24小时
      return _module._$formatTime(_millisec, 'MM月dd日');
    }
    else if(_curTime.getHours() != _replyTime.getHours()){
      //大于1小时
      return _module._$formatTime(_millisec, 'HH:mm');
    }
    else if(_curTime.getMinutes() != _replyTime.getMinutes()){
      //不足1小时
      return (_curTime.getMinutes() - _replyTime.getMinutes()) + '分钟前';
    }
    else if(_curTime.getSeconds() != _replyTime.getSeconds()){
      //不足1分钟
      return (_curTime.getSeconds() - _replyTime.getSeconds()) + '秒前';
    }
    else{
      return '1秒前';
    }
  };


  /**
   * 格式化视频时长，目前只显示分钟和秒数
   * @method _$Millisec2Str
   * @param  {Number} _seconds 秒数
   * @return {String} 格式化后的字符串，如：‘86:08’ , 有小时的显示‘11：21：21’
   */
  _module._$Millisec2Str = _module._$formatVideoTime = function(_seconds){
    _seconds = (_seconds || 0);
    var _hour = Math.floor(_seconds / 3600),
      _minute = Math.floor(_seconds / 60) - _hour * 60,
      _second = Math.floor(_seconds % 60),
      _str = (_minute < 10 ? '0'+_minute : _minute) + ':' + (_second < 10 ? '0'+_second : _second);

    if(_hour > 0){
      _str = (_hour < 10 ? '0' + _hour : _hour) + ':' + _str;
    }

    return _str;
  };

  /**
   * 把格式化的视频时长转换回秒数
   * @method _$str2Millisec
   * @param  {String} _strTime 格式化后的字符串，如：‘86:08’ , 有小时的显示‘11：21：21’
   * @return {Number} _seconds 秒数
   */
  _module._$str2Millisec = function(_strTime){
    var _timeArr = _strTime.split(':'),
        _seconds = 0;
    var _index   = _timeArr.length -1,
        min2sec  = (_index-1) >= 0 ? _timeArr[_index-1] * 60 :0,
        hour2sec = (_index-2) >= 0 ? _timeArr[_index-2] * 3600 :0 ;

    return Number(_timeArr[_index]) + min2sec + hour2sec;
  };

  return _module;
});