NEJ.define([
    'base/klass'
], function(
    k
) {
    var Timer = k._$klass();
    var pro = Timer.prototype;
    var g = window;

    pro.__init = function (options) {
        if (typeof options.cb !== 'function') return;
        this.cb = options.cb; // 定时结束执行的callback
        this.interval = options.interval || 1000; // 间隔毫秒
        this.autoStart = !!options.autoStart; // 自动开始
        this.continues = !options.times || isNaN(options.times); // 如果不设置次数默认循环
        this.times = this.continues ? 0 : options.times; // 运行的次数
        this.active = false; // 定时器是否运行状态
        this.timeout = null; // setTimeout 句柄
        if (this.autoStart) {
            this.startTimer();
        }
    };

    pro.setTimer = function() {
        var that = this;
        var timeout = function() {
            if (that.times > 0 || that.continues) {
                that._runTimer();
            }
            if (that.times > 0) {
                that.times--;
            }
        };
        this.timeout = g.setTimeout(timeout, this.interval);
    };

    pro.clearTimer = function() {
        g.clearTimeout(this.timeout);
    };

    pro.stopTimer = function() {
        this.active = false;
        this.clearTimer();
    };

    pro.startTimer = function() {
        this.active = true;
        this.setTimer();
    };

    pro._runTimer = function() {
        if (this.active) {
            try {
                this.cb();
            } catch (e) {
                console.log('Timer callback running error' + e);
            }
            this.setTimer();
        }
    };

    return Timer;
});
