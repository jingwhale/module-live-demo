# VideoPlayer组件

## 当前状态

[![build status](https://g.hz.netease.com/edu-frontend/component-video-player/badges/master/build.svg)](https://g.hz.netease.com/edu-frontend/component-video-player/commits/master)

## 使用范例

组件详细文档请移步 [这里](./docs/index.html)

### 标签化使用样例

组件的标签化使用方式可如下所示

```html
<ux-video-player></ux-video-player>
```

### 脚本中使用样例

组件内置样式和结构，使用者如果样式与结构同内置一致则可以直接使用，范例如下

```javascript
NEJ.define([
    'pool/component-video-player/src/video-player_ui'
],function(
    VideoPlayerUI
){
    var video-player = new VideoPlayerUI({
        data:{
            
        }
    });
    video-player.$inject('#parent');
    // TODO
})
```
