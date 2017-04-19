/**
 * 模块基类实现文件
 *
 * @version  1.0
 * @author   caijf <caijf@corp.netease.com>
 * @module   pool/module-base/src/base
 */
NEJ.define([
    'base/util',
    'base/klass',
    'base/event',
    'base/element',
    'util/template/tpl',
    'util/history/history',
    'util/dispatcher/module'
],function(
    u, k, v, e, t, h, m,
    exports,
    pro
){
    /**
     * 模块基类
     *
     * @class   module:pool/module-base/src/base.Module
     * @extends module:util/dispatcher/module._$$ModuleAbstract
     *
     * @param {Object} options - 模块构造参数
     */
    var Module = k._$klass();
    pro = Module._$extend(m._$$ModuleAbstract);

    /**
     * 根据教育产品规范 转换 __doBuild 接口至 _doBuild
     *
     * @private
     * @method  module:pool/module-base/src/base.Module#__doBuild
     * @param   {Object} options - 构建配置参数
     * @returns {void}
     */
    pro.__doBuild = function (options) {
        this.__super(options);
        this._doBuild(options);
    };

    /**
     * 构建模块，在UMI配置时的 config 配置直接做为 _doBuild 的输入参数
     *
     * ```javascript
     * {
     *      "/m/module": {
     *          "module": "/path/to/module/index.html",
     *          "config": {
     *              "a": "aaaa",
     *              "b": "bbbbbb"
     *          }
     *      }
     * }
     * ```
     *
     * @protected
     * @method  module:pool/module-base/src/base.Module#_doBuild
     * @param   {String} html    - 模块HTML结构
     * @param   {Object} options - 构建配置参数，模块UMI配置时config输入参数
     * @returns {void}
     */
    pro._doBuild = function (html, options) {
        if (!!html){
            this._body = e._$html2node(html);
            this.__body = this._body;
        }
    };

    /**
     * 根据教育产品规范 转换 __onShow 接口至 _onShow
     *
     * @private
     * @method  module:pool/module-base/src/base.Module#__onShow
     * @param   {Object} options - 显示配置参数
     * @returns {void}
     */
    pro.__onShow = function (options) {
        var _parent = this.__doParseParent(options);
        // show and refresh module
        if (!!_parent&&!!this.__body){
            _parent.appendChild(this.__body);
        }
        this.__doApplyComposite('onshow',options);
        this._onShow(options);
        this.__onRefresh(options);
    };

    /**
     * 显示模块触发事件
     *
     * @protected
     * @method  module:pool/module-base/src/base.Module#_onShow
     * @param   {Object} options        - 显示配置参数
     * @param   {String} options.target - 目标 UMI
     * @param   {String} options.source - 原始 UMI
     * @param   {String} options.href   - 完整地址
     * @param   {Object} options.param  - 模块切入查询参数对象 a=aa&b=bb  -> {a:"aa",b:"bb"}
     * @param   {Array}  options.prest  - REST地址模块之后信息做为参数 如地址 /a/b/c/d 对应的模块为 /a/b 则此参数为 ["c","d"]
     * @returns {void}
     */
    pro._onShow = function (options) {
        // TODO something
    };

    /**
     * 根据教育产品规范 转换 __onRefresh 接口至 _onRefresh
     *
     * @private
     * @method  module:pool/module-base/src/base.Module#__onRefresh
     * @param   {Object} options - 刷新配置参数
     * @returns {void}
     */
    pro.__onRefresh = function (options) {
        this.__super(options);
        this._onRefresh(options);
    };

    /**
     * 显示模块触发事件
     *
     * @protected
     * @method  module:pool/module-base/src/base.Module#_onRefresh
     * @param   {Object} options        - 刷新配置参数
     * @param   {String} options.target - 目标 UMI
     * @param   {String} options.source - 原始 UMI
     * @param   {String} options.href   - 完整地址
     * @param   {Object} options.param  - 模块切入查询参数对象 a=aa&b=bb  -> {a:"aa",b:"bb"}
     * @param   {Array}  options.prest  - REST地址模块之后信息做为参数 如地址 /a/b/c/d 对应的模块为 /a/b 则此参数为 ["c","d"]
     * @returns {void}
     */
    pro._onRefresh = function(options){
        // TODO something
    };

    /**
     * 根据教育产品规范 转换 __onHide 接口至 _onHide
     *
     * @private
     * @method  module:pool/module-base/src/base.Module#__onHide
     * @returns {void}
     */
    pro.__onHide = function () {
        this.__doClearDomEvent();
        this.__doClearComponentExDsp();
        this.__doClearComponentRegular();
        this._onHide();
        this.__super();
    };

    /**
     * 隐藏模块触发事件
     *
     * @protected
     * @method  module:pool/module-base/src/base.Module#_onHide
     * @returns {void}
     */
    pro._onHide = function(){
        // TODO something
    };

    /**
     * 清除 Regular 组件
     *
     * @private
     * @method  module:pool/module-base/src/base.Module#__doClearComponentRegular
     * @returns {void}
     */
    pro.__doClearComponentRegular = function () {
        u._$loop(this,function (inst, key, map) {
            if (!!inst&&!!inst.destroy){
                delete map[key];
                inst.destroy();
            }
        });
    };

    /**
     * 解析模块所在容器节点
     *
     * @protected
     * @method  module:pool/module-base/src/base.Module#__doParseParent
     * @param   {Object} options - 配置信息
     * @returns {Node}             模块所在容器节点
     */
    pro.__doParseParent = function(options){
        return this.__super(options)||document.body;
    };

    /**
     * 跳转地址
     *
     * @method  module:pool/module-base/src/base.Module#redirect
     * @param   {String} url     - 跳转地址
     * @param   {Object} options - 配置参数
     * @returns {void}
     */
    pro.redirect = function (url, options) {
        if (!!this.__dispatcher){
            this.__dispatcher._$redirect.apply(
                this.__dispatcher,arguments
            );
        }else{
            location.redirect(url, options);
        }
    };

    /**
     * 去到出错页面
     *
     * @method  module:pool/module-base/src/base.Module#go2error
     * @param   {String} name - 错误名称
     * @returns {void}
     */
    pro.go2error = function (name) {
        location.href = '/error/'+name+'.htm';
    };

    /**
     * 构建模块
     *
     * @method  module:pool/module-base/src/base.build
     * @param   {module:util/dispatcher/module._$$ModuleAbstract} Klass - 模块构造器
     * @param   {Object}      options        - 模块配置信息
     * @param   {String|Node} options.parent - 模块所在容器ID或者节点
     * @returns {void}
     */
    exports.build = function (Klass,options) {
        var complete = function (opt) {
            var ret = location.parse(
                location.hash.substr(1)
            );
            return u._$merge(
                {param:ret.query},
                ret, opt
            );
        };
        // show module
        var inst = Klass._$allocate();
        inst._$dispatchEvent(
            'onshow',complete(options)
        );
        // check module refresh
        v._$addEvent(
            location,'urlchange',function () {
                inst._$dispatchEvent(
                    'onrefresh',complete()
                );
            }
        );
        // active dispatcher
        location.active();
    };

    /**
     * 注册模块，如果调度器还没有被实例化则先缓存注册内容
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'pool/module-xxx/src/xxx'
     * ],function(m){
     *     // TODO XxxModule implementation
     *
     *     // 注册别名
     *     m.regist('blog-list',XxxModule);
     *
     *     // 注册UMI
     *     m.regist('/blog/list/',XxxModule);
     * });
     * ```
     *
     * @method module:pool/module-base/src/base.regist
     * @param   {String}                                  umi    - 模块UMI或者别名
     * @param   {module:pool/module-base/src/base.Module} module - 模块构造函数
     * @returns {void}
     */
    exports.regist = m._$regist._$bind(m);

    /**
     * 合并模块配置信息
     *
     * @method module:pool/module-base/src/base.merge
     * @returns {Object} 合并后的配置信息
     */
    exports.merge = (function(){
        var keys = ['title','rewrite','alias','action'];
        return function () {
            var ret = {rules:{},modules:{}};
            for(var i=0,l=arguments.length,it;i<l;i++){
                it = arguments[i];
                if (!it) continue;
                var rules = it.rules;
                if (!!rules){
                    u._$forEach(keys,function (key) {
                        if (!rules[key]) return;
                        ret.rules[key] = u._$merge(
                            ret.rules[key],
                            rules[key]
                        );
                    });
                }
                ret.modules = u._$merge(
                    ret.modules,
                    it.modules
                );
            }
            return ret;
        };
    })();

    exports.Module = Module;
});
