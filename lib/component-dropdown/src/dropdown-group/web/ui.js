/**
 * Dropdown-GroupUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hzlixinxin <hzlixinxin@corp.netease.com>
 * @module   pool/component-dropdown/src/dropdown-group/ui
 */
NEJ.define( [
    '../component.js',
    'text!./component.html',
    'text!./component.css'
],function(
    DropdownGroup,
    html,
    css
){
    /**
     * Select_group UI组件
     *
     * @class   module:pool/component-dropdown/src/dropdown-group/ui.DropdownGroup
     * @extends module:pool/component-dropdown/src/dropdown-group.DropdownGroup
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return DropdownGroup.$extends({
        name     : 'ux-dropdown-group',
        css      : css,
        template : html
    });
});
