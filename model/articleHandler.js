/**
 * @author ozl
 * @description 操作article表数据相关的类，不操作数据库
 */
var user = require('./user')
var fileHandler = require('./fileHandler')
var timeHandler = require('./timeHandler')

/**
 * 改变多媒体文件数据路径，用途界面显示uploads/big下的文件
 * @param {*} multiMedias 多媒体文件数组 ["/uploads/small/2020011001094470210515.png"]
 * @param {*} newDir      新的目录 /uploads/big
 * @return ["/uploads/big/2020011001094470210515.png"]
 **/
function changeMultiMediaDir(multiMedias, newDir){
    var newMultiMedias = []
    for (var i = 0; i < multiMedias.length; i++)
    {
        newMultiMedias.push(fileHandler.changeFileDir(multiMedias[i], newDir))
    }
    return newMultiMedias
}

/**
 * 集中处理返回的article文章数据：
 * 1.将数据内时间改为formatPar对应的时间
 * 2.添加文章作者favicon头像
 * 3.改变多媒体文件multiMedial的路径
 * 4.添加用户昵称
 * @param {any} formatPar 时间格式转换类型
 * @param {any} articles  article数据
 * @returns 
 */
async function mainUpdateArticleData(articles, formatPar){
    var newArticles = []
    for (var i=0; i < articles.length; i++ )
    {
        var item = articles[i]
        var newItem = item.toJSON()
        // 时间格式修改
        newItem.releaseTime = timeHandler.getTimeByDate(formatPar, item.releaseTime)
        // 添加作者头像
        var cUser = await ifexistUserName(newItem.author)
        if (cUser.favicon){
            newItem.favicon = cUser.favicon
            newItem.author = cUser.name
        }
        //改变多媒体文件路径
        newItem.multiMedia = changeMultiMediaDir(item.multiMedia, (item.multiMedia[0].indexOf('.png') > -1 ) ? '/uploads/big' : '/uploads/video')

        newArticles.push(newItem)
    }
    return newArticles
}

async function ifexistUserName(username){
    return new Promise((resolve,reject) => {
        user.ifexistUserName(username,(error, cUser) => {
            resolve(cUser[0])
        })
    })
}

// console.log(changeMultiMediaDir([ "/uploads/small/2020011001094470210515.png", "/uploads/small/202001100109448351631.png", "/uploads/small/2020011001094497710779.png", "/uploads/small/202001100109448413160.png", "/uploads/small/202001100109449799722.png", "/uploads/small/202001100109449799145.png", "/uploads/small/202001100109464439145.png" ],"/uploads/big"))

exports.changeMultiMediaDir = changeMultiMediaDir;

exports.mainUpdateArticleData = mainUpdateArticleData