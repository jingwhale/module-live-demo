/**
 *  SearchUI文件
 *
 *  @version  1.0
 *  @author   hzshaoyy <hzshaoyy@corp.netease.com>
 *  @module   pool/component-input/src/search/ui
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
     *  InputUI组件
     *
     *  @class   module:pool/component-input/src/search/ui.searchUI
     *  @extends module:pool/component-input/src/search/ui.search
     *
     *  @param {Object} options
     *  @param {Object} options.data 与视图关联的数据模型
     */
    return Search.$extends({
        name: 'ux-search',
        template: html,
        css: css
    });
});
