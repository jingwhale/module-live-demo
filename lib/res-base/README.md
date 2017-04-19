# 静态资源

## 注意
由于cms专题使用了study上固定版本的字体文件，为了保证study更新字体后，不需要重新发布所有cms,故字体需要兼容处理，
即：保证每个类名的unicode是固定的。

解决：当合并master的时候，冲突发生则运行npm run icon, 如果运行报错，说明unicode有重复，你需要将你迭代所添加的uExxx-xxx.svg,
再次命名为不带unicode前缀的svg文件，再次运行即可。你迭代中所新加的svg将使用的递增后的unicode。
（如果本迭代有cms内容,需要再次构建发布，使其使用解决冲突后的unicode）

## 简介
基础组件库的静态资源库，包含基本reset，mixins样式库，以及字体库

## icon字体规范说明文档

## [组件池icon工程地址](https://g.hz.netease.com/edu-frontend/res-base/tree/master)

## 字体生成
1. git pull
2. 查看demo.html是否已经有无需要字体
3. 命名svg图片
4. 添加svg图片到svg目录
5. npm run icon
6. 自动生成icon字体/css/demo
7. git push

## 注意
 - `代码中不要直接使用字体的unicode，这个值会根据图片命名字典序动态变化`
 - `不要以业务场景命名svg，请以图片本身含义命名xxx，使用时即为ux-xxx`

## 优势：
1. 避免分支冲突，重新上传
2. 避免依赖icomoon网站

### 工程目录
```
├── backup       // 老icomoon网站数据备份，现已经无用
├── css
│   └── icons.css
├── demo
│   ├── demo-files
│   └── demo.html   // 现有icon展示
├── gulpfile.js
├── res
│   └── res-base   // icon字体，发布到线上
├── scss
│   └── icons.scss
├── svg            // 更新字体icon，添加svg到此
│   ├── QQ.svg
│    ......
│   └── wrong-slim.svg
└── template
       └── _iconTemplate.css  // 字体css模板

```
