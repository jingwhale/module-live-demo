/**
 * ScrollView 组件实现文件
 *
 * @version  1.0
 * @author   hzshaoyy <hzshaoyy@corp.netease.com>
 * @module   pool/component-list-view/src/scroll_view/component
 */
NEJ.define([
    '../list_view/component.js',
    'pool/component-base/src/util',
    'base/event',
    'base/element'
],function(
    Component,
    util,
    v,
    e
){
    var DEFAULT_LIMIT = 10;

    /**
     * ScrollView 组件
     *
     * @class   module:pool/component-list-view/src/scroll_view/component.ScrollView
     * @extends module:pool/component-base/src/base.Component
     *
     * @param {Object} options      - 组件构造参数
     * @param {Object} options.data - 与视图关联的数据模型
     */
    var ScrollView = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/component-list-view/src/scroll_view/component.ScrollView#config
         * @returns {void}
         */
        config: function () {

            util.extend(this, {
                settingKey: 'component-list-view-scroll-view',
                useCache: true,
                limit: DEFAULT_LIMIT
            });

            util.extend(this.data, {
                reachBottom: false,
                nomoreContent: '已经到达底部了亲'
            });

            v._$addEvent(window, 'scroll', this._onPageScroll._$bind(this));

            this.supr();
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/component-list-view/src/scroll_view/component.ScrollView#init
         * @returns {void}
         */
        init: function () {

            this.supr();
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/component-list-view/src/scroll_view/component.ScrollView#destroy
         * @returns {void}
         */
        destroy: function () {

            this.supr();
        },
        /**
         * 监听页面滚动事件
         *
         * @param evt
         * @private
         */
        _onPageScroll: function (evt) {
            var pageBox = e._$getPageBox();
            if((pageBox.scrollTop + pageBox.clientHeight*3/2 >= pageBox.scrollHeight) && !this.data.reachBottom && !this.going){
                this.going = true;
                this.go(this.data.index + 1);
            }
        },
        /**
         * 请求列表回调
         *
         * @protected
         * @method  module:pool/component-list-view/src/list_view/component.ListView#_onListLoad
         * @param   {Object} options - 请求及回调信息
         * @returns {void}
         */
        _onListLoad: function (options) {
            this.going = false;

            // check list match
            if (options.key!==this.listKey) {
                return;
            }
            // get information from cache
            var list  = this._cache._$getListInCache(options.key),
                total = this._cache._$getTotal(options.key);
            // sync index/total
            this.data.total = Math.max(
                1, Math.ceil(
                    total/this.limit
                )
            );
            this.data.index = Math.min(
                this.data.total,
                options.offset/this.limit+1
            );
            // sync list
            var end = options.offset+this.limit;
            this.data.list = list.slice(
                0,
                Math.min(end,total)
            );

            this.data.reachBottom = (end >= total);

            this.$update();
        },
    });

    return ScrollView;
});
