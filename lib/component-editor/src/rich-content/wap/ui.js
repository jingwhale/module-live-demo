/**
 * RichContentUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hzshaoyy <hzshaoyy@corp.netease.com>
 * @module   pool/component-editor/src/rich-content/wap/ui
 */
NEJ.define( [
    '../component.js',
    'text!./component.html',
    'css!./component.css'
],function(
    RichContent,
    html,
    css
){
    /**
     * RichContent UI组件
     *
     * @class   module:pool/component-editor/src/rich-content/ui.RichContentUI
     * @extends module:pool/component-rich-content/src/rich-content.RichContent
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return RichContent.$extends({
        name     : 'ux-editor-rich-content',
        css      : css,
        template : html
    });
});
