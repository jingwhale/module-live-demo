# 更新日志

更新日志模板文件

* 文件模板基于 [如何维护更新日志](http://keepachangelog.com/zh-CN/0.3.0/)
* 项目版本遵循 [语义化版本规范](http://semver.org/lang/zh-CN/)


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

### Added

### Changed

### Removed


### Fixed


### Deprecated


### Security

-----------
## 0.0.2 - 2016-09-22

### Fixed
移除draggable组件destroy方法，该方法中销毁cancel()会导致拖拽bug


-----------
## 0.0.1 - 2016-09-18

- drag-drop 工程搬迁
- 规范化注释
- 测试
- destroy() 销毁注册事件

### Changed

- drag.data.proxy - function时，拖拽为其返回的元素的cloneNode，非本身

[0.0.2]: https://g.hz.netease.com/edu-frontend/component-drag-drop/compare/a81020a... bf9803b
[0.0.1]: https://g.hz.netease.com/edu-frontend/component-drag-drop/compare/7cf1477... a81020a
