/**
 * RadioGroup2 组件实现文件,逻辑完全继承RadioGroup
 *
 * @version  1.0
 * @author   hzliuzongyuan <hzliuzongyuan@corp.netease.com>
 * @module   pool/component-check/src/radio-group-2/component
 */
NEJ.define([
    '../radio-group/component.js'
], function (
    RadioGroup
) {
    /**
     * RadioGroup2 组件
     *
     * @class   module:pool/component-check/src/radio-group-2/component.RadioGroup2
     * @extends module:pool/component-check/src/radio-group/component.RadioGroup
     */
    var RadioGroup2 = RadioGroup.$extends({});

    return RadioGroup2;
});
