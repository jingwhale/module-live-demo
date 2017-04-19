/**
 * ---------用户信息处理工具类文件------------------------------
 * @module userUtil
 * @version 1.0
 * @author tangtianliang(tangtianliang@corp.netease.com)
 * @path     eutil/userUtil
 * ----------------------------------------------------
 */
NEJ.define([
    './adapter/nej.js',
    './uuid/rng.js',
    './uuid/bytesToUuid.js',
    'util/cache/cookie'
], function (
    _adapter,
    rng,
    bytesToUuid,
    cookie
) {

    var _module = {},
        g = (function(){return this;})();

    /**
    * 获取登录的用户信息
    * @method _$getWebUser
    * @return {Object} webuser
    */
    _module._$getWebUser = (function(){
        var _user = g.webUser || '';

            return function() {
                return _user;
            }
    })();

    /**
     * 判断是否是用户自己
     * @method _$isUserOwner
     * @param  {String} _userId 传入的用户id
     * @return {Boolean} 是否是用户自己
     */
    _module._$isUserOwner = function(_userId,_passport){
        return (!!_userId && _userId == _module._$getWebUser().id) || (!!_passport && _passport == _module._$getWebUser().loginId);
    };

    /**
     * 生成UUID
     * Generate and return a RFC4122 v4 UUID.
     * 参考于https://github.com/kelektiv/node-uuid
     *
     * @param {Object}      options Optional uuid state to apply. Properties may include:
     * @param {Number}      options.random (Number[16]) Array of 16 numbers (0-255) to use in place of randomly generated values
     * @param {Function}    options.rng  Random # generator to use. Set to one of the built-in generators - uuid.mathRNG (all platforms), uuid.nodeRNG (node.js only), uuid.whatwgRNG (WebKit only) - or a custom function that returns an array[16] of byte values.
     * @param {Array | Buffer} buffer Array or buffer where UUID bytes are to be written.
     * @param {Number}         offset Starting index in buffer at which to begin writing.
     * @method _$uuid
     */
    _module._$uuid = function (options, buf, offset) {
        var i = buf && offset || 0;

        if (typeof(options) == 'string') {
            buf = options == 'binary' ? new Array(16) : null;
            options = null;
        }
        options = options || {};

        var rnds = options.random || (options.rng || rng)();

        // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
        rnds[6] = (rnds[6] & 0x0f) | 0x40;
        rnds[8] = (rnds[8] & 0x3f) | 0x80;

        // Copy bytes to buffer, if provided
        if (buf) {
            for (var ii = 0; ii < 16; ++ii) {
                buf[i + ii] = rnds[ii];
            }
        }

        return buf || bytesToUuid(rnds);
    };

    /**
     * 从COOKIE中获取UUID
     *
     * 如果cookie中没有uuid，则会在当前网站域下面新生成一个uuid， 有效期可以通过options.expireTime传入
     *
     * @param {Object} options
     * @param {Number} options.expireTime
     * @method _$getUuidFromCookie
     */
    _module._$getUuidFromCookie = function (options) {
        var uuid = cookie._$cookie('uuid');
        options = options || {};

        if(!uuid){
            uuid = _module._$uuid();

            cookie._$cookie("uuid",{
                path:'/',
                domain:'.' + location.hostname,
                value: uuid,
                expires: options.expireTime || 30
            });
        }

        return uuid;
    };


    return _module;
});
