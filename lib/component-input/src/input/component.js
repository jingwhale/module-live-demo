/**
 *  input 类文件
 *
 *  @version  1.0
 *  @author   hzshaoyy <hzshaoyy@corp.netease.com>
 *  @module   pool/component-input/src/input/component
 */

NEJ.define( [
    '../base/ui.js',
    'pool/component-base/src/util'
],function(
    Component,
    util
) {
    // constant variables

    /**
     * input组件基类
     *
     * @example
     * new Input({
     *     data: {}
     * }).$inject('#j-parentNode');
     *
     * @class module:pool/component-input/src/input/component.Input
     * @extends module:pool/component-base/src/base.Base
     * @param {object}              options.data                            绑定属性
     * @param {string}              [options.data.value=""]                 文本框的值
     * @param {string}              [options.data.type="text"]              文本框的类型 支持text number passpword hidden
     * @param {string}              [options.data.placeholder=""]           占位符
     * @param {string}              [options.data.unit=""]                  单位
     * @param {object}              [options.data.rules=null]               验证规则
     * @param {boolean}             [options.data.isRealTime=false]         是否实时显示还能输入多少字
     * @param {boolean}             [options.data.autofocus=false]          是否自动获得焦点
     * @param {boolean}             [options.data.readonly=false]           是否只读
     * @param {boolean}             [options.data.disabled=false]           是否禁用
     * @param {boolean}             [options.data.visible=true]             是否可见
     * @param {string}              [options.data.class=""]                 补充class
     * @param {string}              [options.data.size="base"]                  尺寸 xs sm lg xl
     * @param {string}              [options.data.width=""]              宽度
     *
     */
    return Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method module:pool/component-input/src/input/component.Input#config
         * @return {Void}
         */
        config: function () {
            util.extend(this.data, {
            });

            this.supr();
        },
        /**
         * 模板编译 之后(即活动dom已经产生)被调用. 你可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method module:pool/component-input/src/input/component.Input#init
         * @return {Void}
         */
        init: function(){
            this.supr();

        },
        onclick: function(_event){
            //ie9以下先赋值，否则validate更新不够及时
            if(this.data.eltIE9 && _event.target && _event.target.value != null){
                this.data.value = _event.target.value;
            }
            this.$emit('click', this.getReturnEvent());
        }
    });

});
