# Dropdown 组件 test

## 组件状态

[![build status](https://g.hz.netease.com/edu-frontend/component-dropdown/badges/master/build.svg)](https://g.hz.netease.com/edu-frontend/component-dropdown/commits/master)

## 组件文档

组件详细文档请查看 [这里](./docs/index.html)

## 样式重写

样式的层级结构如下所示

```bash
ux-dropdown
   |- ux-dropdown_hd   选择框
   | |- ux-icon-caret-down 向下小箭头
   | |- ux-icon-caret-up 向上小箭头
   |- ux-dropdown_bd   选择列表div
   | |- ux-dropdown_listview 下拉列表ul
```

可用的控制样式表

| 名称 | 描述 |
| :--- | :--- |
| z-dis | 禁用下拉列表，用于ux-dropdown节点 |
| z-divider | 列表中的分隔符，用于li节点 |

## 使用范例

### 标签化使用

组件关联的结构可如下所示

```html
<ux-dropdown placeholder={placeholder} source={source} visible={visible} open={open} ></ux-dropdown>
```

### 脚本中使用

组件内置样式和结构，使用者如果样式与结构同内置一致则可以直接使用，范例如下

```javascript
NEJ.define([
    'pool/component-dropdown/src/dropdown/ui'
],function(
    DropdownUI
){
    var dropdown = new DropdownUI({
        data:{
            source: source,
            placeholder: '下拉列表hover测试',
            visible: true,
            selected: source[1],
            open: false,
            hoverToggle: true
        }
    });
    dropdown.$inject('#parent');
})
```

# Suggest 组件

## 组件状态

[![build status](https://g.hz.netease.com/edu-frontend/component-dropdown/badges/master/build.svg)](https://g.hz.netease.com/edu-frontend/component-dropdown/commits/master)

## 组件文档

组件详细文档请查看 [这里](./docs/index.html)

## 样式重写

样式的层级结构如下所示

```bash
ux-suggest
   |- ux-dropdown_hd   选择框
   | |- ux-icon-caret-down 向下小箭头
   | |- ux-input 输入框
   |- ux-dropdown_bd   选择列表div
   | |- ux-dropdown_listview 下拉列表ul
```

可用的控制样式表

| 名称 | 描述 |
| :--- | :--- |
| z-dis | 禁用，用于ux-suggest节点 |
| z-divider | 列表中的分隔符，用于li节点 |

## 使用范例

### 标签化使用

组件关联的结构可如下所示

```html
<ux-suggest placeholder={placeholder} source={source} visible={visible} ></ux-suggest>
```

### 脚本中使用

组件内置样式和结构，使用者如果样式与结构同内置一致则可以直接使用，范例如下

```javascript
NEJ.define([
    'pool/component-dropdown/src/suggest/ui'
],function(
    SuggestUI
){
    var suggest = new SuggestUI({
        data:{
            source: source,
            placeholder: 'suggest测试',
            visible: true,
            disabled: false,
            hasDown: false
        }
    });
    suggest.$inject('#parent');
})
```

# select_group 组件

## 组件状态

[![build status](https://g.hz.netease.com/edu-frontend/component-dropdown/badges/master/build.svg)](https://g.hz.netease.com/edu-frontend/component-dropdown/commits/master)

## 组件文档

组件详细文档请查看 [这里](./docs/index.html)

## 样式重写

样式的层级结构如下所示

```bash
ux-select_group
   |- ux-dropdown
```

## 使用范例

### 标签化使用

组件关联的结构可如下所示

```html
<ux-select_group  source={source} depth={depth} ></ux-select_group>
```

### 脚本中使用

组件内置样式和结构，使用者如果样式与结构同内置一致则可以直接使用，范例如下

```javascript
NEJ.define([
    'pool/component-dropdown/src/select_group/ui'
],function(
    Select_group
){
    var select_group = new Select_group({
        data:{
            sources=[
                [{
                    id:1,
                    name:"level1-1",
                    children: [{id:1,name:"level1-1-1"},{id:1,name:"level1-1-2"}]
                },
                {
                    id:2,
                    name:"level1-2",
                    children: [{id:2,name:"level1-2-1"},{id:1,name:"level1-2-2"}]
                }
                ],
                []
            ],
            depth: 2,
            selecteds=[undefined,undefined],
        }
    });
    select_group.$inject('#parent');
})
```

