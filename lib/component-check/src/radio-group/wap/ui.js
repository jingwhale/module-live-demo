/**
 * RadioGroupUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hztianxiang <hztianxiang@corp.netease.com>
 * @module   pool/component-check/src/radio-group/web/ui
 */
NEJ.define( [
    '../component.js',
    'text!./component.html',
    'text!./component.css',
    'base/event'
],function(
    RadioGroup,
    html,
    css,
    v
){
    /**
     * RadioGroup UI组件
     *
     * @class   module:pool/component-check/src/radio-group/wap/ui.RadioGroupUI
     * @extends module:pool/component-check/src/radio-group/component.RadioGroup
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    var RadioGroupUI = RadioGroup.$extends({
        name     : 'ux-radio-group',
        css      : css,
        template : html
    });

    RadioGroupUI.event('tap', function (elem, fire) {
        var hm = null;

        if (window.Hammer) {
            hm = new Hammer(elem);
            hm.on("tap", function (ev) {
                fire(ev);
            });
        } else {
            v._$addEvent(elem, 'click', function (ev) {
                fire(ev);
            });
        }
    });

    return RadioGroupUI;
});
