/**
 *  search 类文件
 *
 *  @version  1.0
 *  @author   hzshaoyy <hzshaoyy@corp.netease.com>
 *  @module   pool/component-input/src/search/component
 */

NEJ.define( [
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    'pool/component-button/src/button/ui',
    '../input/ui.js'
],function(
    Component,
    util
) {
    // constant variables

    /**
     * Search组件基类
     *
     * @example
     * new Search({
     *     data: {}
     * }).$inject('#j-parentNode');
     *
     * @class module:pool/component-input/src/search/component.Search
     * @extends module:pool/component-base/src/base.Base
     * @param {object}              options.data                            绑定属性
     * @param {string}              [options.data.placeholder=""]           占位符
     * @param {string}              [options.data.class=""]                 补充class
     * @param {string}              [options.data.width="w100"]             宽度
     * @param {string}              [options.data.btnText="搜索"]            btnText搜索按钮文案
     * @param {string}              [options.data.size="base"]              尺寸
     * @param {boolean}              [options.data.resetBtn=true]              是否有删除按钮
     *
     */
    return Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method module:pool/component-input/src/search/component.Search#config
         * @return {Void}
         */
        config: function () {
            util.extend(this.data, {
                "placeholder": "搜索",
                "class": "",
                "width": "w100",
                "btnText": "<span class='ux-icon-search'></span>",
                "size": "base",
                resetBtn: true
            });

            this.supr();
        },
        /**
         * 模板编译 之后(即活动dom已经产生)被调用. 你可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method module:pool/component-input/src/search/component.Search#init
         * @return {Void}
         */
        init: function(){
            this.supr();

        },
        /**
         * input中输入回车 或者点击搜索按钮出发
         *
         * @public
         * @method module:pool/component-input/src/search/component.Search#submit
         * @return {Void}
         */
        submit: function () {

            /**
             * input 触发search
             *
             * @public
             * @event module:pool/component-input/src/search/component.Search#search
             * @param {String} value            搜索框的内容
             */

            this.$emit('search',{
                value: typeof this.data.value == 'string' ? this.data.value.trim() : ''
            });
        },

        /**
         * 点击重置按钮
         *
         * @public
         * @method module:pool/component-input/src/search/component.Search#reset
         * @return {Void}
         */
        reset: function(){
            this.data.value = '';
            this.submit();
        }
    });

});
