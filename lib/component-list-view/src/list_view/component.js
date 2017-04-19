/**
 * ListView 组件实现文件
 *
 * @version  1.0
 * @author   hzshaqihe <hzshaqihe@corp.netease.com>
 * @module   pool/component-list-view/src/list_view/component
 */
NEJ.define([
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    'base/event',
    'base/util'
],function(
    Component,
    util,
    v,
    u,
    exports
){
    // constant variables
    var DEFAULT_INDEX = 1,
        DEFAULT_TOTAL = 1,
        DEFAULT_TOTAL_COUNT = 0,
        DEFAULT_LIMIT = 20;

    /**
     * 列表状态 - 加载中
     *
     * @member {Number} module:pool/component-list-view/src/list_view/component.STATUS_LOADING
     */
    exports.STATUS_LOADING = 1;

    /**
     * 列表状态 - 列表正常状态
     *
     * @member {Number} module:pool/component-list-view/src/list_view/component.STATUS_LOADING
     */
    exports.STATUS_DONE = 2;

    /**
     * 列表状态 - 列表为空
     *
     * @member {Number} module:pool/component-list-view/src/list_view/component.STATUS_EMPTY
     */
    exports.STATUS_EMPTY = 3;

    /**
     * 列表状态 - 列表加载异常
     *
     * @member {Number} module:pool/component-list-view/src/list_view/component.STATUS_EMPTY
     */
    exports.STATUS_ERROR = 4;

    /**
     * ListView 组件基类
     *
     * @example
     *
     *  var XxxxListView = ListView.extends({});
     *
     *
     * @class   module:pool/component-list-view/src/list_view/component.ListView
     * @extends module:pool/component-base/src/base.Component
     *
     * @param   {Object}  options                - 组件构造参数
     * @param   {Number}  options.limit          - 每页显示个数
     * @param   {String}  options.listKey        - 列表标识
     * @param   {Object}  options.listOpt        - 取列表的额外参数
     * @param   {Object}  options.deleteOpt      - 删除Item额外参数
     * @param   {Object}  options.orderOpt       - 排序额外参数
     * @param   {Object}  options.extOpt         - 接口事件自用额外传递参数，非上传后端
     * @param   {Boolean} options.useCache       - 是否使用列表缓存
     * @param   {Object}  options.data           - 与视图关联的数据模型
     * @param   {Number} [options.data.index=1]  - 列表当前页码
     */

    /**
     * 页码变化触发事件
     *
     * @example
     *
     * NEJ.define([
     *      'pool/component-pager/src/xxxListView'
     * ],function(
     *      ListView
     * ){
     *      var listView = new ListView({
     *          data:{
     *              index: 1
     *          }
     *      });
     *      listView.$on('change',function(event){
     *          // event.index
     *          // event.last
     *      });
     * });
     *
     * @event module:pool/component-list-view/src/list_view/component.ListView#change
     * @param {Object} event       - 页码信息
     * @param {Number} event.index - 当前页码
     * @param {Number} event.last  - 上一次页码
     */

    var ListView = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/component-list-view/src/list_view/component.ListView#config
         * @returns {void}
         */
        config: function () {
            // 初始化缓存实例
            this._copt = {
                onlistload   : this._onListLoad._$bind(this),
                onitemload   : this._onItemLoad._$bind(this),
                onitemadd    : this._onItemAdd._$bind(this),
                onitemdelete : this._onItemDelete._$bind(this),
                onitemupdate : this._onItemUpdate._$bind(this),
                onsortupdate : this._onSortUpdate._$bind(this)
            };
            this._cache = this._getCacheInst(this._copt);
            if (!!this._cache){
                this._addGlobalEvent([[
                    this._cache.constructor,'listchange',
                    this._onListChange._$bind(this)
                ]]);
            }
            //设置组件配置信息的默认值
            util.extend(this, {
                limit: DEFAULT_LIMIT
            });
            // 设置组件视图模型的默认值
            util.extend(this.data, {
                /**
                 * 当前页码
                 *
                 * @member {Number} module:pool/component-list-view/src/list_view/component.ListView#index
                 */
                index: DEFAULT_INDEX,
                /**
                 * 总页码数
                 *
                 * @member {Number} module:pool/component-list-view/src/list_view/component.ListView#total
                 */
                total: DEFAULT_TOTAL,
                /**
                 * 总个数
                 *
                 * @member {Number} module:pool/component-list-view/src/list_view/component.ListView#totalCount
                 */
                totalCount: DEFAULT_TOTAL_COUNT,
                /**
                 * 列表状态，各状态见常量定义
                 *
                 * @member {Number} module:pool/component-list-view/src/list_view/component.ListView#status
                 */
                status: exports.STATUS_LOADING,
                /**
                 * 排序key
                 *
                 * @member {Number} module:pool/component-list-view/src/list_view/component.ListView#sortKey
                 */
                sortKey: 'id'
            });
            this.supr();
            this.$watch('index',this._onPageChange._$bind(this));
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/component-list-view/src/list_view/component.ListView#destroy
         * @returns {void}
         */
        destroy: function () {
            if (!!this._cache){
                this._cache._$recycle();
                delete this._cache;
            }
            this.supr();
        },

        /**
         * 获取数据缓存实例,子类需重写
         *
         * @protected
         * @method  module:pool/component-list-view/src/list_view/component.ListView#_getCacheInst
         * @param   {Object} options - 缓存事件配置信息
         * @returns {Void}
         */
        _getCacheInst: function (options) {
            // TODO overwrited by sub class
            return this.data.cache;
        },

        /**
         * 列表变化响应事件
         *
         * @protected
         * @method  module:pool/component-list-view/src/list_view/component.ListView#_onListChange
         * @param   {Object} event - 事件信息
         * @returns {void}
         */
        _onListChange: function (event) {
            var key = event.key;
            if (!key||key==this.listKey){
                switch(event.action){
                    case 'refresh':
                    case 'update':
                    case 'delete':
                    case 'add':
                        this.refresh();
                        break;
                    // TODO other cases
                }
            }
        },

        /**
         * 页码变化事件
         *
         * @private
         * @param   {Number} newValue - 当前页码
         * @param   {Number} oldValue - 原始页码
         * @returns {void}
         */
        _onPageChange: function (newValue, oldValue) {
            this.refresh();
            this.$emit('change', {
                last  : oldValue,
                index : newValue
            });
        },

        /**
         * 跳转到指定页码
         *
         * @method  module:pool/component-list-view/src/list_view/component.ListView#go
         * @param   {Number} index 页码
         * @returns {void}
         */
        go: function(index){
            if (!index||index<0) {
                return;
            }
            this.data.index = index;
            this.$update();
        },

        /**
         * 刷新组件
         *
         * @method module:pool/component-list-view/src/list_view/component.ListView#refresh
         * @returns {Void}
         */
        refresh: function(){
            // check cache instance
            if (!this._cache){
                return;
            }
            // check cache
            if (!this.useCache){
                this._cache._$clearListInCache(
                    this.listKey
                );
            }
            // default parameter
            var opt = {
                limit  : this.limit,
                offset : (this.data.index-1)*this.limit,
                pageIndex : this.data.index,
                pageSize: this.limit
            };
            // load list
            this.$update('status',exports.STATUS_LOADING);
            this._cache._$getList({
                key    : this.listKey,
                limit  : opt.limit,
                offset : opt.offset,
                data   : util.extend(opt,this.listOpt),
                ext: this.extOpt
            });
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
            // check list match
            if (options.key!==this.listKey) {
                return;
            }

            // get information from cache
            var list  = this._cache._$getListInCache(options.key),
                total = this._cache._$getTotal(options.key);

            // total count
            this.data.totalCount = total;

            // sync index/total
            this.data.total = Math.max(
                1,Math.ceil(
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
                options.offset,
                Math.min(end,total)
            );
            this.data.status =
                total<=0 ?
                    exports.STATUS_EMPTY:
                    exports.STATUS_DONE;

            this.afterListLoad(options);
            this._afterListLoad(options);
            this.$update();
        },

        /**
         * 拿到列表后调用，子类重写实现具体业务逻辑
         *
         * @deprecated
         * @method  module:pool/component-list-view/src/list_view/component.ListView#afterListLoad
         * @see     module:pool/component-list-view/src/list_view/component.ListView#_afterListLoad
         * @param   {Object} event - 列表加载信息
         * @returns {void}
         */
        afterListLoad: function(event){

        },

        /**
         * 拿到列表后调用，子类重写实现具体业务逻辑
         *
         * @protected
         * @method  module:pool/component-list-view/src/list_view/component.ListView#_afterListLoad
         * @param   {Object} event - 拿到列表后调用
         * @returns {void}
         */
        _afterListLoad: function(event){

        },

        /**
         * 加载列表项详情，子类重写实现具体业务逻辑
         * @public
         * @method  module:pool/component-list-view/src/list_view/component.ListView#getItem
         * @param   {object} id - 列表项标识
         * @returns {void}
         */
        getItem: function (id) {
            this._doGetItem(id);
        },

        /**
         * 加载列表项详情，子类重写实现具体业务逻辑
         * @protected
         * @method  module:pool/component-list-view/src/list_view/component.ListView#_doGetItem
         * @param   {object} id - 列表项标识
         * @returns {void}
         */
        _doGetItem: function (id) {
            // check cache instance
            if (!this._cache){
                return;
            }
            // load item from server
            this._cache._$getItem({
                id: id,
                ext: this.extOpt
            });
        },

        /**
         * 删除列表项回调
         *
         * @private
         * @method  module:pool/component-list-view/src/list_view/component.ListView#_onItemLoad
         * @param   {object} data - 加载的列表项
         * @returns {void}
         */
        _onItemLoad: function (event) {
            if (event.key!==this.listKey){
                return;
            }
            this._afterItemLoad(event);
        },

        /**
         * 拿到列表项后调用，子类重写实现具体业务逻辑
         *
         * @protected
         * @method  module:pool/component-list-view/src/list_view/component.ListView#_afterItemLoad
         * @param   {Object} event - 拿到列表项后调用
         * @returns {void}
         */
        _afterItemLoad: function(event){

        },

        /**
         * 添加列表项，子类实现具体业务逻辑
         * @public
         * @method  module:pool/component-list-view/src/list_view/component.ListView#addItem
         * @param   {Object} data - 添加项数据信息
         * @returns {void}
         */
        addItem: function(data) {

            this._doAddItem(data);
        },

        /**
         * 添加列表项至服务器，子类在 addItem 接口中处理完毕后调用此接口提交数据到服务器
         *
         * @protected
         * @method  module:pool/component-list-view/src/list_view/component.ListView#_doAddItem
         * @param   {Object} data - 添加项数据信息
         * @returns {void}
         */
        _doAddItem: function (data) {
            // check cache instance
            if (!this._cache){
                return;
            }
            // add item to server
            this._cache._$addItem({
                key  : this.listKey,
                data : data,
                ext: this.extOpt
            });
        },

        /**
         * 删除列表项回调
         *
         * @private
         * @method  module:pool/component-list-view/src/list_view/component.ListView#_onItemAdd
         * @param   {Object} event - 列表项添加的信息
         * @returns {void}
         */
        _onItemAdd: function (event) {
            if (event.key!==this.listKey){
                return;
            }
            this._afterItemAdd(event);
        },

        /**
         * 添加列表项后调用，子类重写实现具体业务逻辑
         *
         * @private
         * @method  module:pool/component-list-view/src/list_view/component.ListView#_afterItemAdd
         * @param   {Object} event - 添加的列表项信息
         * @returns {void}
         */
        _afterItemAdd: function(event){

        },

        /**
         * 删除列表项
         * @public
         * @method  module:pool/component-list-view/src/list_view/component.ListView#deleteItem
         * @param   {Number} id - 列表项ID
         * @returns {void}
         */

        deleteItem: function(id) {
            //  子类confirm
            this._doDeleteItem(id);
        },

        /**
         * 从服务器删除列表项，子类在 deleteItem 接口中处理完毕后调用此接口提交数据到服务器
         *
         * @protected
         * @method  module:pool/component-list-view/src/list_view/component.ListView#_doDeleteItem
         * @param   {Number} id - 列表项ID
         * @returns {void}
         */
        _doDeleteItem: function (id) {
            // check cache instance
            if (!this._cache){
                return;
            }
            // delete item from server
            this._cache._$deleteItem({
                id   : id,
                key  : this.listKey,
                data : util.extend({id:id},this.deleteOpt),
                ext: this.extOpt
            });
        },

        /**
         * 删除列表项回调
         *
         * @private
         * @method  module:pool/component-list-view/src/list_view/component.ListView#_onItemDelete
         * @param   {Object} event - 删除的列表项信息
         * @returns {void}
         */
        _onItemDelete: function (event) {
            if (event.key!==this.listKey){
                return;
            }
            this.afterItemDelete(event);
            this._afterItemDelete(event);
        },

        /**
         * 删除列表项后处理逻辑，子类重写实现具体业务逻辑
         *
         * @deprecated
         * @method  module:pool/component-list-view/src/list_view/component.ListView#afterItemDelete
         * @see     module:pool/component-list-view/src/list_view/component.ListView#_afterItemDelete
         * @param   {Object} event - 删除的列表项信息
         * @returns {void}
         */
        afterItemDelete: function(event){

        },

        /**
         * 删除列表项后处理逻辑，子类重写实现具体业务逻辑
         *
         * @protected
         * @method  module:pool/component-list-view/src/list_view/component.ListView#_afterItemDelete
         * @param   {Object} event - 删除的列表项信息
         * @returns {void}
         */
        _afterItemDelete: function(event){

        },

        /**
         * 修改列表项，子类重写实现具体业务逻辑
         * @public
         * @method  module:pool/component-list-view/src/list_view/component.ListView#updateItem
         * @param   {Object} data - 待更新数据
         * @returns {void}
         */
        updateItem: function(data) {
            this._doUpdateItem(data)
        },

        /**
         * 更新列表项至服务器，子类在 updateItem 接口中处理完毕后调用此接口提交数据到服务器
         *
         * @protected
         * @method  module:pool/component-list-view/src/list_view/component.ListView#_doUpdateItem
         * @param   {Object} data - 待更新数据
         * @returns {void}
         */
        _doUpdateItem: function (data) {
            // check cache instance
            if (!this._cache){
                return;
            }
            // update item to server
            this._cache._$updateItem({
                key  : this.listKey,
                data : data,
                ext: this.extOpt
            });
        },

        /**
         * 修改列表项回调，子类可重写实现具体业务逻辑
         *
         * @private
         * @method  module:pool/component-list-view/src/list_view/component.ListView#_onItemUpdate
         * @param   {Object} event - 更新的列表项信息
         * @returns {void}
         */
        _onItemUpdate: function (event) {
            if (event.key!==this.listKey){
                return;
            }
            this._afterItemUpdate(event);
        },

        /**
         * 列表项更新后调用，子类重写实现具体业务逻辑
         *
         * @protected
         * @method  module:pool/component-list-view/src/list_view/component.ListView#_afterItemUpdate
         * @param   {Object} event - 更新的列表项信息
         * @returns {void}
         */
        _afterItemUpdate: function(event){

        },

        /**
         * 更新列表排序
         * @public
         * @method  module:pool/component-list-view/src/list_view/component.ListView#sortItem
         * @param   {Array} data - 发送到服务器的数据id数组
         * @returns {void}
         */
        sortItem: function(data) {
            this._doSortItem(data);
        },

        /**
         * 更新列表排序
         *@protected
         * @method  module:pool/component-list-view/src/list_view/component.ListView#_doSortItem
         * @param   {Array} data - 发送到服务器的数据id数组
         * @returns {void}
         */
        _doSortItem: function(data) {
            // check cache instance
            if (!this._cache){
                return;
            }
            this._cache.updateSort({
                key  : this.listKey,
                data : this.orderOpt? util.extend({orderList: data},this.orderOpt) : data,
                ext: this.extOpt
            });
        },

        /**
         * 列表排序后回调，子类可重写实现具体业务逻辑
         *
         * @private
         * @method  module:pool/component-list-view/src/list_view/component.ListView#_onSortUpdate
         * @param   {Object} event - 更新的列表项信息
         * @returns {void}
         */
        _onSortUpdate: function (event) {
            if (event.key!==this.listKey){
                return;
            }
            this._afterSortUpdate(event);
        },

        /**
         * 列表排序后回调，子类重写实现具体业务逻辑
         *
         * @protected
         * @method  module:pool/component-list-view/src/list_view/component.ListView#_afterSortUpdate
         * @param   {Object} event - 更新的列表项信息
         * @returns {void}
         */
        _afterSortUpdate: function(event){

        },

        /**
         * 处理dragOver事件
         *
         * @public
         * @method  module:pool/component-list-view/src/list_view/component.ListView#onItemDragOver
         * @param    {Object} event - dragOver事件
         * @property {Object} event.sender    事件发送对象，为当前droppable
         * @property {Object} event.origin    拖拽源，为拖拽的draggable
         * @property {Object} event.source    拖拽起始元素
         * @property {Object} event.proxy     拖拽代理元素
         * @property {Object} event.target    拖拽目标元素
         * @property {Object} event.data      拖拽时接收到的数据
         * @property {Object} event.data.item 拖拽源数据对象
         * @property {Number} event.ratioX    鼠标指针相对于接收元素所占的长度比
         * @property {Number} event.ratioY    鼠标指针相对于接收元素所占的高度比
         * @property {Number} event.screenX   鼠标指针相对于屏幕的水平位置
         * @property {Number} event.screenY   鼠标指针相对于屏幕的垂直位置
         * @property {Number} event.clientX   鼠标指针相对于浏览器的水平位置
         * @property {Number} event.clientY   鼠标指针相对于浏览器的垂直位置
         * @property {Number} event.pageX     鼠标指针相对于页面的水平位置
         * @property {Number} event.pageY     鼠标指针相对于页面的垂直位置
         * @property {Number} event.movementX 鼠标指针水平位置相对于上次操作的偏移量
         * @property {Number} event.movementY 鼠标指针垂直位置相对于上次操作的偏移量
         * @property {Function} event.cancel  取消拖拽操作
         * @param    {Object} item            目标drop数据对象
         * @returns  {void}
         */
        onItemDragOver: function ($event, item) {
            var target = $event.target;
            Regular.dom.delClass(target, 'z-dragover-before');
            Regular.dom.delClass(target, 'z-dragover-after');
            //item.disableDrop 阻止drop
            if(item && item.disabledDrop){
                return;
            }
            if ($event.ratioY < 0.6)
                Regular.dom.addClass(target, 'z-dragover-before');
            else
                Regular.dom.addClass(target, 'z-dragover-after');
        },

        /**
         * 处理dragleave事件
         *
         * @public
         * @param    {Object} event - dragleave事件
         * @property {Object} event.sender    事件发送对象，为当前droppable
         * @property {Object} event.origin    拖拽源，为拖拽的draggable
         * @property {Object} event.source    拖拽起始元素
         * @property {Object} event.proxy     拖拽代理元素
         * @property {Object} event.target    拖拽目标元素
         * @property {Object} event.data      拖拽时接收到的数据
         * @property {Object} event.data.item 拖拽源数据对象
         * @property {Number} event.screenX   鼠标指针相对于屏幕的水平位置
         * @property {Number} event.screenY   鼠标指针相对于屏幕的垂直位置
         * @property {Number} event.clientX   鼠标指针相对于浏览器的水平位置
         * @property {Number} event.clientY   鼠标指针相对于浏览器的垂直位置
         * @property {Number} event.pageX     鼠标指针相对于页面的水平位置
         * @property {Number} event.pageY     鼠标指针相对于页面的垂直位置
         * @property {Number} event.movementX 鼠标指针水平位置相对于上次操作的偏移量
         * @property {Number} event.movementY 鼠标指针垂直位置相对于上次操作的偏移量
         * @property {Function} event.cancel  取消拖拽操作
         */
        onDragLeave: function ($event) {
            var target = $event.target;
            Regular.dom.delClass(target, 'z-dragover-before');
            Regular.dom.delClass(target, 'z-dragover-after');
        },

        /**
         * 处理drop事件
         *
         * @public
         * @param    {Object} event - drop事件
         * @property {Object} event.sender    事件发送对象，为当前droppable
         * @property {Object} event.origin    拖拽源，为拖拽的draggable
         * @property {Object} event.source    拖拽起始元素
         * @property {Object} event.proxy     拖拽代理元素
         * @property {Object} event.target    拖拽目标元素
         * @property {Object} event.data      拖拽时接收到的数据
         * @property {Object} event.data.item 拖拽源数据对象
         * @property {Number} event.ratioX    鼠标指针相对于接收元素所占的长度比
         * @property {Number} event.ratioY    鼠标指针相对于接收元素所占的高度比
         * @property {Number} event.screenX   鼠标指针相对于屏幕的水平位置
         * @property {Number} event.screenY   鼠标指针相对于屏幕的垂直位置
         * @property {Number} event.clientX   鼠标指针相对于浏览器的水平位置
         * @property {Number} event.clientY   鼠标指针相对于浏览器的垂直位置
         * @property {Number} event.pageX     鼠标指针相对于页面的水平位置
         * @property {Number} event.pageY     鼠标指针相对于页面的垂直位置
         * @property {Number} event.movementX 鼠标指针水平位置相对于上次操作的偏移量
         * @property {Number} event.movementY 鼠标指针垂直位置相对于上次操作的偏移量
         * @param    {Object} item            目标drop数据对象
         */
        onItemDrop: function ($event, item) {
            var target = $event.target;
            Regular.dom.delClass(target, 'z-dragover-before');
            Regular.dom.delClass(target, 'z-dragover-after');

            if (item === $event.data.item)
                return;
            //item.disableDrop 阻止drop
            if(item && item.disabledDrop){
                return;
            }

            var oldItem = $event.data.item;
            var oldIndex = this.data.list.indexOf(oldItem);
            this.data.list.splice(oldIndex, 1);

            var index = this.data.list.indexOf(item);
            if ($event.ratioY >= 0.6)
                index++;
            this.data.list.splice(index, 0, oldItem);

            var order = [];
            this.data.list.map(function (obj) {
                order.push(obj[this.data.sortKey || 'id']);
            }._$bind(this));

            this.sortItem(order)
        }
    });

    return ListView;
});
