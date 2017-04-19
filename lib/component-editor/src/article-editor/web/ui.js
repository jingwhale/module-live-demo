/**
 * ArticleEditorUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hzshaoyy <hzshaoyy@corp.netease.com>
 * @module   pool/component-editor/src/article-editor/ui
 */
NEJ.define( [
    '../component.js',
    'text!../../editor/component.html',
    'css!../../editor/component.css'
],function(
    ArticleEditor,
    html,
    css
){
    /**
     * ArticleEditor UI组件
     *
     * @class   module:pool/component-editor/src/article-editor/ui.ArticleEditorUI
     * @extends module:pool/component-article-editor/src/article-editor.ArticleEditor
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return ArticleEditor.$extends({
        name     : 'ux-editor-article-editor',
        css      : css,
        template : html
    });
});
