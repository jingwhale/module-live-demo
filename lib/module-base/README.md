# 模块基类说明文档

## 模块状态

[![build status](https://g.hz.netease.com/edu-frontend/component-base/badges/master/build.svg)](https://g.hz.netease.com/edu-frontend/component-base/commits/master)

## 模块文档

模块详细文档请查看 [这里](./docs/index.html)

## 模块实现

### 模块目录结构

模块的实现包含两部分内容：

* 模块实现
* 模块注册到UMI调度系统

模块的目录结构如下所示

```
module-test
     |- module.js       模块实现的主体
     |- module.htm      模块主体模板
     |- index.scss      模块样式
     |- index.js        模块注册到UMI
     |- index.html      UMI使用的模块入口
```

### module.htm

模块的主体结构定义

```html
<div class="um-test"></div>
```

### module.js

模块的实现主体

```javascript
/**
 * TEST 模块实现文件
 *
 * @version  1.0
 * @author   edu <edu@corp.netease.com>
 * @module   pool/module-test/src/test/module
 */
NEJ.define([
    'base/klass',
    'pool/module-base/src/base',
    'text!./module.htm'
],function(
    k,
    m,
    html,
    exports,
    pro
){
    /**
     * TEST 模块
     *
     * @class   module:pool/module-test/src/test/module.Test
     * @extends module:pool/module-base/src/base.Module
     *
     * @param {Object} options - 模块构造参数
     */
    var Test = k._$klass();
    pro = Test._$extend(m.Module);

    /**
     * 构建模块，这部分主要完成以下逻辑：
     * 
     * * 构建模块主体DOM树结构
     * * 初始化使用的依赖组件的配置信息（如输入参数、回调事件等）
     * * 一次性添加的事件（即模块隐藏时不回收的事件）
     * * 后续用到的节点缓存（注意如果第三方组件配置信息里已经缓存的节点不需要再额外用变量缓存节点）
     *
     * 在UMI配置时的 config 配置直接做为 _doBuild 的输入参数
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
     * @method  module:pool/module-test/src/test/module.Test#_doBuild
     * @param   {Object} options - 构建参数，模块UMI配置时config输入参数
     * @returns {void}
     */
    pro._doBuild = function (options) {
        this.__super(html, options);
        // TODO
    };

    /**
     * 显示模块业务逻辑实现，这部分主要完成以下逻辑：
     *
     * * 组装/分配第三方组件，形成完整的模块结构
     * * 添加模块生命周期内DOM事件（模块隐藏时回收）
     *
     * @protected
     * @method  module:pool/module-test/src/test/module.Test#_onShow
     * @param   {Object} options        - 显示参数
     * @param   {String} options.target - 目标 UMI
     * @param   {String} options.source - 原始 UMI
     * @param   {String} options.href   - 完整地址
     * @param   {Object} options.param  - 模块切入查询参数对象 a=aa&b=bb  -> {a:"aa",b:"bb"}
     * @param   {Array}  options.prest  - REST地址模块之后信息做为参数 如地址 /a/b/c/d 对应的模块为 /a/b 则此参数为 ["c","d"]
     * @returns {void}
     */
    pro._onShow = function (options) {
        this.__super(options);
        // TODO
    };

    /**
     * 刷先模块业务逻辑实现，这部分主要完成以下逻辑：
     * 
     * * 根据输入信息加载数据
     * * 需要数据才能构造的第三方组件分配/组装
     *
     * @protected
     * @method  module:pool/module-test/src/test/module.Test#_onRefresh
     * @param   {Object} options        - 刷新参数
     * @param   {String} options.target - 目标 UMI
     * @param   {String} options.source - 原始 UMI
     * @param   {String} options.href   - 完整地址
     * @param   {Object} options.param  - 模块切入查询参数对象 a=aa&b=bb  -> {a:"aa",b:"bb"}
     * @param   {Array}  options.prest  - REST地址模块之后信息做为参数 如地址 /a/b/c/d 对应的模块为 /a/b 则此参数为 ["c","d"]
     * @returns {void}
     */
    pro._onRefresh = function (options) {
        this.__super(options);
        var opt = options.param||{};
        // TODO
    };

    /**
     * 隐藏模块业务逻辑实现，这部分主要完成以下逻辑：
     *
     * * 回收所有分配的NEJ组件（基类已处理）
     * * 回收所有分配的Regular组件（基类已处理）
     * * 回收所有添加的生命周期事件（基类已处理）
     * * 确保onhide之后的组件状态同onshow之前一致
     *
     * @protected
     * @method  module:pool/module-test/src/test/module.Test#_onHide
     * @returns {void}
     */
    pro._onHide = function () {
        // TODO
        this.__super();
    };

    /**
     * 构建模块
     *
     * @method module:pool/module-test/src/test/module.build
     * @param {Object} options - 模块配置参数
     * @see   {@link module:pool/module-base/src/base.build}
     */
    exports.build  = m.build._$bind(m,Test);

    /**
     * 注册模块
     *
     * @method module:pool/module-test/src/test/module.regist
     * @param {String} umi - 模块UMI或者别名
     * @see   {@link module:pool/module-base/src/base.regist}
     */
    exports.regist = m.regist._$bind2(m,Test);

    // 导出模块
    exports.Test = Test;
});
```

### index.js

模块注册到UMI调度系统

```javascript
/**
 * TEST 模块注冊文件
 *
 * @version  1.0
 * @author   edu <edu@corp.netease.com>
 */
NEJ.define([
    './module.js'
],function(
    m
){
    m.regist('test');
});
```

### index.html

UMI调度系统中模块的入口文件

```html
<textarea name="css" data-src="./index.css"></textarea>
<textarea name="js" data-src="./index.js"></textarea>
```
