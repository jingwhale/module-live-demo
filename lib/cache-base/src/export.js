/**
 * 系统导出相关配置信息
 *
 * @version  1.0
 * @author   caijf <caijf@corp.netease.com>
 * @module   pool/cache-base/src/export
 */
NEJ.define(function (
    exports
) {
    /**
     * 导出期次签到汇总名单
     *
     * @member {Number} module:pool/cache-base/src/export.TYPE_USERS_TERM
     */
    exports.TYPE_USERS_TERM = 1001;

    /**
     * 导出签到名单
     *
     * @member {Number} module:pool/cache-base/src/export.TYPE_USERS_SIGNIN
     */
    exports.TYPE_USERS_SIGNIN = 1002;

    /**
     * 导出报名名单
     *
     * @member {Number} module:pool/cache-base/src/export.TYPE_USERS_SIGNUP
     */
    exports.TYPE_USERS_SIGNUP = 2002;


    /**
     * 导出指派名单
     *
     * @member {Number} module:pool/cache-base/src/export.TYPE_USERS_ASSIGN
     */
    exports.TYPE_USERS_ASSIGN = 2001;

    /**
     * 导出线上期次学习进度
     *
     * @member {Number} module:pool/cache-base/src/export.TYPE_STAT_ONLINE_TERM
     */
    exports.TYPE_STAT_ONLINE_TERM = 3001;

    /**
     * 导出线上汇总学习进度
     *
     * @member {Number} module:pool/cache-base/src/export.TYPE_STAT_ONLINE_SUMRY
     */
    exports.TYPE_STAT_ONLINE_SUMRY = 3002;

    /**
     * 导出线下期次学习进度
     *
     * @member {Number} module:pool/cache-base/src/export.TYPE_STAT_OFFLINE_TERM
     */
    exports.TYPE_STAT_OFFLINE_TERM = 3003;

    /**
     * 导出线下汇总学习进度
     *
     * @member {Number} module:pool/cache-base/src/export.TYPE_STAT_OFFLINE_SUMRY
     */
    exports.TYPE_STAT_OFFLINE_SUMRY = 3004;

    /**
     * 导出某个期次的学生成绩统计信息
     *
     * @member {Number} module:pool/cache-base/src/export.TYPE_STAT_GRADE
     */
    exports.TYPE_STAT_GRADE = 4001;

    /**
     * 导出某个期次的习题考试批改的汇总统计
     *
     * @member {Number} module:pool/cache-base/src/export.TYPE_QUIZ_SUMRY
     */
    exports.TYPE_QUIZ_SUMRY   = 5001;

    /**
     * 导出某个期次的习题考试考试的统计信息
     *
     * @member {Number} module:pool/cache-base/src/export.TYPE_QUIZ_EXAM
     */
    exports.TYPE_QUIZ_EXAM   = 5004;

    /**
     * 导出某个期次的习题考试客观题的批改统计
     *
     * @member {Number} module:pool/cache-base/src/export.TYPE_QUIZ_OBJECTIVE
     */
    exports.TYPE_QUIZ_OBJECTIVE   = 5002;

    /**
     * 导出某个期次的习题考试主观题的批改统计
     *
     * @member {Number} module:pool/cache-base/src/export.TYPE_QUIZ_SUBJECTIVE
     */
    exports.TYPE_QUIZ_SUBJECTIVE   = 5003;

    /**
     * 导出企业员工名单
     *
     * @member {Number} module:pool/cache-base/src/export.TYPE_USERS_STAFF
     */
    exports.TYPE_USERS_STAFF  = 6001;

    /**
     * 导出企业下的选购课程
     *
     * @member {Number} module:pool/cache-base/src/export.TYPE_COURSE_BUY
     */
    exports.TYPE_COURSE_BUY = 7002;

    /**
     * 导出企业下的自建课程
     *
     * @member {Number} module:pool/cache-base/src/export.TYPE_COURSE_SELF
     */
    exports.TYPE_COURSE_SELF = 7001;

    /**
     * 导出统计部门列表
     * @type {number} module:pool/cache-base/src/export.TYPE_STATISTICS_DEPARTMENT
     */
    exports.TYPE_STATISTICS_DEPARTMENT = 8001;

    /**
     * 导出统计部门列表
     * @type {number} module:pool/cache-base/src/export.TYPE_STATISTICS_POSITION
     */
    exports.TYPE_STATISTICS_POSITION = 8002;

    /**
     * 导出统计部门列表
     * @type {number} module:pool/cache-base/src/export.TYPE_STATISTICS_GROUP
     */
    exports.TYPE_STATISTICS_GROUP = 8003;

    /**
     * 导出统计个人档案列表
     * @type {number} module:pool/cache-base/src/export.TYPE_STATISTICS_PERSONAL_ARCHIVE
     */
    exports.TYPE_STATISTICS_PERSONAL_ARCHIVE = 8004;

    /**
     * 导出统计个人学习情况明细列表
     * @type {number} module:pool/cache-base/src/export.TYPE_STATISTICS_PERSONAL_SITUATION_DETAIL
     */
    exports.TYPE_STATISTICS_PERSONAL_SITUATION_DETAIL = 8006;

    /**
     * 导出统计个人学习情况总览列表
     * @type {number} module:pool/cache-base/src/export.TYPE_STATISTICS_PERSONAL_SITUATION_GENERAL
     */
    exports.TYPE_STATISTICS_PERSONAL_SITUATION_GENERAL = 8005;
});
