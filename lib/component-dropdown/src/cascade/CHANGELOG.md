# 更新日志

更新日志模板文件

* 文件模板基于 [如何维护更新日志](http://keepachangelog.com/zh-CN/0.3.0/)
* 项目版本遵循 [语义化版本规范](http://semver.org/lang/zh-CN/)

## [0.0.29]
### Fixed
- 修复Android 7.0以上滚动卡顿现象

## [Unreleased]
### Added
- 添加selectDone事件
- 添加complete事件,在选完的时候才会抛出
- 给web组件添加placeholders 特性

## 0.0.13
### Added
- 添加web和wap级联组件,支持选择时异步取数据(不需要一开始把所有数据传入)
- web端采用dropdown形式
- wap端采用了新的交互形式,详情可见tutorials;注意必须引入iscroll和hammerjs才可以正常使用

### Future
- 级联组件支持不需传入source、只用传入service和selectedIds就能够自动请求数据(promise)
- 支持重置
 
