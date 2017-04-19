/**
 * 树形结构缓存管理基类实现文件
 *
 * @version  1.0
 * @author   caijf <caijf@corp.netease.com>
 * @module   pool/cache-base/src/tree
 */
NEJ.define([
    'base/klass',
    'base/event',
    'base/util',
    'util/event/event',
    './base.js',
    './tree-helper.js'
],function(
    k, v, u, t, d, h,
    exports, pro
){
    /**
     * 树形结构缓存管理基类，列表对应的 KEY 说明如下
     *
     * | 键 | 描述 |
     * | :--- | :--- |
     * | xxx-list-[NID] | 某个节点下的子节点列表，其中 [NID] 表示当前结点ID |
     *
     * @class   module:pool/cache-base/src/tree.Tree
     * @extends module:pool/cache-base/src/tree.Tree
     *
     * @param   {Object} options - 构造参数
     */
    var Tree = k._$klass();
    pro = Tree._$extend(d.Cache);

    /**
     * 控件初始化
     *
     * @private
     * @method  module:pool/cache-base/src/tree.Tree#__init
     * @param   {Object} options - 构造参数
     * @returns {void}
     */
    pro.__init = function (options) {
        this._listKey = 'list-tree';
        this.__super(options);
    };

    /**
     * 从列表标识中获取树标识
     *
     * @private
     * @method  module:pool/cache-base/src/tree.Tree#_getHelperKeyFromListKey
     * @param   {Object} key - 列表标识
     * @returns {String} 树标识
     */
    pro._getHelperKeyFromListKey = function (key) {
        return (key||'').replace(/\-[\d]+$/,'');
    };

    /**
     * 触发列表变化事件
     *
     * @private
     * @method  module:pool/cache-base/src/tree.Tree#_doEmitListChange
     * @param   {Object} event - 事件信息
     * @returns {void}
     */
    pro._doEmitListChange = function (event) {
        event = event || {};
        u._$merge(event,{
            key: '',
            action: 'refresh'
        });
        this.__super(event);
    };

    /**
     * 取列表请求标识
     *
     * @private
     * @method   module:pool/cache-base/src/tree.Tree#__getListReqKey
     * @param    {Object} options - 请求配置信息
     * @returns  {String} 请求标识
     */
    pro.__getListReqKey = function (options) {
        var key = this._getHelperKeyFromListKey(options.key);
        return 'r-'+key+'-'+options.offset+'-'+options.limit;
    };

    /**
     * 获取加载单项的请求标识
     *
     * @private
     * @method  module:pool/cache-base/src/tree.Tree#__getItemReqKey
     * @param   {Object} options - 请求配置
     * @returns {String} 请求标识
     */
    pro.__getItemReqKey = function (options) {
        var key = this._getHelperKeyFromListKey(options.key);
        return 'r-'+key+'-'+options.id;
    };

    /**
     * 从服务器端载入列表
     *
     * @private
     * @method  module:pool/cache-base/src/tree.Tree#_doLoadList
     * @param   {Object}   options        - 请求信息
     * @param   {String}   options.key    - 列表标识
     * @param   {String}   options.data   - 请求相关数据
     * @param   {Function} options.onload - 列表项载入回调
     * @returns {void}
     */
    pro._doLoadList = function (options) {
        this.__super(options);
        // delegate onload callback
        var that = this,
            callback = options.onload,
            key = options.key||this._listKey;
        // ret - {list:[]}
        var dobuild = function (ret) {
            var helper = h.TreeHelper._$allocate(ret),
                hkey = that._getHelperKeyFromListKey(key);
            that.__setDataInCache(hkey+'-helper',helper);
            // fix re-allocate error
            callback.call(that,{
                total: 0,
                list: []
            });
        };
        // ret - {total:0,list:[]}
        options.onload = function (ret) {
            if (!ret||!ret.list||!ret.list.length){
                var def = {
                    id: h.TREE_ROOT_ID,
                    parent:h.TREE_ROOT_PARENT
                };
                ret = {
                    list: [u._$merge(
                        {},options.data,def
                    )]
                };
                // create tree root node
                // var def = {parent:h.TREE_ROOT};
                // that._doAddItem({
                //     key: options.key,
                //     data: u._$merge(def,options.data),
                //     onload: function (node) {
                //         dobuild({list:[node]});
                //     }
                // });
            }
            dobuild(ret);
        };
    };

    /**
     * 取树形辅助实例
     *
     * @private
     * @method  module:pool/cache-base/src/tree.Tree#_getTreeHelper
     * @param   {String} key - 树标识
     * @returns {pool/cache-base/src/tree-helper.TreeHelper} 树形辅助实例
     */
    pro._getTreeHelper = function (key) {
        key = this._getHelperKeyFromListKey(key)
        return this.__getDataInCache(
            (key||this._listKey)+'-helper'
        );
    };

    /**
     * 重写从缓存里取列表接口
     *
     * @method  module:pool/cache-base/src/tree.Tree#_$getListInCache
     * @param   {String} key - 列表标识，用 - 分隔最后一位表示节点ID
     * @returns {Array}  列表信息
     */
    pro._$getListInCache = function (key) {
        var helper = this._getTreeHelper(key),
            ret = [];
        if (!!helper){
            var id = (key||'').split('-').pop(),
                root = helper.getNodeById(id)||helper.getTree();
            ret = root.children||[];
        }
        return ret;
    };

    /**
     * 重写从缓存里取列表项接口
     *
     * @method  module:pool/cache-base/src/tree.Tree#_$getItemInCache
     * @param   {Number} id  - 列表项标识
     * @param   {String} key - 节点所在的树标识
     * @returns {Object} 列表项
     */
    pro._$getItemInCache = function (id, key) {
        var helper = this._getTreeHelper(key);
        return !helper?null:helper.getNodeById(id);
    };

    /**
     * 添加列表项至服务器
     *
     * @private
     * @method  module:pool/cache-base/src/tree.Tree#_doAddItem
     * @param   {Object}   options        - 请求信息
     * @param   {String}   options.key    - 列表标识
     * @param   {Object}   options.data   - 请求相关数据
     * @param   {Number}   options.data.parent - 父节点标识
     * @param   {String}   options.index  - 插入位置
     * @param   {Function} options.onload - 列表项载入回调
     * @returns {void}
     */
    pro._doAddItem = function (options) {
        // delegate onload callback
        var that = this,
            callback = options.onload,
            data = options.data||{},
            key = options.key||this._listKey,
            parent = data.parent;
        // check parent
        if (!parent){
            var root = this.getTreeRoot(key);
            parent = root.id;
            data.parent = parent;
            options.data = data;
        }
        // create tree root first
        if (parent==h.TREE_ROOT_ID){
            var opt = data,
                def = {parent:h.TREE_ROOT_PARENT};
            options.data = u._$merge({},opt,def);
            options.onload = function (ret) {
                // update root
                var helper = that._getTreeHelper(key);
                helper.fix(ret);
                // add node
                opt.parent = ret.id;
                options.data = opt;
                options.onload = callback;
                that._doAddItem(options);
            };
            return;
        }
        // create common node
        // ret - {id:111,parent:222}
        options.onload = function (ret) {
            var helper = that._getTreeHelper(key);
            if (!helper){
                callback.call(that, ret);
                return;
            }
            var node = helper.add(ret),
                inf = helper.diff({
                    action: h.ACTION_TYPE_ADD,
                    order: helper.getSortOrder(
                        node.id, options.index
                    ),
                    to: node.parent,
                    id: node.id
                });
            if (!!inf){
                that._doUpdateItem({
                    key: key,
                    data: inf,
                    onload: function () {
                        callback.call(that);
                    }
                });
            }else{
                helper.sort(node.parent);
                callback.call(that);
            }
        };
    };

    /**
     * 从服务器上删除列表项
     *
     * @private
     * @method  module:pool/cache-base/src/tree.Tree#_doDeleteItem
     * @param   {Object}   options        - 请求信息
     * @param   {String}   options.key    - 列表标识
     * @param   {Number}   options.id     - 删除的节点ID
     * @param   {Function} options.onload - 列表项载入回调
     * @returns {void}
     */
    pro._doDeleteItem = function (options) {
        // delegate onload callback
        var that = this,
            callback = options.onload,
            key = options.key||this._listKey,
            helper = this._getTreeHelper(key);
        options.data = helper.search(options.id);
        // ret - [12,34,56]
        options.onload = function (list) {
            var ret = helper.diff({
                action: h.ACTION_TYPE_REMOVE,
                id: options.id
            });
            helper.remove(options.id);
            if (!!ret){
                that._doUpdateItem({
                    key: key,
                    data: ret,
                    onload: function () {
                        callback.call(that,true);
                    }
                });
            }else{
                callback.call(that,true);
            }
        };
    };

    /**
     * 更新列表项至服务器
     *
     * @private
     * @method  module:pool/cache-base/src/tree.Tree#_doUpdateItem
     * @param   {Object}   options        - 请求信息
     * @param   {String}   options.key    - 列表标识
     * @param   {Array}    options.data   - 请求相关数据
     * @param   {Function} options.onload - 列表项载入回调
     * @returns {void}
     */
    pro._doUpdateItem = function (options) {
        // delegate onload callback
        var that = this,
            callback = options.onload,
            key = options.key||this._listKey,
            map = {};
        u._$forEach(options.data,function (it, index) {
            map[it.id] = index;
        });
        // list - [{id:111,parent:222}]
        options.onload = function (list) {
            list.sort(function (a,b) {
                return map[a.id]-map[b.id];
            });
            var helper = that._getTreeHelper(key);
            u._$forEach(list,function (it) {
                helper.update(it);
                helper.sort(it.id);
            });
            callback.call(that,that.getTreeRoot(key));
        };
    };

    /**
     * 排序/移动节点
     *
     * @method  module:pool/cache-base/src/tree.Tree#move
     * @param   {Object} options       - 请求信息
     * @param   {String} options.key   - 列表标识
     * @param   {Number} options.id    - 操作移动的节点标识
     * @param   {Number} options.to    - 移动的目标节点标识
     * @param   {Number} options.delta - 相对于目标节点的偏移
     * @returns {void}
     */
    pro.move = function (options) {
        var helper = this._getTreeHelper(options.key),
            parent = helper.getParent(options.to),
            opt = {
                id: options.id,
                order: helper.getSortByDelta(
                    options.id, options.to, options.delta
                )
            };
        // check action
        if (options.delta!==h.INSERT_APPEND&&
            helper.getParent(options.id)===parent){
            // sort list
            opt.action = h.ACTION_TYPE_SORT_ORDER;
        }else{
            // move node
            opt.action = h.ACTION_TYPE_MOVE;
            opt.to = parent.id;
            if (options.delta===h.INSERT_APPEND){
                opt.to = options.to;
            }
        }
        var ret = helper.diff(opt);
        if (!!ret){
            this._$updateItem({
                key: options.key,
                data: ret
            });
        }
    };

    // /**
    //  * 排序节点
    //  *
    //  * @method  module:pool/cache-base/src/tree.Tree#sort
    //  * @param   {Object} options       - 请求信息
    //  * @param   {String} options.key   - 列表标识
    //  * @param   {Number} options.id    - 操作移动的节点标识
    //  * @param   {Number} options.index - 节点插入位置
    //  * @returns {void}
    //  */
    // pro.sort = function (options) {
    //     var helper = this._getTreeHelper(options.key),
    //         ret = helper.diff({
    //             action: h.ACTION_TYPE_SORT_ORDER,
    //             order: helper.getSortOrder(
    //                 options.id, options.index
    //             ),
    //             id: options.id
    //         });
    //     if (!!ret){
    //         this._$updateItem({
    //             key: options.key,
    //             data: ret
    //         });
    //     }
    // };

    /**
     * 取树的根节点
     *
     * @method  module:pool/cache-base/src/tree.Tree#getTreeRoot
     * @param   {String} key - 树标识
     * @returns {Object} 树的根节点
     */
    pro.getTreeRoot = function (key) {
        var helper = this._getTreeHelper(key);
        if (!!helper){
            return helper.getTree();
        }
    };

    /**
     * 取根节点到指定节点的路径
     *
     * @method  module:pool/cache-base/src/tree.Tree#getNodePath
     * @param   {Number} id  - 节点标识
     * @param   {String} key - 树标识
     * @returns {Object} 树的路径信息
     */
    pro.getNodePath = function (id, key) {
        var helper = this._getTreeHelper(key);
        if (!!helper){
            return helper.getPath(id);
        }
    };

    /**
     * 取节点下的树的深度
     *
     * @method  module:pool/cache-base/src/tree.Tree#getNodeDeep
     * @param   {Number} id  - 节点标识
     * @param   {String}  key - 树标识
     * @returns {Number} 节点下的树的深度
     */
    pro.getNodeDeep = function (id, key) {
        var helper = this._getTreeHelper(key);
        if (!!helper){
            return helper.getDeep(id);
        }
    };

    /**
     * 取树的深度
     *
     * @method  module:pool/cache-base/src/tree.Tree#getTreeDeep
     * @param   {String}  key - 树标识
     * @returns {Number}  树的深度
     */
    pro.getTreeDeep = function (key) {
        var helper = this._getTreeHelper(key);
        if (!!helper){
            return helper.getTreeDeep();
        }
    };

    /**
     * 取树的深度
     *
     * @method  module:pool/cache-base/src/tree.Tree#getNodesByDeep
     * @param   {Number}  deep - 深度
     * @param   {String}  key  - 树标识
     * @returns {Object}  节点列表信息, e.g. {list:[{id:1...},{id:3...}], ids:[1,3]}
     */
    pro.getNodesByDeep = function (deep, key) {
        var helper = this._getTreeHelper(key);
        if (!!helper){
            return helper.getNodesByDeep(deep);
        }
    };

    /**
     * 判断父节点是否包含给定的子节点
     *
     * @method  module:pool/cache-base/src/tree.Tree#isNodeContains
     * @param   {Number} pid - 父节点标识
     * @param   {Number} nid - 子节点标识
     * @param   {String}  key - 树标识
     * @returns {Boolean} 父节点是否包含子节点
     */
    pro.isNodeContains = function (pid, nid, key) {
        var helper = this._getTreeHelper(key);
        if (!!helper){
            return helper.isContains(pid, nid);
        }
    };

    /**
     * 执行缓存的同步方法，执行完毕后立即回收缓存
     *
     * ```javascript
     * NEJ.define([
     *     'pool/cache-base/src/tree'
     * ],function(t){
     *
     *     // 使用缓存
     *     var ret = t.$do(function(cache){
     *         return cache.getSomething();
     *     });
     *
     *     // TODO something
     * }
     * ```
     *
     * @method module:pool/cache-base/src/tree.$do
     * @param  {Function} func - 执行回调
     * @return {Function}        回调返回结果
     */
    exports.$do = d.$do._$bind(null,Tree);
    // export config api
    exports.config = d.config;
    // 导出
    exports.Tree = Tree;
});
