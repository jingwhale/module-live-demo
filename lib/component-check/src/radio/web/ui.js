/**
 * RadioUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hztianxiang <hztianxiang@corp.netease.com>
 * @module   pool/component-check/src/radio/web/ui
 */
NEJ.define( [
    '../component.js',
    'text!./component.html',
    'text!./component.css'
],function(
    Radio,
    html,
    css
){
    /**
     * Radio UI组件
     *
     * @class   module:pool/component-check/src/radio/web/ui.RadioUI
     * @extends module:pool/component-check/src/radio/component.Radio
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return Radio.$extends({
        name     : 'ux-radio',
        css      : css,
        template : html
    });
});
