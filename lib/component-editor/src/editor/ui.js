/**
 * EditorUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hzliujunwei <hzliujunwei@corp.netease.com>
 * @module   pool/component-editor/src/editor/ui
 */
NEJ.define( [
    './component.js',
    'text!./component.html',
    'css!./component.css'
],function(
    Editor,
    html,
    css
){
    /**
     * Editor UI组件
     *
     * @class   module:pool/component-editor/src/editor/ui.EditorUI
     * @extends module:pool/component-editor/src/editor.Editor
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return Editor.$extends({
        name     : 'ux-editor',
        css      : css,
        template : html
    });
});
