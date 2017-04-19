/**
 *  InputUI文件
 *
 *  @version  1.0
 *  @author   hzshaoyy <hzshaoyy@corp.netease.com>
 *  @module   pool/component-input/src/base/ui
 */

NEJ.define( [
    './component.js',
    'text!./component.css'
],function(
    Input,
    css
) {
    /**
     *  InputUI组件
     *
     *  @class   module:pool/component-input/src/base/ui.BaseInputUI
     *  @extends module:pool/component-input/src/base/ui.BaseInput
     *
     *  @param {Object} options
     *  @param {Object} options.data 与视图关联的数据模型
     */
    return Input.$extends({
        css: css
    });
});
