# 通用组件基类

## 当前状态

[![build status](https://g.hz.netease.com/edu-frontend/component-base/badges/master/build.svg)](https://g.hz.netease.com/edu-frontend/component-base/commits/master)

## 使用说明

### 不带样式组合

```javascript
NEJ.define([
   'pool/component-base/src/base'
],function(
   Base
){
   var Component = Base.extends({
       config:function(){
           this.supr();
           // TODO
       },
       init:function(){
           this.supr();
           // TODO
       },
       destroy:function(){
           this.supr();
           // TODO
       }
   });
   return Component;
});
```

### 带样式组合

```javascript
NEJ.define([
   './xxx.js',
   'text!./xxx.html',
   'css!./xxx.css'
],function(
   Component,
   html,
   css
){
   return Component.extends({
       name     : 'ux-xxx',
       css      : css,
       template : html
   });
});
```
