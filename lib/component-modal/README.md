# 通用组件-弹窗
[![build status](https://g.hz.netease.com/edu-frontend/component-modal/badges/master/build.svg)](https://g.hz.netease.com/edu-frontend/component-modal/commits/master)

## 使用方式
使用案例如下，详细API 参考doc文档，Modal有两种使用方式，一种是标准弹出框，一种是定制弹出框
1. 标准弹出框
展示样式如下图所示：
<img src="http://nos.netease.com/edu-image/AD192DCCF9B0D05B8CFDE966AE6DE605.png?imageView&thumbnail=667y344&quality=100" width="350" />
包含标题，标题最多展示两行，标题下方是描述，描述的长宽和标题一致，高度不限制。最下方式确定和取消按钮。
```
  NEJ.define([
       'pool/component-modal/src/modal/component'
  ],function(
       Modal
  ){
       var modal = new Modal({
           data:{
               title: 'test',
               total: 'content test'
           }
       });
       modal.$on('close',function(event){
           // event
       });
  });
```
2.定制弹出框
展示效果如下图所示：
<img src="http://nos.netease.com/edu-image/173950F81C87FCB60CD329E561154D5A.png?imageView&thumbnail=820y540&quality=100" width="350"/>
只复用了弹窗的基本功能，内容全部定制的弹窗，contentTemplate为自定义模板。
```
 NEJ.define([
       'pool/component-modal/src/modal/component'
  ],function(
       Modal
  ){
       var modal = new Modal({
           data:{
               title: 'test',
               contentTemplate: '<div>...</div>'
           }
       });
       modal.$on('close',function(event){
           // event
       });
  });
```
