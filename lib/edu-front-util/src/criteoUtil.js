/**
 * ---------------------criteo 相关的util-------------------------
 * 广告推送util
 * 
 * @module criteoUtil
 * @version  1.0
 * @author   hzyuwei(hzyuwei@corp.netease.com)
 * @path     eutil/criteoUtil
 * --------------------------------------------------------
 */

NEJ.define(['./adapter/nej.js','./userUtil.js'], function (_adp,userUtil) {
	var _module = {},
        g = (function(){return this;})();

    var user = userUtil._$getWebUser() || {},
        userEmail = user.email || '';
    var _account = {event: "setAccount", account: 32810 };
    var _email = {event: "setEmail", email: [userEmail]};

    /**
	 * criteo跟踪事件
	 *
	 * @method _$trackCriteoEvent
	 * @param {Boolean} _isMobile
	 * @param {String} _e
	 * @return {void}
	 */
	_module._$trackCriteoEvent =function(_isMobile,_e){
		var _siteType = {event:"setSiteType", type:_isMobile?"m":"d"};
		if(!!g.criteo_q){
			g.criteo_q.push( _account, _email, _siteType, _e);
		}
	};

	return _module;
});
