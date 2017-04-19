# Button 组件

## 组件状态

[![build status](https://g.hz.netease.com/edu-frontend/component-button/badges/master/build.svg)](https://g.hz.netease.com/edu-frontend/component-button/commits/master)
[![coverage report](https://g.hz.netease.com/edu-frontend/component-button/badges/feature/2c_coverage_syy_20161230/coverage.svg)](https://g.hz.netease.com/edu-frontend/component-button/commits/feature/2c_coverage_syy_20161230)

## 组件文档

组件详细文档请查看 [这里](./docs/index.html)

## 样式重写

样式的层级结构如下所示

```bash
ux-btn
```

可用的控制样式表

| 名称 | 描述 |
| :--- | :--- |
| ux-btn-state | 按钮状态 ex: default primary warning disabled |
| ux-btn-size | 按钮大小 ex: xs, sm, lg, xl |
| ux-btn-width | 按钮宽度 |

## 使用范例

### 标签化使用

组件关联的结构可如下所示

```html
<ux-button value={} state={} size={} width={} />
```

### 脚本中使用

组件内置样式和结构，使用者如果样式与结构同内置一致则可以直接使用，范例如下

```javascript
NEJ.define([
    'pool/component-button/src/button/ui'
],function(
    ButtonUI
){
    var Button = new ButtonUI({
        data:{
            
        }
    });
    Button.$inject('#parent');
})
```
