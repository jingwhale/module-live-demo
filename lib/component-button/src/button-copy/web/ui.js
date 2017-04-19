/**
 * ButtonCopyUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hzshaoyy <hzshaoyy@corp.netease.com>
 * @module   pool/component-button/src/button-copy/web/ui
 */
NEJ.define( [
    '../component.js',
    'text!./component.html',
    'text!../../button/web/component.css'
],function(
    ButtonCopy,
    html,
    css
){
    /**
     * ButtonCopy UI组件
     *
     * @class   module:pool/component-button/src/button-copy/web/ui.ButtonCopyUI
     * @extends module:pool/component-button-copy/src/button-copy.ButtonCopy
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return ButtonCopy.$extends({
        name     : 'ux-button-button-copy',
        css      : css,
        template : html
    });
});
