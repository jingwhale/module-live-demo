# 分页器组件

## 组件状态

[![build status](https://g.hz.netease.com/edu-frontend/component-pager/badges/master/build.svg)](https://g.hz.netease.com/edu-frontend/component-pager/commits/master)

## 组件文档

组件详细文档请查看 [这里](./docs/index.html)

## 样式重写

样式的层级结构如下所示

```bash
ux-pager
   |- ux-pager_btn ux-pager_btn__prev   上一页按钮
   |- ux-pager_sep ux-pager_sep__left   左侧片段分隔符
   |- ux-pager_itm                      页码按钮，其中肯定有第1页的页码
   |- ux-pager_sep ux-pager_sep__right  右侧片段分隔符
   |- ux-pager_btn ux-pager_btn__next   下一页按钮
```

可用的控制样式表

| 名称 | 描述 |
| :--- | :--- |
| z-dis | 禁用上一页/下一页按钮的控制样式，仅作用于 ux-pager_btn 节点 |
| z-crt | 当前选中页码的控制样式，仅作用于 ux-pager_itm 节点 |
| z-hdn | 分页器隐藏状态，仅作用于 ux-pager 节点 |

## 使用范例

### 标签化使用

组件关联的结构可如下所示

```html
<ux-pager index=10 total=100></ux-pager>
```

### 脚本中使用

组件内置样式和结构，使用者如果样式与结构同内置一致则可以直接使用，范例如下

```javascript
NEJ.define([
    'pool/component-pager/src/pager_ui'
],function(
    PagerUI
){
    var pager = new PagerUI({
        data:{
            index: 10,
            total: 100
        }
    });
    pager.$inject('#parent');
    pager.$on('change',function(event){
        // event.last
        // event.index
        // event.total
        // TODO something
    })
})
```