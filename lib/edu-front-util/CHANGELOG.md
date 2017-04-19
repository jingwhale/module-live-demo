# 版本log
所有关键的改动都要记录在这个文件中，因为该工程被其他多个项目用到 <br/>
**版本格式：主版本号.次版本号.修订号**
- 主版本号：当你做了不兼容的API修改
- 次版本号：当你做了向下兼容的功能性新增
- 修订号：当你做了向下兼容的问题修正。

```
  *: 任意版本
  1.1.0: 指定版本
  ~1.1.0: >=1.1.0 && <1.2.0
  ^1.1.0: >=1.1.0 && <2.0.0
```
-----------

## [Unreleased]

##[0.3.19]
### Added
- 单元测试添加
- 单元测试覆盖率添加100%
- mobileUtil删除无用方法

##[0.3.17]
### Edited
- criteo打点方法bugfix
- 修复静态代码检查

##[0.3.16]
### Added
- gaUtil 添加criteo打点方法


##[0.3.13]
### Added
- 图片压缩接口，对于原有的相册链接，不传宽高时返回原图


##[0.3.12]
### Added
- 添加走CDN的图片上传链接方法

## [0.3.7]
### Added
- 修复字节格式化问题

## [0.3.5] - 
### Added
- timeutil add _$formateTiktokByHMS 格式化倒计时的时间 格式化后的字符串,如'12:25:36'
- shareUtil 分享util

### Added
- mobileUtil add k12WebView判断

## [0.3.04] - 2016-10-10
### fixed
- 修复mobileUtil的isWrap方法没有CtrlDMobile的bug

## [0.3.03] - 2016-10-10
### Added
- 重构单元测试，使用chai+mocha，以解决运行单元测试时找不到NEJ的问题

## [0.3.02] - 2016-10-10
### Added
- 取消兼容性NEJ的写法，因为新版本NEJ不支持，会产生打包问题

## [0.3.01] - 2016-10-09
### Added
- mobileUtil有些方法的调用没有加_$

## [0.3.00] - 2016-09-12
### add
- flashUtil._$checkFlash()  判断是否安装了flash

## [0.2.76] - 2016-08-11
### add
- objectUtil._$deepCleanObj()  深度清除该对象中的null/undefined,返回一个新对象

## [0.2.75] - 2016-08-11
### fixed
- numUtil _$formatNum fixed bug

## [0.2.74] - 2016-08-10
### Added
- 添加mobileUtil中的isAndroid和isIphone方法
- 修复mobileUtil中的bug


## [0.1.73] - 2016-07-21
### Added
- 添加timeUtil中的str2Millionsec方法，把格式化的视频时间转回为秒
- 添加promise方法

## [0.0.73] - 2016-07-12
### Added
- 基准版本，以前的我就不多说了.

[0.3.19]:  https://git4u.hz.netease.com/edu-front/edu-front-util/compare/9076167..b06c4c0
[0.3.17]:  https://git4u.hz.netease.com/edu-front/edu-front-util/compare/6895fa4..93a3dbc  
[0.3.16]:  https://git4u.hz.netease.com/edu-front/edu-front-util/compare/5bd51b5..ad57754 
[0.3.13]:  https://git4u.hz.netease.com/edu-front/edu-front-util/compare/9c4bd79..0461961 
[0.3.12]:  https://git4u.hz.netease.com/edu-front/edu-front-util/compare/d9cee9a..e273ad0
[v0.3.7]:  https://git4u.hz.netease.com/edu-front/edu-front-util/compare/b3d3f7b..e5daa33
[v0.3.04]: https://git4u.hz.netease.com/edu-front/edu-front-util/compare/b175765..1868fd7
[v0.3.03]: https://git4u.hz.netease.com/edu-front/edu-front-util/compare/1a644fb..bce1ede
[v0.3.02]: https://git4u.hz.netease.com/edu-front/edu-front-util/compare/e497d4c..d151fe1
[v0.3.01]: https://git4u.hz.netease.com/edu-front/edu-front-util/compare/dfb5da4..f2122b3
[v0.3.00]: https://git4u.hz.netease.com/edu-front/edu-front-util/compare/df15ec2..ea5e7fb
[v0.2.76]: https://git4u.hz.netease.com/edu-front/edu-front-util/compare/bef473b..5c41ff7
[v0.2.75]: https://git4u.hz.netease.com/edu-front/edu-front-util/compare/e9a3805..bef473b
[v0.1.73]: https://git4u.hz.netease.com/edu-front/edu-front-util/compare/ed9a2e5..4b8bd6a
