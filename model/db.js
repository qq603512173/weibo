/**
 * @author ouzilin
 * @description 数据库连接
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/weibo');
module.exports = mongoose