/**
 * ClockUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hzliujunwei <hzliujunwei@corp.netease.com>
 * @module   pool/component-clock/src/clock/ui
 */
NEJ.define( [
    './component.js',
    'text!./component.html',
    'text!./component.css'
],function(
    Clock,
    html,
    css
){
    /**
     * Clock UI组件
     *
     * @class   module:pool/component-clock/src/clock/ui.ClockUI
     * @extends module:pool/component-clock/src/clock.Clock
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return Clock.$extends({
        name     : 'ux-clock',
        //css      : css,
        template : html
    });
});
