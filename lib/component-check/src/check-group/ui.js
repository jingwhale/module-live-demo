/**
 * CheckGroupUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hzlinannan <hzlinannan@corp.netease.com>
 * @module   pool/component-check/src/check-group/ui
 */
NEJ.define( [
    './component.js',
    'text!./web/component.html',
    'text!./web/component.css'
],function(
    CheckGroup,
    html,
    css
){
    /**
     * CheckGroup UI组件
     *
     * @class   module:pool/component-check/src/check-group/ui.CheckGroupUI
     * @extends module:pool/component-check/src/check-group/component.CheckGroup
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return CheckGroup.$extends({
        name     : 'ux-check-group',
        css      : css,
        template : html
    });
});
