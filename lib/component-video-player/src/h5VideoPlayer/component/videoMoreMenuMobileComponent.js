/**
 * 移动端功能菜单组件
 * @author hzliaobolin@corp.netease.com.
 */
NEJ.define([
    'text!./videoMoreMenuMobileComponent.html',
    '../base/base.js',
    '../base/component.js',
    'lib/base/element',
    'lib/base/event',
    'lib/base/util',
    '../notification/notificationDefine.js',
    '../model/constant.js',
    '../util/util.js',
    'pool/edu-front-util/src/mobileUtil'
], function (
    _tpl,
    _base,
    _component,
    _e,
    _v,
    _u,
    _notificationDefine,
    _constant,
    _util,
    _mobileUtil,
    p, o, f, r) {

    var videoMoreMenuMobileComponent = _base.C(),
        _pro = videoMoreMenuMobileComponent.extend(_component);

    videoMoreMenuMobileComponent.NAME = 'videoMoreMenuMobileComponent';

    /**
     * init function
     */
    _pro._init = function (_config) {

        this.__super(_config);
        this._config = _config;
        this._cVideoInfo = {
            quality: {},
            line: {},
            rate: {}
        },
        this._lineMap = {};

        this._rootNode = _config.rootNode;
        this._bodyNode = _e._$getByClassName(this._rootNode, 'j-moreMenu')[0];
        this._partSpeed = _e._$getByClassName(this._bodyNode, 'j-partSpeed')[0];
        this._partLine = _e._$getByClassName(this._bodyNode, 'j-partLine')[0];
        this._partQuality = _e._$getByClassName(this._bodyNode, 'j-partQuality')[0];

        //不支持速率改变
        if(!_util.supportRateChange()){

            _e._$remove(this._partSpeed);
        }
        
        this._initEvent();
        return this;
    }

    /**
     * 获取组件结构，子类实现
     */
    _pro._getTpl = function(){
        return _tpl; 
    }

    /**
     * 列出监听的消息
     */
    _pro.listNotificationInterests = function () {
        return [
            _notificationDefine.VIEW_MORE_MENU,
            _notificationDefine.MOVIEDATA_READY,
            _notificationDefine.MAINVIDEO_RATE_CHANGE,
            _notificationDefine.MAINVIDEO_QUALITY_CHANGE,
            _notificationDefine.MOVIEDATA_CURRENT_CDN_CHANGE

        ];
    }

    /**
     * 处理消息的方法
     */
    _pro.handleNotification = function (_notificationIns) {

        var _data = _notificationIns.getBody()

        this.__super(_notificationIns);
        switch (_notificationIns.getName()) {

            // 更多菜单的显示/隐藏 
            case _notificationDefine.VIEW_MORE_MENU:
                
                this._toggleMoreMenu(_data);
                break;

            // init菜单 
            case _notificationDefine.MOVIEDATA_READY:
                
                this._initMoreMenu(_data);
                break;

            // 倍速切换 
            case _notificationDefine.MAINVIDEO_RATE_CHANGE:
                
                this._changeRate(_data);
                break;

            // 线路切换 
            case _notificationDefine.MOVIEDATA_CURRENT_CDN_CHANGE:
                
                this._changeLine(_data);
                break;

            // 切换清晰度 
            case _notificationDefine.MAINVIDEO_QUALITY_CHANGE:
                
                this._changeQuality(_data);
                break;
        }
    }

    /**
     * 更多菜单的显示/隐藏 
     */
    _pro._toggleMoreMenu = function(_data){

        this.sendNotification(_notificationDefine.VIEW_MORE_MENU_CHANGE);
        
        if(_e._$hasClassName(this._bodyNode, 'f-dn')){

            _e._$delClassName(this._bodyNode, 'f-dn');
            return;
        }

        _e._$addClassName(this._bodyNode, 'f-dn');

    }

    /**
     * init更多菜单
     */
    _pro._initMoreMenu = function(_data){

        var qualityLen = _data.movieItemList.length,
            cdnLen = _data.cdnSwitchData.length,
            tempStr = '';

        //清晰度
        if(qualityLen > 0){

            for (var i = 0; i < qualityLen; i++) {

                tempStr += '<li class="' + (i == 0 ? "active" : "") + '" data-type="quality" data-quality="' + _data.movieItemList[i].quality + '" data-qualityName="' + _data.movieItemList[i].qualityName + '">' + _data.movieItemList[i].qualityName + '</li>';
            };

            this._partQuality.innerHTML = tempStr;
            tempStr = '';
        }

        //线路
        if(cdnLen > 0){

            for (var j = 0; j < cdnLen; j++) {
                
                this._lineMap[_data.cdnSwitchData[j].isp] = _data.cdnSwitchData[j].ispNmae;
                tempStr += '<li class="' + (j == 0 ? "active" : "") + '" data-type="line" data-line="' + _data.cdnSwitchData[j].isp + '" data-lineName="' + _data.cdnSwitchData[j].ispNmae +  '">' + _data.cdnSwitchData[j].ispNmae + '</li>';
            };

            this._partLine.innerHTML = tempStr;
            tempStr = '';
        }

        //保存当前信息，待切换时用
        this._cVideoInfo.quality.name = _data.currentMovieItem.qualityName;
        this._cVideoInfo.quality.quailty = _data.currentMovieItem.quality;
        this._cVideoInfo.line.isp = _data.cdnSwitch;

        if(this._cVideoInfo.line.isp == ""){

            this._cVideoInfo.line.ispNmae = "默认";
        }else{

            this._cVideoInfo.line.ispNmae = this._lineMap[this._cVideoInfo.line.isp];
        }    
    }

    /**
     * 切换倍速
     */
    _pro._changeRate = function(_rate){

        var _items = _e._$getChildren(this._partSpeed),
            _cnode = null;

        _u._$forEach(_items, function(_this, _index){

            if(_e._$attr(_this, "data-rate") == _rate){

                _cnode = _this;
            }

            _e._$delClassName(_this, 'active');
        });

        _e._$addClassName(_cnode, 'active');
    }

    /**
     * 切换线路
     */
    _pro._changeLine = function(_data){

        var _items = _e._$getChildren(this._partLine),
            _cnode = null;

        _u._$forEach(_items, function(_this, _index){

            if(_e._$attr(_this, "data-line") == _data.cdnSwitch.newData.isp){

                _cnode = _this;
            }

            _e._$delClassName(_this, 'active');
        });

        _e._$addClassName(_cnode, 'active');
    }

    /**
     * 切换清晰度
     */
    _pro._changeQuality = function(_data){

        var _items = _e._$getChildren(this._partQuality),
            _cnode = null;

        _u._$forEach(_items, function(_this, _index){

            if(_e._$attr(_this, "data-quality") == _data.quality){

                _cnode = _this;
            }

            _e._$delClassName(_this, 'active');
        });

        _e._$addClassName(_cnode, 'active');
    }

    _pro._initEvent = function(){

        var self = this,
            cnode = null;

        //添加事件实例
        var _bodyNodeEventIns = new Hammer(self._bodyNode)

        _bodyNodeEventIns.on('tap', function(_event){

            _cnode = _v._$getElement(_event, function(_element){

                return _element.tagName.toLowerCase();
            });

            var _type = _e._$attr(_cnode, 'data-type'),
                _cData = {},
                _oData = {};

            //倍速
            if(_type == 'rate'){

                self.sendNotification(_notificationDefine.VIEW_RATE, _e._$attr(_cnode, 'data-rate'));
            }

            //分辨率
            if(_type == 'quality'){

                _cData = {
                    name: _e._$attr(_cnode, 'data-qualityName'),
                    quality: _e._$attr(_cnode, 'data-quality')
                }
                _oData = {
                    name: self._cVideoInfo.quality.name,
                    quality: self._cVideoInfo.quality.quality
                }
                self.sendNotification(_notificationDefine.VIEW_QUALITY, {oldData:_oData, newData:_cData});
            }

            //线路
            if(_type == 'line'){

                _cData = {
                    isp: _e._$attr(_cnode, 'data-line'),
                    ispNmae: _e._$attr(_cnode, 'data-lineName')
                }
                _oData = {
                    isp: self._cVideoInfo.line.isp,
                    ispNmae: self._cVideoInfo.line.ispNmae
                }
                self.sendNotification(_notificationDefine.VIEW_CDN, {oldData:_oData, newData:_cData});
            }

            // 隐藏菜单
            _e._$addClassName(self._bodyNode, 'f-dn');
            self.sendNotification(_notificationDefine.VIEW_MORE_MENU_CHANGE);

        });
    }

    // 返回结果可注入给其他文件
    return videoMoreMenuMobileComponent;
});
