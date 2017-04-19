/**
 * ButtonUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hzshaoyy <hzshaoyy@corp.netease.com>
 * @module   pool/component-button/src/button/web/ui
 */
NEJ.define( [
    '../component.js',
    'text!./component.html',
    'text!./component.css'
],function(
    Button,
    html,
    css
){
    /**
     * Button UI组件
     *
     * @class   module:pool/component-button/src/button/web/ui.ButtonUI
     * @extends module:pool/component-button/src/button/component.Button
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return Button.$extends({
        name     : 'ux-button',
        css      : css,
        template : html
    });
});
