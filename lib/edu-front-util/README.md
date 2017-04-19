# 教育产品部前端Util类库
----------------------------------------------------------------------------
[![build status](https://g.hz.netease.com/edu-frontend/edu-front-util/badges/master/build.svg)](https://g.hz.netease.com/edu-frontend/edu-front-util/commits/master)
[![coverage report](https://g.hz.netease.com/edu-frontend/edu-front-util/badges/master/coverage.svg)](https://g.hz.netease.com/edu-frontend/edu-front-util/commits/master)

v1.1.0 将项目中与业务耦合关联不高的Util逻辑抽取出来了

## 主要模块

* arrayUtil 数组Util模块

* CashUtil 价格转换Util模块

* domUtil DOM操作Util模块

* emailUtil 邮箱判断Util模块

* encodeUtil 加密Util模块

* extend 对象合并Util模块

* flashUtil flash相关工具模块

* imageUtil 图片压缩相关的util模块

* mobileUtil mobile相关的util模块

* numUtil 数字格式化util模块

* objectUtil 对象操作util模块

* RegUtil 正则表达式Util模块

* TextUtil 字符串Util模块

* TimeUtil 时间转换Util模块

* urlUtil url相关的Util模块

* userUtil 用户信息处理工具类文件模块

* versionUtil 版本工具类模块

* debugUtil 前后端联调需要的util模块(??这东西现在还没有)

**目前的模块均使用CommonJs的方式来组织，后续扩展**

## Test（使用mocha+chai进行单元测试）
    * npm install mocha安装mocha
    * npm install puer安装puer
    * bower install安装nej
    * 在根目录下运行puer
    * 在弹出的浏览器页面选择test -> index.html，该页面会显示单元测试的执行结果

#### mocha常用命令

```
//执行测试单个文件
 mocha test/testDay1.test.js
//默认执行test目录下所有文件
mocha --recursive
//--help或-h参数，用来查看Mocha的所有命令行参数
mocha --help
//--reporter参数用来指定测试报告的格式，默认是spec格式
mocha
等同于
mocha --reporter spec
//--reporters参数可以显示所有内置的报告格式
mocha --reporters
//使用mochawesome 报表
mocha test/testDay1.test.js --reporter mochawesome
```

#### 单元测试的写法

单元测试使用chai的断言库assert

例子：

```
NEJ.define([
    'pro/numUtil',    //被测试的文件
],function (
    numUtil  
){

var assert  = chai.assert ;

describe('numUtil', function() {
    describe('#numUtil._$num10000(),把输入的数值转化为以万为单位、不足万的显示原数', function () {
        it('输入41023，应该输出4.1万', function () {
            assert.equal("4.1万", numUtil._$num10000(41023));});
        it('输入41523，应该输出4.2万', function(){
            assert.equal("4.2万", numUtil._$num10000(41523));
        });
        it('输入30000，应该输出3万', function(){
            assert.equal("3万", numUtil._$num10000(30000));
        });
        it('输入4000，应该输出4000', function(){
            assert.equal("4000", numUtil._$num10000(4000));
        });
            
    });
    })
```

* 每个方法写一个describe，形式为：‘方法名+方法描述’
* 每个方法的测试用例写一个it，描述形式为： ‘输入xx,应该输出xx’

#### 常见问题

* 如何在单元测试里判断两个对象相等？ 
```
assert.deepEqual({"a":0,"d":1,"f":"","obj":{"a":0,"d":1,"f":""}}, objectUtil._$deepCleanObj({ a: 0, b: undefined, c: null, d :1 ,f:'', obj:{a: 0, b: undefined, c: null, d :1 ,f:''}}));
```
* 如何判断两个数组相等？
```
 assert.sameMembers([1,2,3], [1,2,3]);
```

## 注释生成API文档（使用Jsdoc）
	* 在本项目根目录命令行输入npm run js2doc
	* 生成的文档在docs文件夹下
	* 点击docs/index.html打开

### 项目统一注释标准

**包头部**

表明模块名称、版本、作者、路径等信息

```javascript
/**
 * 
 * 图片压缩相关的util
 * @module imageUtil
 * @version  1.0
 * @author   hzshaoyy(hzshaoyy@corp.netease.com)
 * @path     eutil/imageUtil
 * --------------------------------------------------------
 */
```

**方法**

写明方法的用途，标明方法名、参数、返回值等信息

```javascript
/**
 * 格式化计算文件大小
 * @method _$formatFileSize
 * @param  {Number} _bytes 字节数
 * @return string
 */
```

### jsdoc配置

jsdoc包的安装目录为：node_module/jsdoc，其配置文件为目录下的conf.json文件。

```
"opts":{
  "template": "node_modules/ink-docstrap/template",  // 生成的文档采用的Html模板
  "encoding": "utf8",               // 编码方式
  "destination": "docs/",          // 输出文档的存放路径
  "recurse": true,                  // same as -r
  "readme": "README.md"             //首页显示README.md的内容
}
```

具体的配置项见参考资料中的jsdoc文档。

### ink-docstrap

ink-docstrap是基于jsdoc的文档模板，有多种样式可供选择，使jsdoc生成的文档页面更加美观。

它的配置在jsdoc的conf.json文件中的template字段。具体配置项见文末的参考资料。

```
"templates" : {
  "cleverLinks"           : false,
  "monospaceLinks"        : false,
  "dateFormat"            : "ddd MMM Do YYYY",
  "outputSourceFiles"     : true,
  "outputSourcePath"      : true,
  "systemName"            : "edu-front-util",  //全局显示的项目名称
  "footer"                : "",
  "copyright"             : "网易杭州研究院--教育产品部门--前端技术部",  //版权所有
  "navType"               : "vertical",
  "theme"                 : "flatly",   //使用的主题，伦家觉得这个绿色很小清新~
  "linenums"              : true,
  "collapseSymbols"       : false,
  "inverseNav"            : true,
  "syntaxTheme"           : "default"  //代码高亮背景色，还可以选dark
}
```

## 单元测试覆盖率

* 执行npm install
* 依次执行npm run test , npm run coverage-report 

npm run test命令是执行单元测试，因为覆盖率是根据单元测试来的，所以要先执行单元测试

npm run coverage则是在本地的coverage文件夹中根据刚刚的单元测试结果，生成lcov-report/index.html文件，打开即可查看单元测试覆盖率

*  Q&A:
* 如何忽略对某行的单元测试覆盖率检测？

 https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md



## 参考资料：

mocha教程： http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html

assert文档： https://nodejs.org/dist/latest-v4.x/docs/api/assert.html#assert_assert_equal_actual_expected_message

chai文档： http://chaijs.com/

jsdoc中文文档：http://www.css88.com/doc/jsdoc/tags-requires.html

ink-docstrap文档：https://docstrap.github.io/docstrap/index.html
