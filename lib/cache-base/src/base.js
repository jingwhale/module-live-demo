/**
 * 数据缓存基类实现文件
 *
 * @version  1.0
 * @author   caijf <caijf@corp.netease.com>
 * @module   pool/cache-base/src/base
 */
NEJ.define([
    'base/klass',
    'base/util',
    'base/event',
    'util/ajax/tag',
    'util/cache/abstract',
    './setting.js',
    './config.js'
],function (
    k, u, v, j, d, s,
    conf,
    exports,
    pro
){
    // 常量定义
    var SETTING_KEY   = 'cache-base',
        TASK_INTERVAL = 2000;

    /**
     * 数据缓存基类
     *
     * @class  module:pool/cache-base/src/base.Cache
     * @extend module:util/cache/abstract._$$CacheListAbstract
     */
    var Cache = k._$klass();
    pro = Cache._$extend(d._$$CacheListAbstract);

    /**
     * 初始化缓存
     *
     * @private
     * @method  module:pool/cache-base/src/base.Cache#__init
     * @param   {Object} options - 配置信息
     * @returns {void}
     */
    pro.__init = function () {
        this._doFlushSetting(
            SETTING_KEY, conf
        );
        this.__super();
    };

    /**
     * 检查当前导入任务状况
     *
     * @protected
     * @method  module:pool/cache-base/src/base.Cache#checkImport
     * @param   {String} key - 接口配置标识
     * @param   {Object} opt - 请求数据
     * @returns {void}
     */
    pro.checkImport = function (key, opt) {
        this._doRequestWithProgress({
            polling:{
                key: key,
                data: opt,
                event: 'onimportprogress'
            }
        });
    };

    /**
     * 导入文件
     *
     * @private
     * @method  module:pool/cache-base/src/base.Cache#_import
     * @param   {String} key - 导入请求配置标识
     * @param   {Object} pkey - 导入轮询配置标识
     * @param   {Object} opt - 包含导入文件的NOS信息
     * @param   {Object} popt - 轮询接口数据
     * @returns {void}
     */
    pro._import = function (key, pkey, opt, popt) {
        this._doRequestWithProgress({
            task: {
                key: key,
                data: opt,
                event: 'import'
            },
            polling: {
                key: pkey,
                data: popt || opt,
                event: 'onimportprogress'
            }
        });
    };

    /**
     * 导入任务接口，子类重写实现
     *
     * @protected
     * @method  module:pool/cache-base/src/base.Cache#$import
     * @param   {String} key  - 导入接口配置标识
     * @param   {String} pkey - 轮询导入进度接口配置标识
     * @param   {Object} opt  - 导入请求配置参数
     * @returns {void}
     */
    pro.$import = function (key, pkey, opt, popt) {
        this._import(key, pkey, opt, popt);
    };

    /**
     * 执行下载过程
     *
     * @protected
     * @method  module:pool/cache-base/src/base.Cache#_download
     * @param   {String} url   - 下载地址
     * @param   {Object} query - 查询参数
     * @returns {void}
     */
    pro._download = function (url, query) {
        url += (url.indexOf('?')<0?'?':'&')+'_t='+(+new Date);
        if (!!query){
            url += '&'+u._$object2query(query);
        }
        j._$loadHtml(url);
    };

    /**
     * 下载名单模板
     *
     * @protected
     * @method  module:pool/cache-base/src/users.Users#download
     * @param   {String} key - 下载接口配置标识
     * @param   {Object} query -
     * @returns {void}
     */
    pro.download = function (key, query) {
        this._download(d.get(key).url,query);
    };

    /**
     * 触发列表变化事件
     *
     * @private
     * @method  module:pool/cache-base/src/base.Cache#_doEmitListChange
     * @param   {Object} event - 事件信息
     * @returns {void}
     */
    pro._doEmitListChange = function (event) {
        event = event || {};
        if ('onlistchange' in this.constructor){
            v._$dispatchEvent(
                this.constructor,
                'listchange',event
            );
        }
    };

    /**
     * 更新列表排序
     *
     * @method  module:pool/cache-base/src/base.Cache#updateSort
     * @param   {Object} options      - 请求配置信息
     * @param   {String} options.key  - 列表标识
     * @param   {Object} options.data - 发送到服务器的数据
     * @param   {Object} options.ext  - 回调时携带的信息
     * @returns {void}
     */
    pro.updateSort = function (options) {
        options.onload = this._cbUpdateSort._$bind(
            this, options
        );
        this._doUpdateSort(options);
    };

    /**
     * 更新列表排序到服务器
     *
     * @protected
     * @method  module:pool/cache-base/src/base.Cache#_doUpdateSort
     * @param   {Object}   options        - 请求配置信息
     * @param   {String}   options.key    - 列表标识
     * @param   {Object}   options.data   - 发送到服务器的数据
     * @param   {Object}   options.ext    - 回调时携带的信息
     * @param   {Function} options.onload - 排序更新后回调函数
     * @returns {void}
     */
    pro._doUpdateSort = function (options) {
        // TODO update sort
    };

    /**
     * 服务器更新排序成功后返回结果
     *
     * @private
     * @method  module:pool/cache-base/src/base.Cache#_cbUpdateSort
     * @param   {Object} options      - 请求配置信息
     * @param   {String} options.key  - 列表标识
     * @param   {Object} ret          - 更新成功的排序信息
     * @param   {String||Array} ret.sort     - 用逗号分隔的ID列表||数组
     * @returns {Object} 操作信息
     */
    pro._cbUpdateSort = function (options, ret) {
        var key = options.key;
        if (!!ret){
            var list = this._$getListInCache(key);
            this._doSortByOrder(list, ret.sort || options.data.orderList || options.data);
        }
        var event = {
            key:key,
            action:'refresh',
            ext:options.ext
        };
        this._$dispatchEvent(
            'onsortupdate',event
        );
        this._doEmitListChange(event);
    };

    /**
     * 格式化分页器请求参数
     *
     * @protected
     * @method  module:pool/cache-base/src/base.Cache#_doFormatPager
     * @param   {Object} req  - 请求对象
     * @returns {void}
     */
    pro._doFormatPager = function (req) {
        var PAGE_DELTA = 1,
            data = req.data||{};
        if(req.limit && req.offset != undefined){
            data.pageSize  = req.limit;
            data.pageIndex = req.offset/req.limit+PAGE_DELTA;
        }
    };

    /**
     * 格式化分页返回结果
     *
     * @protected
     * @method  module:pool/cache-base/src/base.Cache#_doFormatPagerRet
     * @param   {Object} ret  - 返回结果
     * @param   {String} lkey - 列表属性
     * @param   {String} pkey - 分页属性
     * @returns {Object} 格式化后列表信息
     */
    pro._doFormatPagerRet = function (ret, lkey, pkey) {
        var list = ret[lkey],
            page = ret[pkey]||ret.pagination||{};
        return {
            list: list,
            total: page.totleCount
        };
    };

    /**
     * 根据排序字段重排数组顺序，调整原有数组的顺序
     *
     * @protected
     * @method  module:pool/cache-base/src/base.Cache#_doSortByOrder
     * @param   {Array}  list  - 待排序列表
     * @param   {String} order - 排序顺序字符串 || 数组
     * @returns {Array}  排序后的数组
     */
    pro._doSortByOrder = (function(){
        var NOT_ZERO_FACTOR = 1;
        return function (list, order) {
            if (!order||!list||!list.length){
                return list;
            }
            // build sort map
            var map = {},
                arr = u._$isArray(order)?order:order.split(',');
            u._$forEach(arr,function (id,index) {
                map[id] = index+NOT_ZERO_FACTOR;
            });
            // sort list
            var key = this.__key;
            list.sort(function (a, b) {
                var x = map[a[key]]||Number.MAX_VALUE,
                    y = map[b[key]]||Number.MAX_VALUE;
                return x-y;
            });
            return list;
        };
    })();

    /**
     * 根据字段重排数组顺序，调整原有数组的顺序
     *
     * @protected
     * @method  module:pool/cache-base/src/base.Cache#_doSrotByField
     * @param   {Array}   list  - 待排序数组
     * @param   {String}  field - 排序字段名称
     * @param   {Boolean} desc  - 是否降序
     * @returns {Array}   排好序后的数组
     */
    pro._doSrotByField = (function(){
        var RET_SORT_EQUAL   =  0,
            RET_SORT_BIGGER  =  1,
            RET_SORT_SMALLER = -1,
            REVERT_FACTOR    =  1;
        return function (list, field, desc) {
            if (!field||!list||!list.length){
                return list;
            }
            list.sort(function (a, b) {
                var x = a[field],
                    y = b[field];
                if (x===y){
                    return RET_SORT_EQUAL;
                }
                var ret = a>b?RET_SORT_BIGGER:RET_SORT_SMALLER;
                return (!desc?REVERT_FACTOR:-REVERT_FACTOR)*ret;
            });
            return list;
        };
    })();

    /**
     * 带缓存验证的请求发送接口
     *
     * @protected
     * @method  module:pool/cache-base/src/base.Cache#_doRequestWithCacheCheck
     * @param   {Object} options            - 请求配置信息
     * @param   {String} options.reqKey     - 请求标识
     * @param   {String} options.queKey     - 请求队列标识
     * @param   {String} options.cacheKey   - 缓存标识
     * @param   {String} options.eventName  - 回调事件名称
     * @param   {String} options.eventOpt   - 回调参数信息
     * @param   {Object} options.data       - 发送到服务器的数据
     * @param   {Function} options.callback - 请求回调函数
     * @returns {void}
     */
    pro._doRequestWithCacheCheck = function (options) {
        var that = this;
        // callback handler
        var handler = function (name, opt) {
            if (u._$isFunction(options.callback)){
                options.callback.call(that);
            }else{
                that._$dispatchEvent(
                    name, opt
                );
            }
        };
        // check cache data
        if (!!options.cacheKey){
            var data = this.__getDataInCache(
                options.cacheKey
            );
            if (data!=null){
                handler(
                    options.eventName,
                    options.eventOpt
                );
                return;
            }
        }
        // request with callback
        var request = function (callback) {
            var onload = function (ret) {
                if (!!options.cacheKey){
                    that.__setDataInCache(
                        options.cacheKey,ret
                    );
                }
                callback.call(that);
            };
            var onerror = function (ret) {
                callback.call(that,ret);
            };
            that.__doSendRequest(
                options.reqKey,{
                    data: options.data,
                    onload: onload,
                    onerror: onerror
                }
            );
        };
        // check queue request
        var rkey = options.queKey;
        if (!rkey){
            // single request
            request(function () {
                handler(
                    options.eventName,
                    options.eventOpt
                );
            });
        }else{
            // request with queue
            if (!this.__doQueueRequest(rkey,handler)){
                request(function (err) {
                    var name = options.eventName,
                        opt = options.eventOpt;
                    if (err){
                        name = 'onerror';
                        opt = err;
                    }
                    that.__doCallbackRequest(
                        rkey,name,opt
                    );
                });
            }
        }
    };

    /**
     * 带进度轮询的任务实现接口
     *
     * @protected
     * @method  module:pool/cache-base/src/base.Cache#_doRequestWithProgress
     * @param   {Object} options               - 请求配置信息
     * @param   {Object} options.polling       - 轮询配置
     * @param   {String} options.polling.key   - 轮询请求标识
     * @param   {Object} options.polling.data  - 轮询请求参数
     * @param   {String} options.polling.event - 轮询请求回调事件名称
     * @param   {Object} options.task          - 任务配置
     * @param   {String} options.task.key      - 任务请求标识
     * @param   {Object} options.task.data     - 任务请求参数
     * @param   {String} options.task.event    - 任务请求回调事件名称
     * @returns {void}
     */
    pro._doRequestWithProgress = function (options) {
        var PUB_FAILED = 0,
            PUB_DOING  = 1,
            PUB_DONE   = 2,
            that = this,
            task = options.task||{},
            polling = options.polling||{},
            conf = exports.get(task.key)||{};
        // task event dispatch
        var dispatch = function (ret) {
            ret = u._$merge(ret,task.data);
            // check polling done config
            if (typeof conf.done==='function'){
                conf.done.call(that,ret);
            }
            // check task event
            if (!!task.event){
                if (typeof task.event==='function'){
                    task.event.call(that, ret);
                }else{
                    var name = 'on'+task.event;
                    that._$dispatchEvent(name, ret);
                    if (name in that.constructor){
                        v._$dispatchEvent(
                            that.constructor,
                            task.event, ret
                        );
                    }
                }
            }
        };
        // polling to get progress
        var progress = function () {
            var next = function () {
                window.setTimeout(
                    progress,
                    TASK_INTERVAL
                );
            };
            that.__doSendRequest(
                polling.key,{
                    data: polling.data,
                    onload: function (ret) {
                        if (ret.flag === PUB_FAILED){
                            dispatch({
                                result: false,
                                message: ret.message
                            });
                            return;
                        }
                        if (ret.loaded>=ret.total){
                            dispatch({ result: true });
                        }else{
                            next();
                        }

                        // trigger polling event
                        var opt = u._$merge(ret,polling.data);
                        if (typeof polling.event==='function'){
                            polling.event.call(that, opt);
                        }else{
                            that._$dispatchEvent(
                                polling.event, opt
                            );
                        }
                    },
                    onerror: function (error) {
                        next();
                    }
                }
            );
        };
        // do run task
        if (!!task.key){
            this.__doSendRequest(
                task.key,{
                    data: task.data,
                    onload: function (isok) {
                        if (isok){
                            // 95% not show progress modal
                            setTimeout(progress, 500);
                        }else{
                            dispatch({ result: false });
                        }
                    },
                    onerror: function (error) {
                        error.result = false;
                        dispatch(error);
                    }
                }
            );
        }else{
            progress();
        }
    };

    /**
     * 带进度轮询的导出任务实现接口
     *
     * @protected
     * @method  module:pool/cache-base/src/base.Cache#_doExportWithProgress
     * @param   {Object} options               - 请求配置信息
     * @param   {Object} options.polling       - 轮询配置
     * @param   {String} options.polling.key   - 轮询请求标识
     * @param   {Object} options.polling.data  - 轮询请求参数
     * @param   {String} options.polling.event - 轮询请求回调事件名称，默认为 onexportprogress
     * @param   {Object} options.task          - 导出配置
     * @param   {String} options.task.key      - 导出请求标识
     * @param   {Object} options.task.data     - 导出请求参数
     * @returns {void}
     */
    pro._doExportWithProgress = function (options) {
        var DONE_VALUE = 100,
            SUCCESS_CODE = 0;
        var that = this,
            task = options.task||{},
            polling = options.polling||{};
        // polling callback
        var callback = function (ret) {
            var opt = u._$merge(ret,polling.data),
                event = polling.event||'onexportprogress';
            if (typeof event==='function'){
                event.call(that, opt);
            }else{
                that._$dispatchEvent(event, opt);
            }
        };
        // polling to get progress
        var progress = function () {
            var next = function () {
                window.setTimeout(
                    progress,
                    TASK_INTERVAL
                );
            };
            that.__doSendRequest(
                polling.key,{
                    data: polling.data,
                    onload: function (ret) {
                        // exception when export failed
                        if (ret.retCode!=SUCCESS_CODE){
                            callback({
                                loaded: DONE_VALUE,
                                total: DONE_VALUE
                            });
                            return;
                        }
                        // check next polling
                        var done = ret.loaded>=ret.total;
                        if (!done){
                            next();
                        }
                        // trigger progress
                        callback(ret);
                        // url generated
                        if (done){
                            expot();
                        }
                    },
                    onerror: function (error) {
                        next();
                    }
                }
            );
        };
        // do run export task
        var expot = function () {
            that.__doSendRequest(
                task.key,{
                    data: task.data,
                    onload: function (ret) {
                        if (!ret||!ret.url){
                            progress();
                        }else{
                            callback({
                                loaded: DONE_VALUE,
                                total: DONE_VALUE
                            });
                            that._download(ret.url);
                        }
                    },
                    onerror: function (error) {
                        callback({
                            loaded: DONE_VALUE,
                            total: DONE_VALUE
                        });
                    }
                }
            );
        };
        expot.call(this);
    };

    /**
     * 导出任务接口
     *
     * @protected
     * @method  module:pool/cache-base/src/users.Users#$export
     * @param   {String} key  - 导出接口配置标识
     * @param   {Object} opt  - 导出请求配置参数
     * @param   {Object} popt - 轮询请求配置参数，默认
     * @param   {String} pkey - 轮询请求配置标识，默认采用统一轮询配置
     * @returns {void}
     */
    pro.$export = function (key, opt, popt, pkey) {
        this._doExportWithProgress({
            task:{
                key: key,
                data: opt
            },
            polling:{
                key: pkey||'base-export-progress-polling',
                data: popt||opt
            }
        });
    };

    /**
     * 缓存配置信息
     *
     * @protected
     * @method  module:pool/cache-base/src/base.Cache#_doFlushSetting
     * @param   {String} key     - 配置标识
     * @param   {Object} setting - 配置信息
     * @returns {void}
     */
    pro._doFlushSetting = (function(){
        var kmap = {},
            inited = false;
        return function (key, setting) {
            var xkey = key+'-flushed';
            if (!kmap[xkey]){
                kmap[xkey] = true;
                exports.config(setting);
                exports.config(s.get(key));
            }
            if (!inited){
                inited = true;
                // set response result as default result
                d._$on('post',function (event) {
                    var res = event.res||{},
                        cst = exports.get('base-setting');
                    if (res.code == cst.CODE_OK){
                        event.result = res.result;
                    }
                });
            }
        };
    })();

    /**
     * 根据教育产品组件规范将 __doLoadList 转换为 _doLoadList
     *
     * @private
     * @method  module:pool/cache-base/src/base.Cache#__doLoadList
     * @param   {Object}   options        - 请求信息
     * @param   {String}   options.key    - 列表标识
     * @param   {Number}   options.offset - 偏移量
     * @param   {Number}   options.limit  - 数量
     * @param   {String}   options.data   - 请求相关数据
     * @param   {Function} options.onload - 列表项载入回调
     * @returns {void}
     */
    pro.__doLoadList = function (options) {
        this.__super(options);
        this._doLoadList(options);
    };

    /**
     * 根据教育产品组件规范将 __doLoadItem 转换为 _doLoadItem
     *
     * @private
     * @method  module:pool/cache-base/src/base.Cache#__doLoadItem
     * @param   {Object}   options        - 请求信息
     * @param   {String}   options.key    - 列表标识
     * @param   {Number}   options.id     - 列表项标识
     * @param   {String}   options.data   - 请求相关数据
     * @param   {Function} options.onload - 列表项载入回调
     * @returns {void}
     */
    pro.__doLoadItem = function (options) {
        this.__super(options);
        this._doLoadItem(options);
    };

    /**
     * 根据教育产品组件规范将 __doAddItem 转换为 _doAddItem
     *
     * @private
     * @method  module:pool/cache-base/src/base.Cache#__doAddItem
     * @param   {Object}   options        - 请求信息
     * @param   {String}   options.key    - 列表标识
     * @param   {Number}   options.id     - 列表项标识
     * @param   {String}   options.data   - 请求相关数据
     * @param   {Function} options.onload - 列表项载入回调
     * @returns {void}
     */
    pro.__doAddItem = function (options) {
        this.__super(options);
        this._doAddItem(options);
    };

    /**
     * 添加列表项回调
     *
     * @private
     * @method module:pool/cache-base/src/base.Cache#__addItem
     * @param  {Object} options - 请求信息
     * @param  {Object} item    - 列表项对象
     * @return {void}
     */
    pro.__addItem = function (options, item) {
        this._doEmitListChange(
            this.__super(options,item)
        );
    };

    /**
     * 根据教育产品组件规范将 __doDeleteItem 转换为 _doDeleteItem
     *
     * @private
     * @method  module:pool/cache-base/src/base.Cache#__doDeleteItem
     * @param   {Object}   options        - 请求信息
     * @param   {String}   options.key    - 列表标识
     * @param   {Number}   options.id     - 列表项标识
     * @param   {String}   options.data   - 请求相关数据
     * @param   {Function} options.onload - 列表项载入回调
     * @returns {void}
     */
    pro.__doDeleteItem = function (options) {
        this.__super(options);
        this._doDeleteItem(options);
    };

    /**
     * 删除列表项回调
     *
     * @private
     * @method module:pool/cache-base/src/base.Cache#__deleteItem
     * @param  {Object}  options - 请求信息
     * @param  {Boolean} isok    - 是否删除成功
     * @return {void}
     */
    pro.__deleteItem = function (options, isok) {
        this._doEmitListChange(
            this.__super(options, isok)
        );
    };

    /**
     * 根据教育产品组件规范将 __doUpdateItem 转换为 _doUpdateItem
     *
     * @private
     * @method  module:pool/cache-base/src/base.Cache#__doUpdateItem
     * @param   {Object}   options        - 请求信息
     * @param   {String}   options.key    - 列表标识
     * @param   {Number}   options.id     - 列表项标识
     * @param   {String}   options.data   - 请求相关数据
     * @param   {Function} options.onload - 列表项载入回调
     * @returns {void}
     */
    pro.__doUpdateItem = function (options) {
        this.__super(options);
        this._doUpdateItem(options);
    };

    /**
     * 更新列表项回调
     *
     * @private
     * @method module:pool/cache-base/src/base.Cache#__updateItem
     * @param  {Object} options - 请求信息
     * @param  {Object} item    - 列表项对象
     * @return {void}
     */
    pro.__updateItem = function (options, item) {
        this._doEmitListChange(
            this.__super(options, item)
        );
    };

    /**
     * 从服务器端载入列表
     *
     * @protected
     * @method  module:pool/cache-base/src/base.Cache#_doLoadList
     * @param   {Object}   options        - 请求信息
     * @param   {String}   options.key    - 列表标识
     * @param   {Number}   options.offset - 偏移量
     * @param   {Number}   options.limit  - 数量
     * @param   {String}   options.data   - 请求相关数据
     * @param   {Function} options.onload - 列表项载入回调
     * @returns {void}
     */
    pro._doLoadList = function (options) {
        // TODO
    };

    /**
     * 从服务器端载入列表项
     *
     * @protected
     * @method  module:pool/cache-base/src/base.Cache#_doLoadItem
     * @param   {Object}   options        - 请求信息
     * @param   {String}   options.key    - 列表标识
     * @param   {Number}   options.id     - 列表项标识
     * @param   {String}   options.data   - 请求相关数据
     * @param   {Function} options.onload - 列表项载入回调
     * @returns {void}
     */
    pro._doLoadItem = function (options) {
        // TODO
    };

    /**
     * 添加列表项到缓存
     *
     * @method  module:pool/cache-base/src/base.Cache#saveItemToCache
     * @param   {Object} item - 列表项
     * @returns {Object} 缓存中的数据项
     */
    pro.saveItemToCache = function (item) {
        return this.__doSaveItemToCache(item);
    };

    /**
     * 添加列表项至服务器
     *
     * @protected
     * @method  module:pool/cache-base/src/base.Cache#_doAddItem
     * @param   {Object}   options        - 请求信息
     * @param   {String}   options.key    - 列表标识
     * @param   {Number}   options.id     - 列表项标识
     * @param   {String}   options.data   - 请求相关数据
     * @param   {Function} options.onload - 列表项载入回调
     * @returns {void}
     */
    pro._doAddItem = function (options) {
        // TODO
    };

    /**
     * 从服务器上删除列表项
     *
     * @protected
     * @method  module:pool/cache-base/src/base.Cache#_doDeleteItem
     * @param   {Object}   options        - 请求信息
     * @param   {String}   options.key    - 列表标识
     * @param   {Number}   options.id     - 列表项标识
     * @param   {String}   options.data   - 请求相关数据
     * @param   {Function} options.onload - 列表项载入回调
     * @returns {void}
     */
    pro._doDeleteItem = function (options) {
        // TODO
    };

    /**
     * 更新列表项至服务器
     *
     * @protected
     * @method  module:pool/cache-base/src/base.Cache#_doUpdateItem
     * @param   {Object}   options        - 请求信息
     * @param   {String}   options.key    - 列表标识
     * @param   {Number}   options.id     - 列表项标识
     * @param   {String}   options.data   - 请求相关数据
     * @param   {Function} options.onload - 列表项载入回调
     * @returns {void}
     */
    pro._doUpdateItem = function (options) {
        // TODO
    };

    /**
     * 取路径信息
     *
     * @method  module:pool/cache-base/src/base.Cache#getRoot
     * @param   {String} key - 路径标识
     * @param   {Object} map - 配置参数
     * @returns {String}
     */
    pro.getRoot = function (key, map) {
        var conf = exports.get('base-setting');
        var def = {
            webroot: conf.WEBROOT,
            orgroot: conf.ORGROOT
        };
        map = u._$merge(def,map);
        return (conf[key]||'').replace(
            /\$\{(.*?)\}/gi,function ($1,$2) {
                return map[$2.toLowerCase()]||$1;
            }
        );
    };

    /**
     *
     * 取响应信息
     *
     * @example
     *
     * var res = inst.getResponse({
     *      result:{
     *          a:'aaa',
     *          b:'bbbbb'
     *      }
     * });
     *
     * @method  module:pool/cache-base/src/base.Cache#getResponse
     * @param   {String} data - 响应信息
     * @returns {Object} 完整的相应对象
     */
    pro.getResponse = function (data) {
        var def = {
            code: exports.get('base-setting').CODE_OK,
            message: 'OK',
            result: null
        };
        return u._$merge(def, data);
    };

    /**
     * 直接从缓存取二维码图片地址
     *
     * @method  module:pool/cache-base/src/base.Cache#getQRCodeURLInCache
     * @param   {Number} id - 二维码标识
     * @returns {String} 二维码图片地址
     */
    pro.getQRCodeURLInCache = function (id) {
        return this.__getDataInCache('qrcode-'+id);
    };

    /**
     * 取二维码图片地址，在 onqrcodeload 事件中通过 getQRCodeURLInCache 接口拿到二维码地址
     *
     * @protected
     * @method  module:pool/cache-base/src/base.Cache#_getQRCodeURL
     * @param   {Number} id   - 二维码标识，后续通过此标识从 getQRCodeURLInCache 里拿
     * @param   {Object} data - 二维码的配置信息
     * @param   {Number} data.minWidth  - 最小宽度
     * @param   {Number} data.minHeight - 最小高度
     * @param   {Number} data.content   - 二维码内容
     * @returns {void}
     */
    pro._getQRCodeURL = function (id, data) {
        this._doRequestWithCacheCheck({
            data      : data,
            reqKey    : 'base-qrcode-url-get',
            queKey    : 'req-qrcode-'+id,
            cacheKey  : 'qrcode-'+id,
            eventName : 'onqrurlload',
            eventOpt  : {id:id}
        });
    };

    /**
     * 全局预处理事件配置
     *
     * @method  module:pool/cache-base/src/base.on
     * @param   {Object}   map        - 事件配置信息
     * @param   {function} map.filter - 请求发送之前统一预处理事件，输入为{req:options,url:'url'}
     * @param   {function} map.post   - 请求返回之后统一预处理事件，输入为{req:options,res:result}
     * @param   {function} map.format - 请求返回数据统一格式化事件, 输入为{req:options,res:result}
     * @param   {function} map.error  - 请求返回异常统一预处理事件, 输入为{req:options,error:error}
     * @returns {void}
     */
    exports.on = d._$on;

    /**
     * 执行缓存的同步方法，执行完毕后立即回收缓存
     *
     * ```javascript
     * NEJ.define([
     *     'base/klass',
     *     'util/cache/abstract'
     * ],function(k,t,p,pro){
     *     // 定义自己的缓存类
     *     p._$$Cache = k._$klass();
     *     pro = p._$$Cache._$extend(t._$$CacheListAbstract);
     *
     *     // 对外接口
     *     pro._$getDataForCheck = function(){
     *         // TODO something
     *         return 'result';
     *     }
     *
     *     // 重写_$do方法，绑定缓存构造器
     *     p.do = t.do._$bind(
     *         null,p._$$Cache
     *     );
     * });
     * ```
     *
     * ```javascript
     * NEJ.define([
     *     'path/to/cache'
     * ],function(t){
     *
     *     // 使用缓存
     *     var ret = t.$do(function(cache){
     *         return cache._$getDataForCheck();
     *     });
     *
     *     // TODO something
     * }
     * ```
     *
     * @method module:pool/cache-base/src/base.$do
     * @param  {Function} Klass - 缓存构造器
     * @param  {Function} func  - 执行回调
     * @return {Function} 回调返回结果
     */
    exports.$do = d._$do;

    /**
     * 合并请求配置信息
     *
     * @method  module:pool/cache-base/src/base.merge
     * @see     {@link module:pool/cache-base/src/base.config}
     * @param   {String} key - 配置标识
     * @param   {Object} map - 配置信息
     * @returns {void}
     */
    exports.merge = d._$merge;

    /**
     * 请求配置信息，项目中可以统一配置请求信息，可配置项如下表所示
     *
     * | 名称    | 类型     | 描述  |
     * | :----:  | :----:   | :---- |
     * | url     | String   | 请求地址 |
     * | method  | String   | 请求方式，GET/POST/PUT等，默认为POST |
     * | rest    | Boolean  | 是否REST接口 |
     * | filter  | Function | 请求发送之前配置信息过滤接口 |
     * | post    | Function | 请求返回之后结果检查接口 |
     * | format  | Function | 请求返回结果格式化接口 |
     * | finaly  | Function | 回调结束后执行业务逻辑接口 |
     * | onerror | Function | 异常处理接口 |
     * | onload  | Function | 回调处理接口 |
     *
     * @method  module:pool/cache-base/src/base.config
     * @see     {@link module:pool/cache-base/src/base.on}
     * @param   {Object} map - 配置映射关系，如{'key1':{url:'url'},'key2':'url'}
     * @returns {void}
     */
    exports.config = function (map) {
        u._$forIn(map,function (value, key) {
            if (typeof value==='string'){
                value = {url:value};
            }
            d._$merge(key, value);
        });
    };

    /**
     * 取配置信息
     *
     * @method  module:pool/cache-base/src/base.get
     * @param  {String} key - 配置标识
     * @return {Object} 配置信息
     */
    exports.get = function (key) {
        return d._$dump()[key]||{};
    };

    exports.Cache = Cache;
});




