/**
 * ----------------------------------------------------------
 * 上传进度条组件
 * @version  1.0
 * @author hzchenqinhui(hzchenqinhui@corp.netease.com)
 * 
 * @module pool/component-upload/src/progress/upload_percent_modal/component
 * ----------------------------------------------------------
 */
define([
    'pool/component-base/src/util',
    'pool/component-modal/src/modal/ui'
], function(
    util,
    _modal
){

     var UploadPercentModal = _modal.$extends({
         name : 'ux-upload-percent-modal',
         config: function(){
            util.extend(this.data, {
                /**
                 * 当前完成进度                 *
                 */
                finished: 0,
                /**
                 * 总进度
                 */
                total: 100,
                /**
                 * 标题
                 */
                title: '',
                /**
                 * 描述
                 */
                desc: '',
                /**
                 * 自动增加时的最大buff
                 */
                maxBuff: 22,
                /**
                 * 自动增加时的最大延时
                 */
                maxTimer: 2
            });
            this.supr();
         },

         init: function(){
             this.supr();
             this.$watch('finished', function(finished){
                 if(this.data.finished >=this.data.total){
                     setTimeout(function(){ // for show progress
                         this.$emit('end');
                     }._$bind(this), 700);
                 }
             });
         },

         autoStart: function(){
             var _that = this;
             this.$on('end', function(){
                 clearTimeout(_that.timer);
                 setTimeout(function(){
                     _that.destroy();
                 }, 700);
             });

             function autoGo(addTimer){
                 addTimer = addTimer || 0;
                 var time = Math.floor(Math.random()*5) + addTimer;
                 if(_that.data.maxTimer){
                     time = Math.min(time, _that.data.maxTimer);
                 }
                 _that.timer = setTimeout(function(){
                     var add = Math.floor(Math.random()*((_that.data.total-_that.data.finished)/_that.data.total*_that.data.maxBuff));

                     _that.data.finished += add;
                     _that.$update();
                     if(_that.data.finished >= _that.data.total){
                         return;
                     }
                     autoGo();
                 }, time*1000);
             }

             autoGo(1);
         },

         done: function(){
             this.data.finished = this.data.total;
             clearTimeout(this.timer);
             this.$update();
         }

     }).filter({
         toPercent: function(finished, total){
             if(finished > total){
                 finished = total;
             }
             return  ((finished/total)*100).toFixed(this.data.decimalNum || 0) + "%";
         }
     });

     return UploadPercentModal;
});
