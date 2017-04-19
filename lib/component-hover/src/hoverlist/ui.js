/**
 * HoverlistUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hzshenhongliang <hzshenhongliang@corp.netease.com>
 * @module   pool/component-hover/src/hoverlist/ui
 */

NEJ.define([
    './component.js',
    'text!./component.html',
    'text!./component.css'
], function(
    Hoverlist,
    html,
    css
) {

    /**
     * Hoverlist UI组件
     *
     * @class   module:pool/component-hover/src/hoverlist/ui.HoverlistUI
     * @extends module:pool/component-hoverlist/src/hoverlist.Hoverlist
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return Hoverlist.$extends({
        name: 'ux-hoverlist',
        css: css,
        template: html
    });
});
