# 更新日志

更新日志模板文件

* 文件模板基于 [如何维护更新日志](http://keepachangelog.com/zh-CN/0.3.0/)
* 项目版本遵循 [语义化版本规范](http://semver.org/lang/zh-CN/)

## Unreleased

### Added

- 列表 CRUD 操作统一增加 _afterXXXX 处理逻辑

### Changed

- 列表变化刷新统一走 listchange 事件

## 0.0.2 - 2016-09-28

### Changed

- 修正关键字异常 extends -> $extends

## 0.0.1 - 2016-09-27

### Added

- 带分页列表视图基类
- 支持列表数据载入及展示
