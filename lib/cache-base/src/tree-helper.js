/**
 * 树形结构辅助类实现文件
 *
 * @version  1.0
 * @author   caijf <caijf@corp.netease.com>
 * @module   pool/cache-base/src/tree-helper
 */
NEJ.define([
    'base/klass',
    'base/util',
    'base/element',
    './base.js'
],function (
    k, u, e, d,
    exports,
    pro
) {
    /**
     * 树的根节点标识
     *
     * @member {Number} module:pool/cache-base/src/tree-helper.TREE_ROOT_ID
     */
    exports.TREE_ROOT_ID = -2;

    /**
     * 树的根节点的父节点标识
     *
     * @member {Number} module:pool/cache-base/src/tree-helper.TREE_ROOT_PARENT
     */
    exports.TREE_ROOT_PARENT = -1;

    /**
     * 自定义排序模式
     *
     * @member {Number} module:pool/cache-base/src/tree-helper.SORT_MODE_ORDER
     */
    exports.SORT_MODE_ORDER = 0;

    /**
     * 按照字段排序模式
     *
     * @member {Number} module:pool/cache-base/src/tree-helper.SORT_MODE_FIELD
     */
    exports.SORT_MODE_FIELD = 1;

    /**
     * 操作类型 - 添加节点
     *
     * @member {Number} module:pool/cache-base/src/tree-helper.ACTION_TYPE_ADD
     */
    exports.ACTION_TYPE_ADD  = 1;

    /**
     * 操作类型 - 移动节点
     *
     * @member {Number} module:pool/cache-base/src/tree-helper.ACTION_TYPE_MOVE
     */
    exports.ACTION_TYPE_MOVE = 2;

    /**
     * 操作类型 - 删除节点操作
     *
     * @member {Number} module:pool/cache-base/src/tree-helper.ACTION_TYPE_REMOVE
     */
    exports.ACTION_TYPE_REMOVE = 3;

    /**
     * 操作类型 - 自定义排序节点
     *
     * @member {Number} module:pool/cache-base/src/tree-helper.ACTION_TYPE_SORT_ORDER
     */
    exports.ACTION_TYPE_SORT_ORDER = 4;

    /**
     * 操作类型 - 字段排序节点
     *
     * @member {Number} module:pool/cache-base/src/tree-helper.ACTION_TYPE_SORT_FIELD
     */
    exports.ACTION_TYPE_SORT_FIELD = 5;

    /**
     * 插入节点位置 - 开始之前
     *
     * @member {Number} module:pool/cache-base/src/tree-helper.INSERT_BEFORE_BEGIN
     */
    exports.INSERT_BEFORE_BEGIN = -1;

    /**
     * 插入节点位置 - 尾部之后
     *
     * @member {Number} module:pool/cache-base/src/tree-helper.INSERT_AFTER_END
     */
    exports.INSERT_AFTER_END = 1;

    /**
     * 插入节点位置 - 子节点追加
     *
     * @member {Number} module:pool/cache-base/src/tree-helper.INSERT_APPEND
     */
    exports.INSERT_APPEND = 0;

    /**
     * 树的深度遍历方式 - 后序遍历
     *
     * @member {String} module:pool/cache-base/src/tree-helper.VISIT_TYPE_LRD
     */
    exports.VISIT_TYPE_LRD = 0;

    /**
     * 树的深度遍历方式 - 先序遍历
     *
     * @member {String} module:pool/cache-base/src/tree-helper.VISIT_TYPE_DLR
     */
    exports.VISIT_TYPE_DLR = 1;

    /**
     * 树的广度遍历方式 - 从左到右
     *
     * @member {String} module:pool/cache-base/src/tree-helper.VISIT_TYPE_L2R
     */
    exports.VISIT_TYPE_L2R = 0;

    /**
     * 树的广度遍历方式 - 从右到左
     *
     * @member {String} module:pool/cache-base/src/tree-helper.VISIT_TYPE_R2L
     */
    exports.VISIT_TYPE_R2L = 1;

    /**
     * 树形结构辅助类
     *
     * @class   module:pool/cache-base/src/tree-helper.TreeHelper
     * @extends module:pool/cache-base/src/base.Cache
     *
     * @param   {Object} options      - 构造参数
     * @param   {Array}  options.list - 节点列表
     * @param   {String} options.key  - 主键名称，默认 id
     */
    var TreeHelper = k._$klass();
    pro = TreeHelper._$extend(d.Cache);

    /**
     * 控件重置
     *
     * @private
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#__reset
     * @param   {Object} options - 配置参数
     * @returns {void}
     */
    pro.__reset = function (options) {
        this.__super(options);
        this._key = options.key||'id';
        this._doTreeBuild(options.list);
    };

    /**
     * 控件销毁
     *
     * @private
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#__destroy
     * @returns {void}
     */
    pro.__destroy = function () {
        this._root = null;
        this._hash = null;
        this.__super();
    };

    /**
     * 构建树形结构
     *
     * @private
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#_doTreeBuild
     * @param   {Array}  list - 数据列表，数据项结构 {id:345,parent:123}
     * @returns {void}
     */
    pro._doTreeBuild = function (list) {
        this._hash = {};
        this._root = null;
        u._$forEach(list,function (it) {
            // save node
            var def = this._doNodeFormat(),
                item = u._$merge(
                    this._hash[it[this._key]]||def, it
                );
            // save and format node
            this._hash[item[this._key]] = item;
            this._doNodeFormat(item);
            // check root
            if (item.parent===exports.TREE_ROOT_PARENT){
                this._root = item;
                return;
            }
            // check parent
            var parent = this._hash[item.parent];
            if (!parent){
                parent = this._doNodeFormat();
                this._hash[item.parent] = parent;
            }
            parent.children.push(item);
        },this);
        // update tree sort
        this._doTreeSort(this._root);
        this._doUpdateLevel(this._root);
    };

    /**
     * 遍历树结构
     *
     * @private
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#_doTreeTraverse
     * @param   {Object}   root    - 待遍历节点
     * @param   {Function} handler - 遍历过程执行操作
     * @param   {Object}   opt     - 遍历方式配置信息
     * @param   {Number}   opt.depth   - 深度遍历方式，默认后序遍历
     * @param   {Number}   opt.breadth - 广度度遍历方式，默认从左到右
     * @param   {Object}   opt.hash    - 节点索引表
     * @param   {Function} opt.filter  - 节点过滤函数，返回true表示忽略节点
     * @returns {void}
     */
    pro._doTreeTraverse = function (root, handler, opt) {
        opt = opt||{};
        if (!!root&&typeof handler==='function'){
            var that = this,
                ARG_START = 0,
                ARG_NEXT  = 1,
                args = [].slice.call(arguments,ARG_START),
                iterator = opt.breadth===exports.VISIT_TYPE_R2L
                    ? u._$reverseEach : u._$forEach;
            var run = function (node, parent) {
                if (u._$isFunction(opt.filter)&&
                    opt.filter.call(that, node, parent)){
                    return;
                }
                args[ARG_START] = node;
                args[ARG_NEXT]  = parent;
                handler.apply(that,args);
            };
            var next = function (node, parent) {
                iterator.call(u, node.children, function (it) {
                    visit.call(that,it, node);
                });
            };
            var visit = function (node, parent) {
                if (opt.depth===exports.VISIT_TYPE_DLR){
                    run(node, parent);
                    next(node, parent);
                }else{
                    next(node, parent);
                    run(node, parent);
                }
            };
            visit.call(this,root,(opt.hash||this._hash)[root.parent]);
        }
    };

    /**
     * 排序树结构
     *
     * @private
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#_doTreeSort
     * @param   {Object} root - 节点信息
     * @returns {Object} 排完序后的节点信息
     */
    pro._doTreeSort = function (root) {
        this._doTreeTraverse(
            root, this._doNodeSort
        );
        return root;
    };

    /**
     * 更新节点的层级
     *
     * @private
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#_doUpdateLevel
     * @param   {Object} node - 节点信息
     * @param   {Object} hash - 节点索引表
     * @returns {void}
     */
    pro._doUpdateLevel = function (node, hash) {
        if (!node){
            return;
        }
        this._doTreeTraverse(node,function (it, parent) {
            if (!parent){
                it.level = 0;
            }else{
                it.level = parent.level+1;
            }
        },{
            depth: exports.VISIT_TYPE_DLR,
            hash: hash
        });
    };

    /**
     *
     * 排序指定节点下的子节点列表
     *
     * @private
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#_doNodeSort
     * @param   {Object} node - 节点
     * @returns {void}
     */
    pro._doNodeSort = (function(){
        var fmap = {};
        fmap[exports.SORT_MODE_FIELD] = function (node, ext) {
            this._doSrotByField(node.children, ext.field, ext.desc);
        };
        fmap[exports.SORT_MODE_ORDER] = function (node, ext) {
            this._doSortByOrder(node.children, ext.order);
        };
        return function (node) {
            var handler = fmap[node.extend.mode];
            if (!handler){
                handler = fmap[exports.SORT_MODE_ORDER];
            }
            handler.call(this,node,node.extend||{});
        };
    })();

    /**
     *
     * 格式化节点信息
     *
     * @private
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#_doNodeFormat
     * @param   {Object} node - 节点
     * @returns {Object} 格式化后的节点信息
     */
    pro._doNodeFormat = function (node) {
        if (!node){
            node = {};
        }
        if (typeof node.extend==='string'){
            node.extend = e._$text2type(
                node.extend, 'json'
            );
        }
        if (!node.extend){
            node.extend = {};
        }
        if (!node.children){
            node.children = [];
            node.children.loaded = true;
        }
        return node;
    };

    /**
     * 取节点下的子节点排序信息
     *
     * @protected
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#_getNodeSort
     * @param   {Object} node - 节点信息
     * @returns {Array} 排序列表
     */
    pro._getNodeSort = function (node) {
        var ret = [];
        if (!!node){
            var key = this._key;
            u._$forEach(node.children,function (it) {
                ret.push(it[key]);
            });
        }
        return ret;
    };

    /**
     * 取树模型根节点
     *
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#getTree
     * @returns {Object} 根节点
     */
    pro.getTree = function () {
        return this._root;
    };

    /**
     * 根据ID取节点信息
     *
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#getNodeById
     * @param   {Number} id - 节点ID
     * @returns {Object} 节点信息
     */
    pro.getNodeById = function (id) {
        return this._hash[id];
    };

    /**
     * 根据ID取父节点信息
     *
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#getParent
     * @param   {Number} id - 节点ID
     * @returns {Object} 节点信息
     */
    pro.getParent = function (id) {
        var node = this.getNodeById(id)||{};
        return this.getNodeById(node.parent);
    };

    /**
     * 计算操作涉及的节点变化
     *
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#diff
     * @param   {Object} options - 操作配置信息
     * @param   {Number} options.action - 操作标识
     * @param   {Number} options.id - 操作节点标识
     * @param   {Number} options.to - 目标节点标识
     * @returns {Array}  变化的节点信息
     */
    pro.diff = (function(){
        var ZERO = 0,
            REMOVE_NUMBER = 1;
        var fmap = {
            add: function (options) {
                // options.id    - 新增节点ID
                // options.to    - 父节点ID
                // options.order - 自定义排序信息
                var parent = this.getNodeById(options.to);
                if (parent.extend.mode!=exports.SORT_MODE_FIELD){
                    var order = options.order;
                    if (!order){
                        var arr = this._getNodeSort(parent),
                            index = arr.indexOf(options.id);
                        if (index<ZERO){
                            arr.push(index);
                        }
                        order = arr.join(',');
                    }
                    return {
                        id: options.to,
                        extend:JSON.stringify({
                            mode: exports.SORT_MODE_ORDER,
                            order: order
                        })
                    };
                }
            },
            remove: function (options) {
                // options.id - 删除节点ID
                var parent = this.getParent(options.id);
                if (parent.extend.mode!=exports.SORT_MODE_FIELD){
                    var arr = this._getNodeSort(parent),
                        index = arr.indexOf(options.id);
                    if (index>=ZERO){
                        arr.splice(index,REMOVE_NUMBER);
                    }
                    return {
                        id: parent[this._key],
                        extend:JSON.stringify({
                            mode: exports.SORT_MODE_ORDER,
                            order: arr.join(',')
                        })
                    };
                }
            }
        };
        fmap[exports.ACTION_TYPE_ADD] = function (options) {
            var ret = fmap.add.call(this,options);
            if (!!ret){
                return [ret];
            }
        };
        fmap[exports.ACTION_TYPE_REMOVE] = function (options) {
            var ret = fmap.remove.call(this,options);
            if (!!ret){
                return [ret];
            }
        };
        fmap[exports.ACTION_TYPE_MOVE] = function (options) {
            // options.id    - 移动节点
            // options.to    - 移动的目标节点
            // options.order - 自定义排序信息
            var id = options.id,
                ret = [{id:id, parent:options.to}];
            // remove node from source parent
            var rm = fmap.remove.call(this,options);
            if (rm){
                ret.push(rm);
            }
            // append node to destination parent
            var mk = fmap.add.call(this,options);
            if (!!mk){
                ret.push(mk);
            }
            return ret;
        };
        fmap[exports.ACTION_TYPE_SORT_ORDER] = function (options) {
            // options.id    - 排序节点
            // options.order - 自定义排序信息
            var parent = this.getParent(options.id);
            return [{
                id: parent.id,
                extend:JSON.stringify({
                    mode: exports.SORT_MODE_ORDER,
                    order: options.order
                })
            }];
        };
        return function (options) {
            var handler = fmap[options.action];
            if (!!handler){
                return handler.call(this,options);
            }
        };
    })();

    /**
     * 修正根节点
     *
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#fix
     * @param   {Object} root - 根节点
     * @returns {Object} 根节点
     */
    pro.fix = function (root) {
        var node = this.getTree();
        // merge node information
        node = u._$merge(node,root);
        this._doNodeFormat(node);
        // cache node
        this._hash[root[this._key]] = node;
    };

    /**
     * 添加节点
     *
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#add
     * @param   {Object} node - 待添加节点
     * @returns {Object} 添加的节点
     */
    pro.add = function (node) {
        // format node
        node = this._doNodeFormat(node);
        var parent = this.getNodeById(
            node.parent
        );
        // append and cache
        node.level = parent.level+1;
        parent.children.push(node);
        this._hash[node[this._key]] = node;
        return node;
    };

    /**
     * 更新节点
     *
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#update
     * @param   {Object} node - 待更新节点
     * @returns {Object} 添加的节点
     */
    pro.update = function (node) {
        // check item in cache
        var item = this.getNodeById(node[this._key]);
        if (!item){
            return node;
        }
        // move node from one to another
        var moved = !!node.parent&&
            item.parent!=node.parent;
        if (moved){
            this.remove(item[this._key]);
            var parent = this.getNodeById(
                node.parent
            );
            parent.children.push(item);
        }
        // merge node information
        item = u._$merge(item,node);
        this._doNodeFormat(item);
        // update all children level if move
        if (moved){
            this._doUpdateLevel(item);
        }
        return item;
    };

    /**
     * 删除节点
     *
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#remove
     * @param   {Number} id - 待删除节点ID
     * @returns {Object} 删除的节点
     */
    pro.remove = function (id) {
        var ret,
            REMOVE_NUMBER = 1,
            parent = this.getParent(id);
        if (!!parent){
            var key = this._key;
            u._$reverseEach(parent.children,function (it,index,list) {
                if (id==it[key]){
                    list.splice(index,REMOVE_NUMBER);
                    ret = it;
                    return !!ret;
                }
            });
        }
        return ret;
    };

    /**
     * 排序节点下的子节点
     *
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#sort
     * @param   {Number} id - 节点标识
     * @returns {void}
     */
    pro.sort = function (id) {
        var node = this.getNodeById(id);
        if (!!node){
            this._doNodeSort(node);
        }
    };

    /**
     * 搜索所有子孙节点ID
     *
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#search
     * @param   {Number} id - 节点标识
     * @returns {Array}  所有子孙节点ID
     */
    pro.search = function (id) {
        var ret = [],
            node = this.getNodeById(id);
        this._doTreeTraverse(node,function (it) {
            ret.push(it[this._key]);
        });
        return ret;
    };

    /**
     * 取节点到根节点的路径
     *
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#getPath
     * @param   {Number} id - 节点标识
     * @returns {Object} 路径信息，e.g {path:[{id:1,name:'aaa'},{id:2,name:'bbb'},],text:'aaa/bbb'}
     */
    pro.getPath = function (id) {
        var ret = {path:[],text:[],content:[]},
            node = this.getNodeById(id);
        while(!!node&&node.parent!==exports.TREE_ROOT_PARENT){
            ret.path.unshift(node);
            ret.text.unshift(u._$escape(node.name));
            ret.content.unshift(node.name);
            node = this.getParent(node[this._key]);
        }
        ret.text = ret.text.join('/');
        return ret;
    };

    /**
     * 获取节点插入新节点后的排序信息
     *
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#getSortOrder
     * @param   {Number} id     - 插入节点
     * @param   {Number} index  - 插入位置，不传则在最后追加
     * @param   {Number} parent - 父节点标识，不传则取插入节点的父节点
     * @returns {String} 排序信息
     */
    pro.getSortOrder = function (id, index, parent) {
        var CST_ZERO = 0,
            CST_ONE  = 1;
        var arr = this._getNodeSort(
            this.getNodeById(parent)||
                this.getParent(id)
        );
        var idx = u._$indexOf(arr,id);
        if (index==null){
            if (idx<CST_ZERO){
                arr.push(id);
            }
        }else{
            arr.splice(index,CST_ZERO,id);
            // remove old item
            if (idx>=CST_ZERO){
                var delta = index<=idx?CST_ONE:CST_ZERO;
                arr.splice(idx+delta,CST_ONE);
            }
        }
        return arr.join(',');
    };

    /**
     * 将节点插入到指定节点的特定位置后的排序信息
     *
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#getSortByDelta
     * @param   {Number} id     - 操作节点标识
     * @param   {Number} target - 目标节点
     * @param   {Number} delta  - 相对目标节点的位置
     */
    pro.getSortByDelta = function (id, target, delta) {
        // append node
        if (delta===exports.INSERT_APPEND){
            return this.getSortOrder(
                id,null,target
            );
        }
        // insert node
        var parent = this.getParent(target),
            arr = this._getNodeSort(parent),
            index = u._$indexOf(arr,target);
        if (delta===exports.INSERT_AFTER_END){
            index = index+delta;
        }
        index = Math.max(0,index);
        return this.getSortOrder(
            id, index, parent[this._key]
        );
    };

    /**
     * 判断父节点是否包含给定的子节点
     *
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#isContains
     * @param   {Number} pid - 父节点标识
     * @param   {Number} nid - 子节点标识
     * @returns {Boolean} 父节点是否包含子节点
     */
    pro.isContains = function (pid, nid) {
        var node = this.getNodeById(nid),
            parent = this.getNodeById(pid);
        if (!parent||!node){
            return !1;
        }
        while(node){
            if (node==parent){
                return !0;
            }
            node = this.getNodeById(
                node.parent
            );
        }
        return !1;
    };

    /**
     * 取节点下的树的深度
     *
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#getDeep
     * @param   {Number} id - 节点标识
     * @returns {Number} 节点下的树的深度
     */
    pro.getDeep = function (id) {
        var ret = 0,
            node = this.getNodeById(id);
        this._doTreeTraverse(node,function (it) {
            ret = Math.max(ret,it.level);
        });
        return Math.max(0,ret-node.level);
    };

    /**
     * 取树的深度
     *
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#getTreeDeep
     * @returns {Number} 树的深度
     */
    pro.getTreeDeep = function () {
        var root = this.getTree();
        return this.getDeep(root[this._key]);
    };

    /**
     * 根据层级获取节点列表
     *
     * @method  module:pool/cache-base/src/tree-helper.TreeHelper#getNodesByDeep
     * @param   {Number} deep - level
     * @returns {Object} node list information, e.g. {list:[{id:1...},{id:3...}], ids:[1,3]}
     */
    pro.getNodesByDeep = function (deep) {
        var ret = {list:[],ids:[]};
        this._doTreeTraverse(
            this.getTree(),function (it) {
                if (it.level===deep){
                    ret.list.push(it);
                    ret.ids.push(it[this._key]);
                }
            }
        );
        return ret;
    };

    // 导出
    exports.TreeHelper = TreeHelper;
});



