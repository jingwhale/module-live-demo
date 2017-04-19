/**
 * CheckUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hzlinannan <hzlinannan@corp.netease.com>
 * @module   pool/component-check/src/check/web/ui
 */
NEJ.define( [
    '../component.js',
    'text!./component.html',
    'text!./component.css'
],function(
    Check,
    html,
    css
){
    /**
     * Check UI组件
     *
     * @class   module:pool/component-check/src/check/web/ui.CheckUI
     * @extends module:pool/component-check/src/check/component.Check
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return Check.$extends({
        name     : 'ux-check',
        css      : css,
        template : html
    });
});
