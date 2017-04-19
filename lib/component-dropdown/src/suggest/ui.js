/**
 * SuggestUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hzlixinxin <hzlixinxin@corp.netease.com>
 * @module   pool/component-dropdown/src/suggest/ui
 */
NEJ.define( [
    './component.js',
    'text!./web/component.html',
    'text!./web/component.css'
],function(
    Suggest,
    html,
    css
){
    /**
     * Suggest UI组件
     *
     * @class   module:pool/component-dropdown/src/suggest/ui.SuggestUI
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
