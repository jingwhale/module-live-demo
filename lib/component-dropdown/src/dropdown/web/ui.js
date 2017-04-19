/**
 * DropdownUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hzlixinxin <hzlixinxin@corp.netease.com>
 * @module   pool/component-dropdown/src/dropdown/ui
 */
NEJ.define( [
    '../component.js',
    'text!./component.html',
    'text!./component.css'
],function(
    Dropdown,
    html,
    css
){
    /**
     * Dropdown UI组件
     *
     * @class   module:pool/component-dropdown/src/dropdown/ui.DropdownUI
     * @extends module:pool/component-dropdown/src/dropdown.Dropdown
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return Dropdown.$extends({
        name     : 'ux-dropdown',
        css      : css,
        template : html
    });
});
