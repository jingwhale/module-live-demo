# 更新日志

更新日志模板文件

* 文件模板基于 [如何维护更新日志](http://keepachangelog.com/zh-CN/0.3.0/)
* 项目版本遵循 [语义化版本规范](http://semver.org/lang/zh-CN/)

## Unreleased

### Added

- Cache 基类新增列表排序逻辑支持
- Cache 基类支持带进度导出任务支持
- 新增树形通用数据操作解决方案
- 新增获取二维码接口

### Fixed

- 修正 _doRequestWithCacheCheck 请求不做队列处理时的回调异常

### Changed

- 导入/导出/下载 统一接口从 users 移到 base 下

## 0.0.9

### Added

- 带进度轮询的任务实现接口 _doRequestWithProgress 支持 

### Changed 

- 名单缓存基类中 check 和 import 接口统一改用 _doRequestWithProgress 来实现
- check 接口改名为 checkImport

## 0.0.3

### Added

- 抽取通用的路径配置，提供 getRoot 接口支持
- 添加默认 post 事件处理， event.result 设置为 响应结果中的 result 字段
- 支持缓存/队列支持接口 _doRequestWithCacheCheck
- 抽取名单列表基类

### Changed 

- 调整默认设置与业务线设置合并时机，统一使用 _doFlushSetting

## 0.0.2 - 2016-09-28

### Changed 

- 修正IE8下关键字异常 do -> $do

## 0.0.1 - 2016-09-27

### Added

- 提供数据缓存基类
- 支持功能配置存取接口
