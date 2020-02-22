var user = require('./user')
var format = require('date-format');
/**
 * 根据传入的格式返回当前时间 
 * @param {any} formatPar  格式 'yyyyMMddhhmmssSSS' 'yyyy-MM-dd' 'hh:mm:ss'
 * @returns 
 */
function getCurrentTime(formatPar)
{
    return format.asString(formatPar, new Date())
}
/**
 * 转换格式
 * @param {any} formatPar 
 * @param {any} date 
 * @returns 
 */
function getTimeByDate(formatPar,date)
{
    return format.asString(formatPar, date)
}

exports.getCurrentTime = getCurrentTime

exports.getTimeByDate = getTimeByDate