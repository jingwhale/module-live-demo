# input组件模板工程

## 当前状态

[![build status](https://g.hz.netease.com/edu-frontend/component-input/badges/master/build.svg)](https://g.hz.netease.com/edu-frontend/component-input/commits/master)

[![coverage report](https://g.hz.netease.com/edu-frontend/component-input/badges/master/coverage.svg)](https://g.hz.netease.com/edu-frontend/component-input/commits/master)

## 组件内容

改组件仓库包含四个组件内容, ex:
```
| - src
     | - base           基础的输入组件,包含通用的样式和js逻辑
     | - input          input单行输入框
     | - numberinput    数字输入框,包含向上向下选取按钮
     | - textarea       多行输入框
     | - search         搜索ui
```

## 使用范例

### 标签化使用
```html
<div id="parentNode">
    <ux-input type="text" value={value}>
</div>
```

### 在脚本中使用
```js
    new Input({
        data: {
            type: "text",
            value: value
        }
    }).&inject('#parentNode')
```
