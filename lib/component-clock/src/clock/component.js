/**
 * Clock 组件实现文件
 *
 * @version  1.0
 * @author   hzliujunwei <hzliujunwei@corp.netease.com>
 * @module   pool/component-clock/src/clock/component
 */
NEJ.define([
    'pool/component-base/src/base',
    'pool/component-base/src/util'
],function(
    Component,
    util
){
    /**
     * Clock 组件
     *
     * @class   module:pool/component-clock/src/clock/component.Clock
     * @extends module:pool/component-base/src/base.Component
     *
     * @param {Object} options      - 组件构造参数
     * @param {Object} options.data - 与视图关联的数据模型
     */
    var Clock = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/component-clock/src/clock/component.Clock#config
         * @returns {void}
         */
        config: function () {
            // FIXME 设置组件配置信息的默认值
            util.extend(this, {
                settingKey: 'component-clock'
            });

            util.extend(this.data, {
                time: 0,
                interval: 1000, //时间间隔,
                title: ''
            });

            this.$watch('time', function(_time){
                var _minute = Math.floor((+_time)/60);
                this.data.resttime = +_time;
                //这个是为了保存原始resttime
                this.data.allresttime = +_time;

                this.data.allminute = this.formatTime(_minute%60);
                this.data.allhour = this.formatTime(Math.floor(_minute/60));
                this.data.allsecond = this.formatTime(_time%60);
                this.data.startTime = +new Date();
                //保存已用时间来判断本地时间是否被修改
                this.data.used = 0;
            });

            this.$watch('resttime', function(_time){

                var _minute = Math.floor((_time)/60);
                this.data.minute = this.formatTime(_minute%60);
                this.data.hour = this.formatTime(Math.floor(_minute/60));
                this.data.second = this.formatTime(Math.floor((+_time)%60))
            });
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/component-clock/src/clock/component.Clock#init
         * @returns {void}
         */
        init: function () {
            // TODO
            this.supr();
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/component-clock/src/clock/component.Clock#destroy
         * @returns {void}
         */
        destroy: function () {
            // TODO
            this.supr();
        },

        //格式化分钟 02:00
        formatTime: function(_time){

            _time = '' + _time;

            var _ret = _time;
            if(_time == '0'){
                _ret = '00';
            }
            if(_time.length == 1){
                _ret = '0' + _time;
            }

            return _ret;
        },
        //设置剩余时间
        setTime: function(seconds){
            this.data.resttime = seconds;
            this.data.allresttime = seconds;
            this.data.startTime = +new Date();
            //用来校准是否被修改了本地时间
            this.data.now = this.data.startTime;
            this.$update();
        },

        //格式化小时 02:00
        formatHour: function(){

        },

        //倒计时,setInterval不够精确
        timeout: function(){
            var _that = this;
            this.timer = setTimeout(function(){
                if(_that.data.resttime <= 0){
                    clearTimeout(_that.timer);
                    _that.$emit('finish');
                    _that.$update();
                    return ;
                }
                var _usedTime = 0;
                var _now = +new Date();


                //如果本地时间被修改到从前
                if(_now < _that.data.now){
                    _that.data.startTime -= _that.data.now - _now;
                }
                //如果本地时间与上次本地时间相差大于2秒说明本地时间被修改到之后
                if(_now - _that.data.now > 2000){
                    _that.data.startTime += _now - _that.data.now;
                }

                var _used = Math.floor((_now - _that.data.startTime)/1000);
                _that.data.resttime = _that.data.allresttime - _used;
                if(_that.data.resttime<0){
                    _that.data.resttime = 0;
                }
                _that.data.now = _now;

                _that.$update();
                _that.timeout();
            }, this.data.interval/10);
        },

        start: function(){
            this.timeout();
        },

        stop: function(){
            clearTimeout(this.timer);
        }
    });

    return Clock;
});
