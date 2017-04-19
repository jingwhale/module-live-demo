/**
 *  FilterSearch 类文件
 *
 *  @version  1.0
 *  @author   cqh <cqh@corp.netease.com>
 *  @module   pool/component-input/src/filter-search/component
 */

NEJ.define( [
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    'pool/component-button/src/button/ui',
    'pool/component-dropdown/src/dropdown/ui',
    '../input/ui.js'
],function(
    Component,
    util
) {

    /**
     * FilterSearch组件基类
     *
     * @example
     * new FilterSearch({
     *     data: {}
     * }).$inject('#j-parentNode');
     *
     * @class module:pool/component-input/src/filter-search/component.FilterSearch
     * @extends module:pool/component-base/src/base.Base
     * @param {object}              options.data                            绑定属性
     * @param {array}               options.data.source=[]                  过滤列表
     * @param {string}              options.data.source.type                item:类型目前只支持input/dropdown
     * @param {string}              options.data.source.labelName           item:label文字
     * @param {string}              options.data.source.value               item:值
     * @param {object}              options.data.source.source              item.type = dropdown时参考 dropdown输入的source
     * @param {object}              [options.data.source.key='id']          item.type = dropdown时, value 值读取的字段，默认id
     * @param {string}              [options.data.class=""]                 补充class
     * @param {string}              [options.data.btnText="筛选"]            btnText筛选按钮文案
     *
     */
    return Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method module:pool/component-input/src/filter-search/component.FilterSearch#config
         * @return {Void}
         */
        config: function () {
            util.extend(this.data, {
                "class": "",
                "btnText": "筛选",
                "source": []
            });

            this.supr();
        },
        /**
         * 模板编译 之后(即活动dom已经产生)被调用. 你可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method module:pool/component-input/src/filter-search/component.FilterSearch#init
         * @return {Void}
         */
        init: function(){
            this.supr();

        },
        /**
         * input中输入回车 或者点击搜索按钮出发
         *
         * @public
         * @method module:pool/component-input/src/filter-search/component.FilterSearch#submit
         * @return {Void}
         */
        doSearch: function () {

            /**
             * input 出发search
             *
             * @public
             * @event module:pool/component-input/src/filter-search/component.FilterSearch#search
             * @param  {Object} 当前组件对象
             * @param  {Object} result 当前组件的source,自行获取item.value
             */

            this.$emit('search',{
                sender: this,
                result: this.data.source
            });
        }
    });

});
