/**
 *  FilterSearchUI文件
 *
 *  @version  1.0
 *  @author   cqh <cqh@corp.netease.com>
 *  @module   pool/component-input/src/filter-search/ui
 */

NEJ.define( [
    './component.js',
    'text!./component.html',
    'text!./component.css'
],function(
    Search,
    html,
    css
) {
    /**
     *  FilterSearchUI文件
     *
     *  @class   module:pool/component-input/src/filter-search/ui.filterSearchUI
     *  @extends module:pool/component-input/src/filter-search/ui.filterSearch
     *
     *  @param {Object} options
     *  @param {Object} options.data 与视图关联的数据模型
     */
    return Search.$extends({
        name: 'ux-filter-search',
        template: html,
        css: css
    });
});
