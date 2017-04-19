/**
 * SuggestUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hzlixinxin <hzlixinxin@corp.netease.com>
 * @module   pool/component-dropdown/src/suggest/web/ui
 */
NEJ.define( [
    '../component.js',
    'text!./component.html',
    'text!./component.css'
],function(
    Suggest,
    html,
    css
){
    /**
     * Suggest UI组件
     *
     * @class   module:pool/component-dropdown/src/suggest/web/ui.SuggestUI
     * @extends module:pool/component-dropdown/src/suggest.Suggest
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return Suggest.$extends({
        name     : 'ux-suggest',
        css      : css,
        template : html
    });
});
