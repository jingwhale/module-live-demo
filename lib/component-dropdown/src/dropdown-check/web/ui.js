/**
 * DropdownCheckUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   cqh <cqh@corp.netease.com>
 * @module   pool/component-dropdown/src/dropdown-check/ui
 */
NEJ.define( [
    '../component.js',
    'text!./component.html',
    'text!./component.css'
],function(
    DropdownCheck,
    html,
    css
){
    /**
     * DropdownCheck UI组件
     *
     * @class   module:pool/component-dropdown/src/dropdown-check/ui.DropdownCheckUI
     * @extends module:pool/component-dropdown/src/dropdown-check.DropdownCheck
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return DropdownCheck.$extends({
        name     : 'ux-dropdown-check',
        css      : css,
        template : html
    });
});
