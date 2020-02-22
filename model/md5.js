/** 
 * @author ouzilin
 * @description md5加密文件
*/
var crypto = require('crypto');
/**
 * md5 加密密码
 * 
 * @param {any} content 要加密的值
 * @returns 
 */
function md5Encryption(content){
    var result = crypto.createHash('md5').update(content).digest("hex")
    var newResult = result.substring(5) + result.substring(0,5) + "***"
    return crypto.createHash('md5').update(newResult).digest("hex")
}
module.exports = md5Encryption