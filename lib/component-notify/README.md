# Notify 组件

## 组件状态

[![build status](https://g.hz.netease.com/edu-frontend/component-notify/badges/master/build.svg)](https://g.hz.netease.com/edu-frontend/component-notify/commits/master) 
[![coverage report](https://g.hz.netease.com/edu-frontend/component-notify/badges/feature/2c_coverage_syy_20161230/coverage.svg)](https://g.hz.netease.com/edu-frontend/component-notify/commits/feature/2c_coverage_syy_20161230)

## 组件文档

组件详细文档请查看 [这里](./docs/index.html)

## 样式重写

样式的层级结构如下所示

```bash
ux-notify ux-notify-{postion}
   |- ux-message ux-message-{message.state}
       |- ux-message_close
       |- ux-message_icon ux-icon-{message.state}-circle
       |- [text]
```

可用的控制样式表

| 名称 | 描述 |
| :--- | :--- |
| postion | notify出现的位置, 参数可选为`topcenter`、`topleft`、`topright`、`bottomcenter`、`bottomleft`、`bottomright`、`static` |

## 使用范例

### 脚本中使用

组件内置样式和结构，使用者如果样式与结构同内置一致则可以直接使用，范例如下

```javascript
NEJ.define([
    'pool/component-notify/src/notify/ui'
],function(
    NotifyUI
){  
    //设置notify出现的位置,默认在顶部中间
    Notify.setPosition('bottomcenter');
    //设置notify是不是只显示一条 默认为false
    Notify.setSingle(true);
    
    Notify.show('对了', 'success', 3000);
    Notify.success('对了');
    Notify.warn('警告');
    Notify.error('错了');
})
```
