/**
 * 基础接口配置文件
 *
 * @version  1.0
 * @author   caijf <caijf@corp.netease.com>
 */
NEJ.define(function () {
    /**
     * 请求配置信息，项目中可以统一配置请求信息，可配置项如下表所示
     *
     * | 名称    | 类型     | 描述  |
     * | :----:  | :----:   | :---- |
     * | url     | String   | 请求地址 |
     * | method  | String   | 请求方式，GET/POST/PUT等，默认为POST |
     * | rest    | Boolean  | 是否REST接口 |
     * | filter  | Function | 请求发送之前配置信息过滤接口 |
     * | post    | Function | 请求返回之后结果检查接口 |
     * | format  | Function | 请求返回结果格式化接口 |
     * | finaly  | Function | 回调结束后执行业务逻辑接口 |
     * | onerror | Function | 异常处理接口 |
     * | onload  | Function | 回调处理接口 |
     *
     */
    return {
        'base-setting': {
            'CODE_OK'           : 0,

            'WEBROOT'           : location.protocol+'//'+location.host,
            'ORGROOT'           : location.protocol+'//'+location.host,

            'COURSE_LIST'       : '${ORGROOT}/admin.htm#${PATH}',
            'COURSE_INDEX'      : '${WEBROOT}/courses/${TID}',
            'COURSE_LEARN'      : '${WEBROOT}/courses/${TID}/learning',
            'COURSE_LECTURE'    : '${WEBROOT}/courses/${TID}/lecture-${LID}',

            'ADMIN_CENTER'      : '${ORGROOT}/${PID}.htm',
            'ADMIN_SHOPCART'    : '${ORGROOT}/admin.htm#/shopCart',

            'QUIZ_DO'           : '${WEBROOT}/courses/${TID}/quiz-${QID}',
            'EXAM_DO'           : '${WEBROOT}/courses/${TID}/exam-${EID}/${SID}',

            'SIGNIN_MOBILE'     : '${ORGROOT}/mobile/signin/${TID}',

            'PORTRAIT_URL'      : '/res/images/common/default/userface.png'
        },
        'base-export-progress-polling': {
            method: 'GET',
            isPolling : !0,
            url: '/j/org/getProgress.json'
        },
        'base-qrcode-url-get': {
            jsonp: !0,
            url: 'http://capture.srv.icourse163.org/image/qrcode.do',
            post: function (event) {
                var res = event.res||{};
                res.code = 0;
                res.error = null;
            },
            format: function (event) {
                event.result = (event.res||{}).url;
            }
        }
    };
});
