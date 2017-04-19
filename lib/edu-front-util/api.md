## Modules

<dl>
<dt><a href="#module_arrayUtil">arrayUtil</a></dt>
<dd><p>--------------------array对象操作相关的util--------------------</p>
</dd>
<dt><a href="#module_cashUtil">cashUtil</a></dt>
<dd><p>--------------------cash对象操作相关的util--------------------</p>
</dd>
<dt><a href="#module_criteoUtil">criteoUtil</a></dt>
<dd><p>---------------------criteo 相关的util-------------------------</p>
</dd>
<dt><a href="#module_domUtil">domUtil</a></dt>
<dd><p>--------------------dom对象操作相关的util--------------------</p>
</dd>
<dt><a href="#module_emailUtil">emailUtil</a></dt>
<dd><p>---------邮箱相关处理工具类文件--------------------</p>
</dd>
<dt><a href="#module_encodeUtil">encodeUtil</a></dt>
<dd><p>--------------------加密Util--------------------</p>
</dd>
<dt><a href="#module_extend">extend</a></dt>
<dd><p>------------------对象合并--------------------------</p>
</dd>
<dt><a href="#module_flashUtil">flashUtil</a></dt>
<dd><p>---------flash相关处理工具类文件--------------------</p>
</dd>
<dt><a href="#module_gaUtil">gaUtil</a></dt>
<dd><p>---------------------ga 相关的util-------------------------</p>
</dd>
<dt><a href="#module_imageUtil">imageUtil</a></dt>
<dd><p>-----------------------图片压缩相关的util--------------------</p>
</dd>
<dt><a href="#module_jsbridge方法集合">jsbridge方法集合</a></dt>
<dd><p>--------------------jsbridge相关的util---------------------</p>
</dd>
<dt><a href="#module_mobileUtil">mobileUtil</a></dt>
<dd><p>--------------------mobile相关的util---------------------</p>
</dd>
<dt><a href="#module_numUtil">numUtil</a></dt>
<dd><p>----------------------数字格式化util-----------------------</p>
</dd>
<dt><a href="#module_objectUtil">objectUtil</a></dt>
<dd><p>-----------------objectUtil 对象操作相关的util--------------------</p>
</dd>
<dt><a href="#module_promise">promise</a></dt>
<dd><p>--------------------promise----------------------</p>
</dd>
<dt><a href="#module_regUtil">regUtil</a></dt>
<dd><p>------------输入校验工具类，比如校验邮箱，手机号，身份证等等-----------</p>
</dd>
<dt><a href="#pool/edu-front-util/src/shareUtil
--------------------------------------------------------module_">pool/edu-front-util/src/shareUtil
--------------------------------------------------------</a></dt>
<dd><p>-------------shareUtil模块对象，用于第三方分享----------------</p>
</dd>
<dt><a href="#module_textUtil">textUtil</a></dt>
<dd><p>-------------textUtil模块对象，用于获取或修改字符串信息----------------</p>
</dd>
<dt><a href="#module_timeUtil">timeUtil</a></dt>
<dd><p>-------TimerUtil模块对象，用于获取时间，以及格式化时间-------------</p>
</dd>
<dt><a href="#module_urlUtil">urlUtil</a></dt>
<dd><p>-------------- url相关的util-----------------------</p>
</dd>
<dt><a href="#module_userUtil">userUtil</a></dt>
<dd><p>---------用户信息处理工具类文件------------------------------</p>
</dd>
<dt><a href="#module_versionUtil">versionUtil</a></dt>
<dd><p>---------版本工具类文件------------------------------</p>
</dd>
</dl>

<a name="module_arrayUtil"></a>

## arrayUtil
--------------------array对象操作相关的util--------------------

**Path**: eutil/arrayUtil
--------------------------------------------------------  
**Version**: 1.0  
**Author:** hzshaoyy(hzshaoyy@corp.netease.com)  

* [arrayUtil](#module_arrayUtil)
    * [~_$arrContains(_arr, _value)](#module_arrayUtil.._$arrContains) ⇒ <code>Boolean</code>
    * [~_$arrContainsByKey(_arr, _value, _key)](#module_arrayUtil.._$arrContainsByKey) ⇒ <code>Boolean</code>
    * [~_$arrCross(_arrA, _arrB)](#module_arrayUtil.._$arrCross) ⇒ <code>Boolean</code>

<a name="module_arrayUtil.._$arrContains"></a>

### arrayUtil~_$arrContains(_arr, _value) ⇒ <code>Boolean</code>
判断数组是否包含值

**Kind**: inner method of <code>[arrayUtil](#module_arrayUtil)</code>  
**Returns**: <code>Boolean</code> - 是否包含  

| Param | Type | Description |
| --- | --- | --- |
| _arr | <code>Array</code> | 数组 |
| _value | <code>Object</code> | 包含的值 |

<a name="module_arrayUtil.._$arrContainsByKey"></a>

### arrayUtil~_$arrContainsByKey(_arr, _value, _key) ⇒ <code>Boolean</code>
判断对象数组[{key:123},{},{}]中key对应的是否包含值123

**Kind**: inner method of <code>[arrayUtil](#module_arrayUtil)</code>  
**Returns**: <code>Boolean</code> - 是否包含  

| Param | Type | Description |
| --- | --- | --- |
| _arr | <code>Array</code> | 数组 |
| _value | <code>Object</code> | 包含的值 |
| _key | <code>String</code> | key |

<a name="module_arrayUtil.._$arrCross"></a>

### arrayUtil~_$arrCross(_arrA, _arrB) ⇒ <code>Boolean</code>
判断数组A/B是否有相同的值

**Kind**: inner method of <code>[arrayUtil](#module_arrayUtil)</code>  
**Returns**: <code>Boolean</code> - 是否有相同的值  

| Param | Type | Description |
| --- | --- | --- |
| _arrA | <code>Array</code> | 数组A |
| _arrB | <code>Array</code> | 数组B |

<a name="module_cashUtil"></a>

## cashUtil
--------------------cash对象操作相关的util--------------------

**Path**: eutil/cashUtil
--------------------------------------------------------  
**Version**: 1.0  
**Author:** hzcaohuanhuan(hzcaohuanhuan@corp.netease.com)  

* [cashUtil](#module_cashUtil)
    * [~_$formatCash(_value)](#module_cashUtil.._$formatCash) ⇒ <code>String</code>
    * [~_$formatCashNoRMB(_value)](#module_cashUtil.._$formatCashNoRMB) ⇒ <code>String</code>
    * [~_$formatNumber(_value, _precision)](#module_cashUtil.._$formatNumber) ⇒ <code>number</code>

<a name="module_cashUtil.._$formatCash"></a>

### cashUtil~_$formatCash(_value) ⇒ <code>String</code>
格式化cash

**Kind**: inner method of <code>[cashUtil](#module_cashUtil)</code>  
**Returns**: <code>String</code> - 价格字符串  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>number</code> | 价格数值 |

**Example**  
```js
2  => ￥2.00  null => 免费
```
<a name="module_cashUtil.._$formatCashNoRMB"></a>

### cashUtil~_$formatCashNoRMB(_value) ⇒ <code>String</code>
格式化cash（不加￥符号）

**Kind**: inner method of <code>[cashUtil](#module_cashUtil)</code>  
**Returns**: <code>String</code> - 价格字符串  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>number</code> | 价格数值 |

**Example**  
```js
2  => 2.00  null => 免费
```
<a name="module_cashUtil.._$formatNumber"></a>

### cashUtil~_$formatNumber(_value, _precision) ⇒ <code>number</code>
格式化数值

**Kind**: inner method of <code>[cashUtil](#module_cashUtil)</code>  
**Returns**: <code>number</code> - 按精度格式化的数据  
**Example（0.3+0.2）=&gt;**: 0.5  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>number</code> | 需要格式化的数字 |
| _precision | <code>number</code> | 精度 |

<a name="module_criteoUtil"></a>

## criteoUtil
---------------------criteo 相关的util-------------------------

**Path**: eutil/criteoUtil
--------------------------------------------------------  
**Version**: 1.0  
**Author:** hzyuwei(hzyuwei@corp.netease.com)  
<a name="module_domUtil"></a>

## domUtil
--------------------dom对象操作相关的util--------------------

**Path**: eutil/domUtil
--------------------------------------------------------  
**Version**: 1.0  
**Author:** hzcaohuanhuan(hzcaohuanhuan@corp.netease.com)  

* [domUtil](#module_domUtil)
    * [~_$hiddenNode(_node，html节点)](#module_domUtil.._$hiddenNode)
    * [~_$isNodeShown(_node，html节点)](#module_domUtil.._$isNodeShown)
    * [~_$showNode(_node)](#module_domUtil.._$showNode)
    * [~_$toggleNodeDisplay(_node, _bool)](#module_domUtil.._$toggleNodeDisplay)
    * [~_$toggleClassName(是否显示类名, 节点, 类名)](#module_domUtil.._$toggleClassName)

<a name="module_domUtil.._$hiddenNode"></a>

### domUtil~_$hiddenNode(_node，html节点)
隐藏节点

**Kind**: inner method of <code>[domUtil](#module_domUtil)</code>  

| Param | Type |
| --- | --- |
| _node，html节点 | <code>Object</code> | 

<a name="module_domUtil.._$isNodeShown"></a>

### domUtil~_$isNodeShown(_node，html节点)
判断节点是否显示出来

**Kind**: inner method of <code>[domUtil](#module_domUtil)</code>  

| Param | Type |
| --- | --- |
| _node，html节点 | <code>Object</code> | 

<a name="module_domUtil.._$showNode"></a>

### domUtil~_$showNode(_node)
显示节点

**Kind**: inner method of <code>[domUtil](#module_domUtil)</code>  

| Param | Type |
| --- | --- |
| _node | <code>Object</code> | 

<a name="module_domUtil.._$toggleNodeDisplay"></a>

### domUtil~_$toggleNodeDisplay(_node, _bool)
控制是否显示节点

**Kind**: inner method of <code>[domUtil](#module_domUtil)</code>  

| Param | Type |
| --- | --- |
| _node | <code>Object</code> | 
| _bool | <code>boolean</code> | 

<a name="module_domUtil.._$toggleClassName"></a>

### domUtil~_$toggleClassName(是否显示类名, 节点, 类名)
切换节点样式

**Kind**: inner method of <code>[domUtil](#module_domUtil)</code>  

| Param | Type |
| --- | --- |
| 是否显示类名 | <code>Boolean</code> | 
| 节点 | <code>Object</code> | 
| 类名 | <code>String</code> | 

<a name="module_emailUtil"></a>

## emailUtil
---------邮箱相关处理工具类文件--------------------

**Path**: eutil/emailUtil
----------------------------------------------------  
**Version**: 1.0  
**Author:** hzcaohuanhuan(hzcaohuanhuan@corp.netease.com)  
<a name="module_emailUtil.._$isNeteaseEmail"></a>

### emailUtil~_$isNeteaseEmail(email) ⇒ <code>Boolean</code>
判断是否是网易邮箱

**Kind**: inner method of <code>[emailUtil](#module_emailUtil)</code>  
**Returns**: <code>Boolean</code> - bool 是否为邮箱  

| Param | Type | Description |
| --- | --- | --- |
| email | <code>String</code> | 比如@163.com、@126.com、@yeah.net、@vip.163.com、@vip.126.com、@188.com |

<a name="module_encodeUtil"></a>

## encodeUtil
--------------------加密Util--------------------

**Path**: eutil/encodeUtil
----------------------------------------------------------  
**Version**: 1.0  
**Author:** hzshaoyy(hzshaoyy@corp.netease.com)  
<a name="module_encodeUtil.._$encode"></a>

### encodeUtil~_$encode(arg0, arg1) ⇒ <code>String</code>
编码字符串，
编码规则对象中r正则表达式参数提取字符串需要编码的内容，
然后使用编码规则对象中的映射表进行替换

**Kind**: inner method of <code>[encodeUtil](#module_encodeUtil)</code>  
**Returns**: <code>String</code> - 编码后的字串  

| Param | Type | Description |
| --- | --- | --- |
| arg0 | <code>Object</code> | 编码规则 |
| arg1 | <code>String</code> | 待编码的字串 |

**Example**  
```javascript
NEJ.define([
    'base/util'
],function(_u){
    // 把字符串99999根据规则9替换成t，结果：ttttt
    var str = _u._$encode({r:/\d/g,'9':'t'},'99999');
});
```
<a name="module_extend"></a>

## extend
------------------对象合并--------------------------

**Path**: pro/common/extend
--------------------------------------------------------  
**Version**: 1.0  
**Author:** hzliujunwei(hzliujunwei@corp.netease.com)  

* [extend](#module_extend)
    * [~isType(type)](#module_extend..isType)
    * [~isPlainObject()](#module_extend..isPlainObject)
    * [~extend(_bool, _args1被返回的对象, _args2需要复制的对象)](#module_extend..extend) ⇒ <code>Object</code> &#124; <code>String</code> &#124; <code>Number</code> &#124; <code>Boolean</code>

<a name="module_extend..isType"></a>

### extend~isType(type)
判断是否为某个类型对象

**Kind**: inner method of <code>[extend](#module_extend)</code>  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | 要判断的类型 |

<a name="module_extend..isPlainObject"></a>

### extend~isPlainObject()
判断plain对象

**Kind**: inner method of <code>[extend](#module_extend)</code>  
<a name="module_extend..extend"></a>

### extend~extend(_bool, _args1被返回的对象, _args2需要复制的对象) ⇒ <code>Object</code> &#124; <code>String</code> &#124; <code>Number</code> &#124; <code>Boolean</code>
对象合并

**Kind**: inner method of <code>[extend](#module_extend)</code>  
**Returns**: <code>Object</code> &#124; <code>String</code> &#124; <code>Number</code> &#124; <code>Boolean</code> - 被返回的对象  

| Param | Type | Description |
| --- | --- | --- |
| _bool | <code>Boolean</code> | 是否深度复制 |
| _args1被返回的对象 | <code>Object</code> &#124; <code>String</code> &#124; <code>Number</code> &#124; <code>Boolean</code> |  |
| _args2需要复制的对象 | <code>Object</code> &#124; <code>String</code> &#124; <code>Number</code> &#124; <code>Boolean</code> |  |

**Example**  
```js
例: extend(true, {}, {}, {});
```
<a name="module_flashUtil"></a>

## flashUtil
---------flash相关处理工具类文件--------------------

**Path**: eutil/flashUtil
----------------------------------------------------  
**Version**: 1.0  
**Author:** hzlixinxin(hzlixinxin@corp.netease.com)  
<a name="module_flashUtil.._$isNeteaseEmail"></a>

### flashUtil~_$isNeteaseEmail(email) ⇒ <code>Boolean</code>
判断是否安装了flash

**Kind**: inner method of <code>[flashUtil](#module_flashUtil)</code>  
**Returns**: <code>Boolean</code> - bool 是否安装了flash  

| Param | Type |
| --- | --- |
| email | <code>Void</code> | 

<a name="module_gaUtil"></a>

## gaUtil
---------------------ga 相关的util-------------------------

**Path**: eutil/gaUtil
--------------------------------------------------------  
**Version**: 1.0  
**Author:** hzcaohuanhuan(hzcaohuanhuan@corp.netease.com)  

* [gaUtil](#module_gaUtil)
    * [~pushLog(_data)](#module_gaUtil..pushLog)
    * [~_$trackPageView(_showHash, _pageSelfName)](#module_gaUtil.._$trackPageView)
    * [~_$trackEvent(_category, _action, _opt_label, _opt_value)](#module_gaUtil.._$trackEvent) ⇒
    * [~_$log(_obj)](#module_gaUtil.._$log) ⇒ <code>Void</code>

<a name="module_gaUtil..pushLog"></a>

### gaUtil~pushLog(_data)
往本地打log

**Kind**: inner method of <code>[gaUtil](#module_gaUtil)</code>  

| Param | Type | Description |
| --- | --- | --- |
| _data | <code>Object</code> | 数据vo |

<a name="module_gaUtil.._$trackPageView"></a>

### gaUtil~_$trackPageView(_showHash, _pageSelfName)
使用ga跟踪页面view点击

**Kind**: inner method of <code>[gaUtil](#module_gaUtil)</code>  

| Param | Type | Description |
| --- | --- | --- |
| _showHash | <code>String</code> | 显示的Hash |
| _pageSelfName | <code>String</code> | 页面名字 |

<a name="module_gaUtil.._$trackEvent"></a>

### gaUtil~_$trackEvent(_category, _action, _opt_label, _opt_value) ⇒
使用ga跟踪事件点击处理

**Kind**: inner method of <code>[gaUtil](#module_gaUtil)</code>  
**Returns**: void  
**Example（0.3+0.2）=&gt;**: 0.5  

| Param | Type | Description |
| --- | --- | --- |
| _category | <code>String</code> | 必填 |
| _action | <code>String</code> | 必填 |
| _opt_label | <code>String</code> | 选填 |
| _opt_value | <code>number</code> | 选填 |

<a name="module_gaUtil.._$log"></a>

### gaUtil~_$log(_obj) ⇒ <code>Void</code>
**Kind**: inner method of <code>[gaUtil](#module_gaUtil)</code>  

| Param | Type | Description |
| --- | --- | --- |
| _obj | <code>Object</code> | 对象 |

<a name="module_imageUtil"></a>

## imageUtil
-----------------------图片压缩相关的util--------------------

**Path**: eutil/imageUtil
--------------------------------------------------------  
**Version**: 1.0  
**Author:** hzshaoyy(hzshaoyy@corp.netease.com)  
<a name="module_imageUtil.._$scaleImage"></a>

### imageUtil~_$scaleImage(_url, _width, _height, _otherProp)
通过相册或者的服务动态缩放图片,走CDN

**Kind**: inner method of <code>[imageUtil](#module_imageUtil)</code>  

| Param | Type | Description |
| --- | --- | --- |
| _url | <code>String</code> | 图片地址 |
| _width | <code>Number</code> | 图片压缩后的宽 |
| _height | <code>Number</code> | 图片压缩后的高 |
| _otherProp | <code>String</code> | 附加属性，默认为1x95，可以不传 |

<a name="module_jsbridge方法集合"></a>

## jsbridge方法集合
--------------------jsbridge相关的util---------------------

**Path**: eutil/jsbridgeUtil
--------------------------------------------------------  
**Version**: 1.0  
**Author:** hzzhanghanhui(hzzhanghanhui@corp.netease.com)  
<a name="module_mobileUtil"></a>

## mobileUtil
--------------------mobile相关的util---------------------

**Path**: eutil/mobileUtil
--------------------------------------------------------  
**Version**: 1.0  
**Author:** hzcaohuanhuan(hzcaohuanhuan@corp.netease.com)  

* [mobileUtil](#module_mobileUtil)
    * [~_$getUserAgent()](#module_mobileUtil.._$getUserAgent)
    * [~_$isAndroidWebView()](#module_mobileUtil.._$isAndroidWebView)
    * [~_$isIosWebView()](#module_mobileUtil.._$isIosWebView)
    * [~_$isAndroidMoocWebView()](#module_mobileUtil.._$isAndroidMoocWebView)
    * [~_$isIosMoocWebView()](#module_mobileUtil.._$isIosMoocWebView)
    * [~_$isAndroidK12webView()](#module_mobileUtil.._$isAndroidK12webView)
    * [~_$isIosK12webView()](#module_mobileUtil.._$isIosK12webView)
    * [~_$isWebView()](#module_mobileUtil.._$isWebView)
    * [~_$isWebViewSupportJB()](#module_mobileUtil.._$isWebViewSupportJB)
    * [~_$isMobile()](#module_mobileUtil.._$isMobile)
    * [~_$is()](#module_mobileUtil.._$is)
    * [~_$isMobileAll()](#module_mobileUtil.._$isMobileAll)
    * [~_$isIpad()](#module_mobileUtil.._$isIpad)
    * [~_$isIphone()](#module_mobileUtil.._$isIphone)
    * [~_$isAndroid()](#module_mobileUtil.._$isAndroid)
    * [~_$isWap()](#module_mobileUtil.._$isWap)
    * [~_$isWeixin()](#module_mobileUtil.._$isWeixin)
    * [~_$getIosVersion()](#module_mobileUtil.._$getIosVersion) ⇒ <code>Number</code>
    * ~~[~_$openMobilePage()](#module_mobileUtil.._$openMobilePage)~~
    * ~~[~_$callAppDownload()](#module_mobileUtil.._$callAppDownload)~~

<a name="module_mobileUtil.._$getUserAgent"></a>

### mobileUtil~_$getUserAgent()
获取userAgnet

**Kind**: inner method of <code>[mobileUtil](#module_mobileUtil)</code>  

| Type |
| --- |
| <code>Void</code> | 

<a name="module_mobileUtil.._$isAndroidWebView"></a>

### mobileUtil~_$isAndroidWebView()
判断是否安卓study WebView

**Kind**: inner method of <code>[mobileUtil](#module_mobileUtil)</code>  

| Type |
| --- |
| <code>Void</code> | 

<a name="module_mobileUtil.._$isIosWebView"></a>

### mobileUtil~_$isIosWebView()
判断是否ios study WebView

**Kind**: inner method of <code>[mobileUtil](#module_mobileUtil)</code>  

| Type |
| --- |
| <code>Void</code> | 

<a name="module_mobileUtil.._$isAndroidMoocWebView"></a>

### mobileUtil~_$isAndroidMoocWebView()
判断是否安卓mocc webView

**Kind**: inner method of <code>[mobileUtil](#module_mobileUtil)</code>  

| Type |
| --- |
| <code>Void</code> | 

<a name="module_mobileUtil.._$isIosMoocWebView"></a>

### mobileUtil~_$isIosMoocWebView()
判断是否IOS mooc webView

**Kind**: inner method of <code>[mobileUtil](#module_mobileUtil)</code>  

| Type |
| --- |
| <code>Void</code> | 

<a name="module_mobileUtil.._$isAndroidK12webView"></a>

### mobileUtil~_$isAndroidK12webView()
判断是否android k12 webView

**Kind**: inner method of <code>[mobileUtil](#module_mobileUtil)</code>  

| Type |
| --- |
| <code>Void</code> | 

<a name="module_mobileUtil.._$isIosK12webView"></a>

### mobileUtil~_$isIosK12webView()
判断是否ios k12 webView

**Kind**: inner method of <code>[mobileUtil](#module_mobileUtil)</code>  

| Type |
| --- |
| <code>Void</code> | 

<a name="module_mobileUtil.._$isWebView"></a>

### mobileUtil~_$isWebView()
判断是否WebView

**Kind**: inner method of <code>[mobileUtil](#module_mobileUtil)</code>  

| Type |
| --- |
| <code>Void</code> | 

<a name="module_mobileUtil.._$isWebViewSupportJB"></a>

### mobileUtil~_$isWebViewSupportJB()
判断是否WebView 且支持jsbridge 唤醒app登陆

**Kind**: inner method of <code>[mobileUtil](#module_mobileUtil)</code>  

| Type |
| --- |
| <code>Void</code> | 

<a name="module_mobileUtil.._$isMobile"></a>

### mobileUtil~_$isMobile()
判断是否是移动端非适配页面

**Kind**: inner method of <code>[mobileUtil](#module_mobileUtil)</code>  

| Type |
| --- |
| <code>Void</code> | 

<a name="module_mobileUtil.._$is"></a>

### mobileUtil~_$is()
判断是否是该平台

**Kind**: inner method of <code>[mobileUtil](#module_mobileUtil)</code>  

| Type |
| --- |
| <code>Void</code> | 

<a name="module_mobileUtil.._$isMobileAll"></a>

### mobileUtil~_$isMobileAll()
判断是否是移动端

**Kind**: inner method of <code>[mobileUtil](#module_mobileUtil)</code>  

| Type |
| --- |
| <code>Void</code> | 

<a name="module_mobileUtil.._$isIpad"></a>

### mobileUtil~_$isIpad()
判断是否是Ipad端

**Kind**: inner method of <code>[mobileUtil](#module_mobileUtil)</code>  

| Type |
| --- |
| <code>Void</code> | 

<a name="module_mobileUtil.._$isIphone"></a>

### mobileUtil~_$isIphone()
判断是否是iphone端

**Kind**: inner method of <code>[mobileUtil](#module_mobileUtil)</code>  

| Type |
| --- |
| <code>Void</code> | 

<a name="module_mobileUtil.._$isAndroid"></a>

### mobileUtil~_$isAndroid()
判断是否是android端

**Kind**: inner method of <code>[mobileUtil](#module_mobileUtil)</code>  

| Type |
| --- |
| <code>Void</code> | 

<a name="module_mobileUtil.._$isWap"></a>

### mobileUtil~_$isWap()
判断是否是移动端适配页面

**Kind**: inner method of <code>[mobileUtil](#module_mobileUtil)</code>  

| Type |
| --- |
| <code>Void</code> | 

<a name="module_mobileUtil.._$isWeixin"></a>

### mobileUtil~_$isWeixin()
判断是否是微信打开

**Kind**: inner method of <code>[mobileUtil](#module_mobileUtil)</code>  

| Type |
| --- |
| <code>Void</code> | 

<a name="module_mobileUtil.._$getIosVersion"></a>

### mobileUtil~_$getIosVersion() ⇒ <code>Number</code>
[_$getIosVersion 返回ios的版本如 8,9]

**Kind**: inner method of <code>[mobileUtil](#module_mobileUtil)</code>  
**Returns**: <code>Number</code> - iosVersion  
**Author:** hzchenbo2014  

| Type |
| --- |
| <code>Void</code> | 

<a name="module_mobileUtil.._$openMobilePage"></a>

### ~~mobileUtil~_$openMobilePage()~~
***Deprecated***

打开移动端页面

**Kind**: inner method of <code>[mobileUtil](#module_mobileUtil)</code>  

| Type |
| --- |
| <code>Void</code> | 

<a name="module_mobileUtil.._$callAppDownload"></a>

### ~~mobileUtil~_$callAppDownload()~~
***Deprecated***

唤起app，如果失败去下载
微信打开，去中间页，提示用浏览器打开
iphone，不论是否唤起，都有下一步操作，跳转到下载页中间页，传_type = fromCallApp
android,唤起app，失败跳转到下载页中间页

**Kind**: inner method of <code>[mobileUtil](#module_mobileUtil)</code>  
**Author:** hzchenbo2014  

| Type |
| --- |
| <code>Void</code> | 

<a name="module_numUtil"></a>

## numUtil
----------------------数字格式化util-----------------------

**Path**: pro/common/numUtil
--------------------------------------------------------  
**Version**: 1.0  
**Author:** hzliujunwei(hzliujunwei@corp.netease.com)  

* [numUtil](#module_numUtil)
    * [~_$formatNum(_maxNum, cUnit)](#module_numUtil.._$formatNum) ⇒ <code>Number</code>
    * [~_$formatFileSize(_bytes)](#module_numUtil.._$formatFileSize) ⇒

<a name="module_numUtil.._$formatNum"></a>

### numUtil~_$formatNum(_maxNum, cUnit) ⇒ <code>Number</code>
格式化货币显示

**Kind**: inner method of <code>[numUtil](#module_numUtil)</code>  
**Returns**: <code>Number</code> - 格式化后的数字,默认和异常都为0  

| Param | Type | Description |
| --- | --- | --- |
| _maxNum | <code>Number</code> | 需要格式化的数字 |
| cUnit | <code>String</code> | 货币单位 |

<a name="module_numUtil.._$formatFileSize"></a>

### numUtil~_$formatFileSize(_bytes) ⇒
格式化计算文件大小

**Kind**: inner method of <code>[numUtil](#module_numUtil)</code>  
**Returns**: string  

| Param | Type | Description |
| --- | --- | --- |
| _bytes | <code>Number</code> | 字节数 |

<a name="module_objectUtil"></a>

## objectUtil
-----------------objectUtil 对象操作相关的util--------------------

**Path**: eutil/objectUtil
--------------------------------------------------------  
**Version**: 1.0  
**Author:** hzcaohuanhuan(hzcaohuanhuan@corp.netease.com)  

* [objectUtil](#module_objectUtil)
    * [~_$deepCopy(_originObj)](#module_objectUtil.._$deepCopy) ⇒ <code>Object</code>
    * [~_$deepCleanObj(_originObj)](#module_objectUtil.._$deepCleanObj) ⇒ <code>Object</code>
    * [~_$convertToJSONHex(_obj)](#module_objectUtil.._$convertToJSONHex) ⇒ <code>String</code>

<a name="module_objectUtil.._$deepCopy"></a>

### objectUtil~_$deepCopy(_originObj) ⇒ <code>Object</code>
深层拷贝 (NEJ.X() 的拷贝只能实现浅拷贝，拷贝的是对象的引用)

**Kind**: inner method of <code>[objectUtil](#module_objectUtil)</code>  
**Returns**: <code>Object</code> - 深克隆后的对象  

| Param | Type | Description |
| --- | --- | --- |
| _originObj | <code>Object</code> | 原始数据 |

<a name="module_objectUtil.._$deepCleanObj"></a>

### objectUtil~_$deepCleanObj(_originObj) ⇒ <code>Object</code>
深度清除 对象中值为null 与 undefined 的key

**Kind**: inner method of <code>[objectUtil](#module_objectUtil)</code>  
**Returns**: <code>Object</code> - 返回一个新的清除后的对象  

| Param | Type | Description |
| --- | --- | --- |
| _originObj | <code>Object</code> | 原始数据 |

<a name="module_objectUtil.._$convertToJSONHex"></a>

### objectUtil~_$convertToJSONHex(_obj) ⇒ <code>String</code>
将对象转换为JSON字符串,然后使用hex编码返回对象,主要是用于GA统计日志分析数据

**Kind**: inner method of <code>[objectUtil](#module_objectUtil)</code>  
**Returns**: <code>String</code> - '###'加上hex编码  

| Param | Type | Description |
| --- | --- | --- |
| _obj | <code>Object</code> | 需要转换的对象 |

<a name="module_promise"></a>

## promise
--------------------promise----------------------

**Path**: eutil/promise
--------------------------------------------------------  
**Version**: 1.0  
**Author:** hzliujunwei(hzliujunwei@corp.netease.com)  
<a name="module_regUtil"></a>

## regUtil
------------输入校验工具类，比如校验邮箱，手机号，身份证等等-----------

**Path**: eutil/regUtil
----------------------------------------------------------  
**Version**: 1.0  
**Author:** hzshaoyy(hzshaoyy@corp.netease.com)  

* [regUtil](#module_regUtil)
    * [~_$isEmail(_text)](#module_regUtil.._$isEmail) ⇒ <code>Boolean</code>
    * [~_$isPhone(_number)](#module_regUtil.._$isPhone) ⇒ <code>Boolean</code>
    * [~_$isTel(_number)](#module_regUtil.._$isTel) ⇒ <code>Boolean</code>
    * [~_$isPositiveNum(_number)](#module_regUtil.._$isPositiveNum) ⇒ <code>Boolean</code>
    * [~_$isQQ(_number)](#module_regUtil.._$isQQ) ⇒ <code>Boolean</code>

<a name="module_regUtil.._$isEmail"></a>

### regUtil~_$isEmail(_text) ⇒ <code>Boolean</code>
判断对象是否为合法的email

**Kind**: inner method of <code>[regUtil](#module_regUtil)</code>  
**Returns**: <code>Boolean</code> - 返回是否是Email  

| Param | Type | Description |
| --- | --- | --- |
| _text | <code>String</code> | 输入的字符串 |

<a name="module_regUtil.._$isPhone"></a>

### regUtil~_$isPhone(_number) ⇒ <code>Boolean</code>
判断对象是否为合法的手机号

**Kind**: inner method of <code>[regUtil](#module_regUtil)</code>  
**Returns**: <code>Boolean</code> - 返回是否是合法的手机号  

| Param | Type | Description |
| --- | --- | --- |
| _number | <code>String</code> | 输入的数字 |

<a name="module_regUtil.._$isTel"></a>

### regUtil~_$isTel(_number) ⇒ <code>Boolean</code>
判断对象是否为合法的电话号码
匹配格式：
11位手机号码
3-4位区号，7-8位直播号码，1－4位分机号
如：(0511-4405222、 021-87888822、12345678901、1234-12345678-1234）

**Kind**: inner method of <code>[regUtil](#module_regUtil)</code>  
**Returns**: <code>Boolean</code> - 返回是否是合法的电话号码  

| Param | Type | Description |
| --- | --- | --- |
| _number | <code>String</code> | 输入的数字 |

<a name="module_regUtil.._$isPositiveNum"></a>

### regUtil~_$isPositiveNum(_number) ⇒ <code>Boolean</code>
判断数字是否是整数，例如0.2 , 1.5 , 8

**Kind**: inner method of <code>[regUtil](#module_regUtil)</code>  
**Returns**: <code>Boolean</code> - 返回是否是整数  

| Param | Type | Description |
| --- | --- | --- |
| _number | <code>String</code> | 输入的数字 |

<a name="module_regUtil.._$isQQ"></a>

### regUtil~_$isQQ(_number) ⇒ <code>Boolean</code>
判断是否是qq号，例如10000起

**Kind**: inner method of <code>[regUtil](#module_regUtil)</code>  
**Returns**: <code>Boolean</code> - 返回是否是整数  

| Param | Type | Description |
| --- | --- | --- |
| _number | <code>String</code> | 输入的数字 |

<a name="pool/edu-front-util/src/shareUtil
--------------------------------------------------------module_"></a>

## pool/edu-front-util/src/shareUtil
--------------------------------------------------------
-------------shareUtil模块对象，用于第三方分享----------------

**Path**: eutil/shareUtil  
**Version**: 1.0  
**Author:** tangtianliang(tangtianliang@corp.netease.com)  

* [pool/edu-front-util/src/shareUtil
--------------------------------------------------------](#pool/edu-front-util/src/shareUtil
--------------------------------------------------------module_)
    * [~shareWeibo(_options)](#pool/edu-front-util/src/shareUtil
--------------------------------------------------------module_..shareWeibo) ⇒ <code>void</code>
    * [~shareWeibo(_options)](#pool/edu-front-util/src/shareUtil
--------------------------------------------------------module_..shareWeibo) ⇒ <code>void</code>

<a name="pool/edu-front-util/src/shareUtil
--------------------------------------------------------module_..shareWeibo"></a>

### pool/edu-front-util/src/shareUtil
--------------------------------------------------------~shareWeibo(_options) ⇒ <code>void</code>
分享到微信

**Kind**: inner method of <code>[pool/edu-front-util/src/shareUtil
--------------------------------------------------------](#pool/edu-front-util/src/shareUtil
--------------------------------------------------------module_)</code>  

| Param | Type |
| --- | --- |
| _options | <code>Object</code> | 
| _options.url | <code>String</code> | 
| _options.title | <code>String</code> | 
| _options.pic | <code>String</code> | 

<a name="pool/edu-front-util/src/shareUtil
--------------------------------------------------------module_..shareWeibo"></a>

### pool/edu-front-util/src/shareUtil
--------------------------------------------------------~shareWeibo(_options) ⇒ <code>void</code>
分享到QQ空间

**Kind**: inner method of <code>[pool/edu-front-util/src/shareUtil
--------------------------------------------------------](#pool/edu-front-util/src/shareUtil
--------------------------------------------------------module_)</code>  

| Param | Type |
| --- | --- |
| _options | <code>Object</code> | 
| _options.url | <code>String</code> | 
| _options.title | <code>String</code> | 
| _options.pic | <code>String</code> | 
| _options.description | <code>String</code> | 

<a name="module_textUtil"></a>

## textUtil
-------------textUtil模块对象，用于获取或修改字符串信息----------------

**Path**: eutil/textUtil
--------------------------------------------------------  
**Version**: 1.0  
**Author:** tangtianliang(tangtianliang@corp.netease.com)  

* [textUtil](#module_textUtil)
    * [~_$removeNRNBSP(_text)](#module_textUtil.._$removeNRNBSP) ⇒ <code>String</code>
    * [~_$filterText(_richText)](#module_textUtil.._$filterText) ⇒ <code>String</code>
    * [~_$getStringLength(_string)](#module_textUtil.._$getStringLength) ⇒ <code>Number</code>
    * [~_$sliceStrByLength(_string, _maxLength)](#module_textUtil.._$sliceStrByLength) ⇒ <code>String</code>
    * [~_$ellipsisStrByLength(_string, _maxLength)](#module_textUtil.._$ellipsisStrByLength) ⇒ <code>String</code>

<a name="module_textUtil.._$removeNRNBSP"></a>

### textUtil~_$removeNRNBSP(_text) ⇒ <code>String</code>
去掉回车换行tab,将多于的空格变成一个空格

**Kind**: inner method of <code>[textUtil](#module_textUtil)</code>  
**Returns**: <code>String</code> - 去掉空格之后的字符串  

| Param | Type | Description |
| --- | --- | --- |
| _text | <code>String</code> | 字符串 |

<a name="module_textUtil.._$filterText"></a>

### textUtil~_$filterText(_richText) ⇒ <code>String</code>
过滤富文本标签得方法

**Kind**: inner method of <code>[textUtil](#module_textUtil)</code>  
**Returns**: <code>String</code> - 转化为字符串的富文本  

| Param | Type | Description |
| --- | --- | --- |
| _richText | <code>String</code> | 带标签的富文本 |

<a name="module_textUtil.._$getStringLength"></a>

### textUtil~_$getStringLength(_string) ⇒ <code>Number</code>
获取字符串长度，中文是长度是2

**Kind**: inner method of <code>[textUtil](#module_textUtil)</code>  
**Returns**: <code>Number</code> - 字符串长度  

| Param | Type | Description |
| --- | --- | --- |
| _string | <code>String</code> | 输入的字符串 |

<a name="module_textUtil.._$sliceStrByLength"></a>

### textUtil~_$sliceStrByLength(_string, _maxLength) ⇒ <code>String</code>
截断字符串，处理中英文情况

**Kind**: inner method of <code>[textUtil](#module_textUtil)</code>  
**Returns**: <code>String</code> - 返回截断后的字符串  

| Param | Type | Description |
| --- | --- | --- |
| _string | <code>String</code> | 输入的字符串 |
| _maxLength | <code>Number</code> | 需要截断的长度, 实际的长度，中文算两个，则传入的_maxLength为*2 |

<a name="module_textUtil.._$ellipsisStrByLength"></a>

### textUtil~_$ellipsisStrByLength(_string, _maxLength) ⇒ <code>String</code>
截断字符串，如果超出字数限制，追加...

**Kind**: inner method of <code>[textUtil](#module_textUtil)</code>  
**Returns**: <code>String</code> - 返回截断后的字符串，如果超出字数限制，追加...  

| Param | Type | Description |
| --- | --- | --- |
| _string | <code>String</code> | 输入的字符串 |
| _maxLength | <code>Number</code> | 需要截断的长度 |

<a name="module_timeUtil"></a>

## timeUtil
-------TimerUtil模块对象，用于获取时间，以及格式化时间-------------

**Requires**: <code>[encodeUtil](#module_encodeUtil)</code>  
**Path**: eutil/timeUtil  
**Version**: 1.0  
**Author:** tangtianliang(tangtianliang@corp.netease.com)  

* [timeUtil](#module_timeUtil)
    * [~_$getServerRespondTime()](#module_timeUtil.._$getServerRespondTime) ⇒ <code>millisec</code>
    * [~_$getCurServerTime()](#module_timeUtil.._$getCurServerTime) ⇒ <code>millisec</code>
    * [~_$getTimeData(_time, _12time)](#module_timeUtil.._$getTimeData) ⇒ <code>Object</code>
    * [~_$formatTime(_time, _format)](#module_timeUtil.._$formatTime) ⇒ <code>string</code>
    * [~_$formatCommonTime(_time)](#module_timeUtil.._$formatCommonTime) ⇒ <code>String</code>
    * [~_$formatPeriod(_fromTime, _toTime, _format, _conjunction)](#module_timeUtil.._$formatPeriod) ⇒ <code>string</code>
    * [~_$tiktok(_endTime, _curTime)](#module_timeUtil.._$tiktok) ⇒ <code>Object</code>
    * [~_$formatTiktokTime(_endTime, _curTime)](#module_timeUtil.._$formatTiktokTime) ⇒ <code>String</code>
    * [~_$getCurDayPharse()](#module_timeUtil.._$getCurDayPharse) ⇒ <code>string</code>
    * [~_$getReplyTime(_millisec)](#module_timeUtil.._$getReplyTime) ⇒ <code>string</code>
    * [~_$Millisec2Str(_seconds)](#module_timeUtil.._$Millisec2Str) ⇒ <code>String</code>
    * [~_$str2Millisec(_strTime)](#module_timeUtil.._$str2Millisec) ⇒ <code>Number</code>

<a name="module_timeUtil.._$getServerRespondTime"></a>

### timeUtil~_$getServerRespondTime() ⇒ <code>millisec</code>
获取服务器渲染相应页面的时间

**Kind**: inner method of <code>[timeUtil](#module_timeUtil)</code>  
**Returns**: <code>millisec</code> - 返回服务器渲染相应页面的时间毫秒  

| Type |
| --- |
| <code>Void</code> | 

<a name="module_timeUtil.._$getCurServerTime"></a>

### timeUtil~_$getCurServerTime() ⇒ <code>millisec</code>
返回当前服务器的时间

**Kind**: inner method of <code>[timeUtil](#module_timeUtil)</code>  
**Returns**: <code>millisec</code> - 返回当前服务器的时间毫秒  

| Type |
| --- |
| <code>Void</code> | 

<a name="module_timeUtil.._$getTimeData"></a>

### timeUtil~_$getTimeData(_time, _12time) ⇒ <code>Object</code>
返回时间类型串
格式化时间，yyyy|yy|MM|cM|eM|M|dd|d|HH|H|mm|ms|ss|m|s|w

各标识说明：

| 标识  | 说明 |
| :--  | :-- |
| yyyy | 四位年份，如2001 |
| yy   | 两位年费，如01 |
| MM   | 两位月份，如08 |
| M    | 一位月份，如8 |
| dd   | 两位日期，如09 |
| d    | 一位日期，如9 |
| HH   | 两位小时，如07 |
| H    | 一位小时，如7 |
| mm   | 两位分钟，如03 |
| m    | 一位分钟，如3 |
| ss   | 两位秒数，如09 |
| s    | 一位秒数，如9 |
| ms   | 毫秒数，如234 |
| w    | 中文星期几，如一 |
| ct   | 12小时制中文后缀，上午/下午 |
| et   | 12小时制英文后缀，A.M./P.M. |
| cM   | 中文月份，如三 |
| eM   | 英文月份，如Mar |

**Kind**: inner method of <code>[timeUtil](#module_timeUtil)</code>  
**Returns**: <code>Object</code> - 格式化时间对象  

| Param | Type | Description |
| --- | --- | --- |
| _time | <code>millisec</code> | 时间毫秒 |
| _12time | <code>millisec</code> | 指定格式的时间串 |

<a name="module_timeUtil.._$formatTime"></a>

### timeUtil~_$formatTime(_time, _format) ⇒ <code>string</code>
格式化时间戳

**Kind**: inner method of <code>[timeUtil](#module_timeUtil)</code>  
**Returns**: <code>string</code> - 格式化后的规则  

| Param | Type | Description |
| --- | --- | --- |
| _time | <code>number</code> | 时间毫秒 |
| _format | <code>string</code> | 格式化规则 |

<a name="module_timeUtil.._$formatCommonTime"></a>

### timeUtil~_$formatCommonTime(_time) ⇒ <code>String</code>
通用格式化时间

**Kind**: inner method of <code>[timeUtil](#module_timeUtil)</code>  
**Returns**: <code>String</code> - 待定或yyyy年MM月dd日 HH:mm格式的时间  

| Param | Type | Description |
| --- | --- | --- |
| _time | <code>Number</code> | 时间毫秒 |

<a name="module_timeUtil.._$formatPeriod"></a>

### timeUtil~_$formatPeriod(_fromTime, _toTime, _format, _conjunction) ⇒ <code>string</code>
格式化时间段

**Kind**: inner method of <code>[timeUtil](#module_timeUtil)</code>  
**Returns**: <code>string</code> - 格式化后的时间段  

| Param | Type | Description |
| --- | --- | --- |
| _fromTime | <code>number</code> | 开始时间毫秒 |
| _toTime | <code>number</code> | 结束时间毫秒 |
| _format | <code>string</code> | 格式化规则 |
| _conjunction | <code>string</code> | 连接符 |

<a name="module_timeUtil.._$tiktok"></a>

### timeUtil~_$tiktok(_endTime, _curTime) ⇒ <code>Object</code>
生成倒计时时间对象

**Kind**: inner method of <code>[timeUtil](#module_timeUtil)</code>  
**Returns**: <code>Object</code> - 格式化时间对象  

| Param | Type | Description |
| --- | --- | --- |
| _endTime | <code>number</code> | 截止时间毫秒 |
| _curTime | <code>number</code> | 当前时间毫秒 |

<a name="module_timeUtil.._$formatTiktokTime"></a>

### timeUtil~_$formatTiktokTime(_endTime, _curTime) ⇒ <code>String</code>
格式化倒计时的时间

**Kind**: inner method of <code>[timeUtil](#module_timeUtil)</code>  
**Returns**: <code>String</code> - 格式化后的字符串,
                 倒计时长大于1天         5天5时5分钟
                 倒计时长大于1时小于1天   5时5分钟
                 倒计时长大于1分小于1时   5分钟
                 倒计时长大于1秒小于1分   5秒钟  

| Param | Type | Description |
| --- | --- | --- |
| _endTime | <code>Number</code> | 目标时间 |
| _curTime | <code>Number</code> | 当前时间 |

<a name="module_timeUtil.._$getCurDayPharse"></a>

### timeUtil~_$getCurDayPharse() ⇒ <code>string</code>
获取当前是上午、下午等等

**Kind**: inner method of <code>[timeUtil](#module_timeUtil)</code>  
**Returns**: <code>string</code> - 时间状态  
<a name="module_timeUtil.._$getReplyTime"></a>

### timeUtil~_$getReplyTime(_millisec) ⇒ <code>string</code>
显示规则：
            一分钟内：4s 前
            今天：19：52
            昨天以前：3月2日
            一年前（自然年）：2015年11月21日

**Kind**: inner method of <code>[timeUtil](#module_timeUtil)</code>  
**Returns**: <code>string</code> - 时间状态  

| Param | Type | Description |
| --- | --- | --- |
| _millisec | <code>number</code> | 时间毫秒 |

<a name="module_timeUtil.._$Millisec2Str"></a>

### timeUtil~_$Millisec2Str(_seconds) ⇒ <code>String</code>
格式化视频时长，目前只显示分钟和秒数

**Kind**: inner method of <code>[timeUtil](#module_timeUtil)</code>  
**Returns**: <code>String</code> - 格式化后的字符串，如：‘86:08’ , 有小时的显示‘11：21：21’  

| Param | Type | Description |
| --- | --- | --- |
| _seconds | <code>Number</code> | 秒数 |

<a name="module_timeUtil.._$str2Millisec"></a>

### timeUtil~_$str2Millisec(_strTime) ⇒ <code>Number</code>
把格式化的视频时长转换回秒数

**Kind**: inner method of <code>[timeUtil](#module_timeUtil)</code>  
**Returns**: <code>Number</code> - _seconds 秒数  

| Param | Type | Description |
| --- | --- | --- |
| _strTime | <code>String</code> | 格式化后的字符串，如：‘86:08’ , 有小时的显示‘11：21：21’ |

<a name="module_urlUtil"></a>

## urlUtil
-------------- url相关的util-----------------------

**Path**: eutil/urlUtil
--------------------------------------------------------  
**Version**: 1.0  
**Author:** hzshaoyy(hzshaoyy@corp.netease.com)  

* [urlUtil](#module_urlUtil)
    * [~_$parseUrlParams(_search)](#module_urlUtil.._$parseUrlParams) ⇒ <code>Object</code>
    * [~_$isRightUMI(_hash, _umiP)](#module_urlUtil.._$isRightUMI) ⇒ <code>Boolean</code>
    * [~_$getDecodeCurUrl(_urlParams)](#module_urlUtil.._$getDecodeCurUrl) ⇒ <code>String</code>
    * [~_$getReturnUrl(_urlParamsArr)](#module_urlUtil.._$getReturnUrl) ⇒ <code>String</code>

<a name="module_urlUtil.._$parseUrlParams"></a>

### urlUtil~_$parseUrlParams(_search) ⇒ <code>Object</code>
解析url参数

输入： ?123=dawd&adwd&a1=1
输出： { 123: 'dawd', adwd: '', a1: "1" }

**Kind**: inner method of <code>[urlUtil](#module_urlUtil)</code>  
**Returns**: <code>Object</code> - url参数map对象  

| Param | Type | Description |
| --- | --- | --- |
| _search | <code>String</code> | url |

<a name="module_urlUtil.._$isRightUMI"></a>

### urlUtil~_$isRightUMI(_hash, _umiP) ⇒ <code>Boolean</code>
判断当前hash是否是那个umi

**Kind**: inner method of <code>[urlUtil](#module_urlUtil)</code>  
**Returns**: <code>Boolean</code> - 是否符合  

| Param | Type | Description |
| --- | --- | --- |
| _hash | <code>String</code> | 当前hash |
| _umiP | <code>String</code> | 目标umi |

<a name="module_urlUtil.._$getDecodeCurUrl"></a>

### urlUtil~_$getDecodeCurUrl(_urlParams) ⇒ <code>String</code>
获取当前的Url，注意反编码url

**Kind**: inner method of <code>[urlUtil](#module_urlUtil)</code>  
**Returns**: <code>String</code> - 拼接后的url  

| Param | Type | Description |
| --- | --- | --- |
| _urlParams | <code>Object</code> | url上带上的参数，可以添加，用于后端判断 |

<a name="module_urlUtil.._$getReturnUrl"></a>

### urlUtil~_$getReturnUrl(_urlParamsArr) ⇒ <code>String</code>
获取returnUrl

**Kind**: inner method of <code>[urlUtil](#module_urlUtil)</code>  
**Returns**: <code>String</code> - 返回的url(base64)  

| Param | Type | Description |
| --- | --- | --- |
| _urlParamsArr | <code>Object</code> | url上带上的参数，可以添加，用于后端判断 |

<a name="module_userUtil"></a>

## userUtil
---------用户信息处理工具类文件------------------------------

**Path**: eutil/userUtil
----------------------------------------------------  
**Version**: 1.0  
**Author:** tangtianliang(tangtianliang@corp.netease.com)  

* [userUtil](#module_userUtil)
    * [~_$getWebUser()](#module_userUtil.._$getWebUser) ⇒ <code>Object</code>
    * [~_$isUserOwner(_userId)](#module_userUtil.._$isUserOwner) ⇒ <code>Boolean</code>

<a name="module_userUtil.._$getWebUser"></a>

### userUtil~_$getWebUser() ⇒ <code>Object</code>
获取登录的用户信息

**Kind**: inner method of <code>[userUtil](#module_userUtil)</code>  
**Returns**: <code>Object</code> - webuser  
<a name="module_userUtil.._$isUserOwner"></a>

### userUtil~_$isUserOwner(_userId) ⇒ <code>Boolean</code>
判断是否是用户自己

**Kind**: inner method of <code>[userUtil](#module_userUtil)</code>  
**Returns**: <code>Boolean</code> - 是否是用户自己  

| Param | Type | Description |
| --- | --- | --- |
| _userId | <code>String</code> | 传入的用户id |

<a name="module_versionUtil"></a>

## versionUtil
---------版本工具类文件------------------------------

**Path**: eutil/versionUtil
----------------------------------------------------  
**Version**: 1.0  
**Author:** tangtianliang(tangtianliang@corp.netease.com)  
<a name="module_versionUtil.._$versionCompare"></a>

### versionUtil~_$versionCompare(v1, v2, options) ⇒ <code>boolean</code>
比较版本大小

**Kind**: inner method of <code>[versionUtil](#module_versionUtil)</code>  
**Returns**: <code>boolean</code> - true v1>v2  

| Param | Type | Description |
| --- | --- | --- |
| v1 | <code>String</code> | 1.0.0版本1 |
| v2 | <code>String</code> | 1.0.0版本2 |
| options | <code>Object</code> | {                           lexicographical                           zeroExtend 后缀补全0                         } |

