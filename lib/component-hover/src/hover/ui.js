/**
 * HoverUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hzshenhongliang <hzshenhongliang@corp.netease.com>
 * @module   pool/component-hover/src/hover/ui
 */
NEJ.define([
    './component.js',
    'text!./component.html',
    'text!./component.css'
], function(
    Hover,
    html,
    css
) {
    /**
     * Hover UI组件
     *
     * @class   module:pool/component-hover/src/hover/ui.HoverUI
     * @extends module:pool/component-hover/src/hover.Hover
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return Hover.$extends({
        name: 'ux-hover',
        css: css,
        template: html
    });
});
