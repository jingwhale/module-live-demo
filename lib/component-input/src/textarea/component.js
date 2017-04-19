/**
 *  input 类文件
 *
 *  @version  1.0
 *  @author   hzshaoyy <hzshaoyy@corp.netease.com>
 *  @module   pool/component-input/src/textarea/component
 */

NEJ.define([
    '../base/ui.js',
    'pool/component-base/src/util',
    'lib/base/event'
], function (Component,
             util,
             v) {
    /**
     * textarea组件基类
     *
     * @example
     * new Textarea({
     *     data: {}
     * }).$inject('#j-parentNode');
     *
     * @class  module:pool/component-input/src/textarea/component.Textarea
     * @extends module:pool/component-input/src/base/component.BaseInput
     *
     * @param {object}              options.data                            绑定属性
     * @param {string}              [options.data.value=""]                 文本框的值
     * @param {string}              [options.data.type="text"]              文本框的类型 支持text number passpword hidden
     * @param {string}              [options.data.placeholder=""]           占位符
     * @param {string}              [options.data.unit=""]                  单位
     * @param {object}              [options.data.rules=null]               验证规则
     * @param {boolean}             [options.data.autoValidating=false]     是否需要实时验证,配合输入的时候,显示还能输入多少字
     * @param {boolean}             [options.data.autofocus=false]          是否自动获得焦点
     * @param {boolean}             [options.data.autoHeight=false]         是否自动计算高度
     * @param {boolean}             [options.data.initHeight=28]            如果开启了自动计算高度，设置该高度后会影响初始显示高度
     * @param {boolean}             [options.data.readonly=false]           是否只读
     * @param {boolean}             [options.data.disabled=false]           是否禁用
     * @param {string}              [options.data.class=""]                 补充class
     * @param {string}              [options.data.size=""]                  尺寸 xs sm lg xl
     * @param {string}              [options.data.width="100"]              宽度
     *
     */
    return Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method module:pool/component-input/src/textarea/component.Textarea#config
         * @return {Void}
         */
        config: function () {

            util.extend(this.data, {
                autoHeight: false,
                initHeight: 28
            });
            this.data.height = this.data.initHeight;
            this.supr();

        },
        /**
         * 模板编译 之后(即活动dom已经产生)被调用. 你可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method module:pool/component-input/src/textarea/component.Textarea#init
         * @return {Void}
         */
        init: function () {
            this.supr();
            if (this.data.autoHeight) {
                v._$addEvent(this.$refs.input, 'input', function (e) {
                    this.data.height = 0;
                    this.$update();
                    this.data.height = e.target.scrollHeight + 2;
                    e.stopPropagation();
                    this.$update();
                }._$bind(this));
            }
        }
    });

});
