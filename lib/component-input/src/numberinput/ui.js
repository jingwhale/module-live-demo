/**
 *  InputUI文件
 *
 *  @version  1.0
 *  @author   hzshaoyy <hzshaoyy@corp.netease.com>
 *  @module   pool/component-input/src/numberinput/ui
 */

NEJ.define( [
    './component.js',
    'text!./component.html',
    'text!./component.css'
],function(
    NumberInput,
    html,
    css
) {
    /**
     *  InputUI组件
     *
     *  @class   module:pool/component-input/src/numberinput/ui.NumberInputUI
     *  @extends module:pool/component-input/src/numberinput/ui.NumberInputUI
     *
     *  @param {Object} options
     *  @param {Object} options.data 与视图关联的数据模型
     */
    return NumberInput.$extends({
        name: 'ux-numberinput',
        template: html,
        css: css
    });
});
