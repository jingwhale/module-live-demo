# Editor 组件

## 组件状态

[![build status](https://g.hz.netease.com/edu-frontend/component-editor/badges/master/build.svg)](https://g.hz.netease.com/edu-frontend/component-editor/commits/master)

## 组件文档

组件详细文档请查看 [这里](./docs/index.html)

## 使用范例

### 标签化使用

组件关联的结构可如下所示

```html
<ux-editor></ux-editor>
```

## 命令配置
### 配置方法
#### 全站配置

1. 配置window.eduEditor_options对象

    ```
    window.eduEditor_options = {
        showCmds: [
            'cleardoc',
            'undo',
            'redo',
            'bold'
        ]
    }
    ```

2. 生成UI的时候在data中传入showCmds
    ```
    new EditorUI({
        data: {
            showCmds: [
                'cleardoc',
                'undo',
                'redo',

                'insertcode'
            ]
        }
    }).$inject("#demo1");
    ```


### 默认配置
```
'cleardoc',
'undo',
'redo',
'bold',
'italic',
'underline',
'strikethrough',
'insertorderedlist',
'insertunorderedlist',
'image',
'math',
'link',
'insertcode',
'fontsize',
'fontcolor'
```

### 配置信息
| 命令 | 说明 |
| cleardoc | 清楚内容 |
| undo | 回退操作 |
| redo | 重新操作 |
| zisp | 分割线 |
| bold | 粗体 |
| italic | 斜体 |
| underline | 下划线 |
| strikethrough | 中间横线划掉 |
| insertorderedlist | 有序列表 |
| insertunorderedlist | 无序列表 |
| image | 图片 |
| math | 公式编辑器 |
| link | 超链接 |
| paragraph | 文章段落 |
| insertcode | 插入代码 |
| fontsize | 字体大小 |
| justifyleft | 左对齐 |
| justifycenter | 居中 |
| justifyright | 右对齐 |
| horizontal | 分割线 |
| blockquote | 引用 |
| fontcolor | 字体颜色 |


