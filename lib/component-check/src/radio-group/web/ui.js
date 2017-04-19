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
    'text!./component.css'
],function(
    RadioGroup,
    html,
    css
){
    /**
     * RadioGroup UI组件
     *
     * @class   module:pool/component-check/src/radio-group/web/ui.RadioGroupUI
     * @extends module:pool/component-check/src/radio-group/component.RadioGroup
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return RadioGroup.$extends({
        name     : 'ux-radio-group',
        css      : css,
        template : html
    });
});
