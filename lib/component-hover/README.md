# Hover 组件

## 组件状态

[![build status](https://g.hz.netease.com/edu-frontend/component-hover/badges/master/build.svg)](https://g.hz.netease.com/edu-frontend/component-hover/commits/master)

## 组件文档

组件详细文档请查看 [这里](./docs/index.html)

## 样式重写

样式的层级结构如下所示

```bash
ux-hover
   |- ux-hover_xxx ux-hover_xxx__aa   描述描述
   |- ux-hover_yyy ux-hover_yyy__bb   描述描述
   |- ux-hover_zzz                            描述描述
```

可用的控制样式表

| 名称 | 描述 |
| :--- | :--- |
| z-dis | 描述描述 |
| z-crt | 描述描述 |

## 使用范例

### 标签化使用

组件关联的结构可如下所示

```html
<ux-hover></ux-hover>
```

### 脚本中使用

组件内置样式和结构，使用者如果样式与结构同内置一致则可以直接使用，范例如下

```javascript
NEJ.define([
    'pool/component-hover/src/hover/ui'
],function(
    HoverUI
){
    var Hover = new HoverUI({
        data:{
            
        }
    });
    Hover.$inject('#parent');
})
```