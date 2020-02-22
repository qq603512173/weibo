/** 
 * @author ouzilin
 * @description 封装对文件的操作
*/
var fs = require('fs')
var path = require('path')
var gm = require('gm')
var timeHandler = require('./timeHandler');

/**
 * 将上传的视频流文件用pipe合并都一个指定的文件中 
 * @param {*} file    上传的流文件
 * @param {*} newDir  新文件目录  
 * @param {*} extName  文件扩展名
 * @param {*} newFile  要写入的文件名
 * @param {*} callbcak 
 */
function reVideoName(file, newDir, extName, newFile, callbcak){
    var filename = file.filename;
    var extName = path.parse(extName).ext
    var oldFile = path.resolve(__dirname,'../uploads/' + filename);
    if (newFile === "")
    {
        var newFileName = timeHandler.getCurrentTime('yyyyMMddhhmmssSSS') + (Math.floor(Math.random()*9999)+1000) + extName
        newFile = "/uploads/" + newDir +"/" + newFileName;
    }
    var newFileWStream = fs.createWriteStream(path.resolve(__dirname,'..' + newFile ),{flags:'a'});
    var oldFileRstream = fs.createReadStream(oldFile);
    oldFileRstream.pipe(newFileWStream, {end: false});
    oldFileRstream.on("end", function() {
        fs.unlink(oldFile,function(error){
            if (error){
                console.log(error)
                callbcak(error) 
                return
            }
            callbcak(null, newFile) 
        })
    });
}
/**
 * desc: 解析上传的图片文件并重命名
 * @param {any} file 
 * @param {any} callbcak 
 */
function reImagename(file,callbcak){
    var destination = file.destination;
    var filename = file.filename;
    var oldFile = path.resolve(__dirname,'../uploads/' + filename);
    var newFileName = timeHandler.getCurrentTime('yyyyMMddhhmmssSSS') + (Math.floor(Math.random()*9999)+1000) + ".png"
    var newFile = path.resolve(__dirname,'../uploads/' + newFileName);
    fs.exists(oldFile,function(exists){
        if (exists){
            fs.rename(oldFile, newFile, function(err){
                if (err){
                    callbcak(err)
                    return;
                }   
                callbcak(null,newFile)
            })
        }else{
           callbcak("文件上传失败!","-1")
        }
    })
}

/**
 * 判断是否存在文件
 * @param {any} dir 
 * @param {any} fileName 
 * @param {any} callbcak 
 */
function ifExistsFile(dir, fileName, callbcak)
{
    fs.exists(path.resolve(__dirname,"../"+dir+"/"+ fileName + ".ejs"), function(exists){
        if (exists){
            callbcak(0)
        }else{
            callbcak("不存在文件!")
        }
    })
}
/**
 * 
 * 改变文件的扩展名
 * changeExtName('/test/index.js','ext')
 * { root: '/',
 dir: '/test',
  base: 'index.js',
  ext: '.js',
  name: 'index' }
 * @param {any} oldDir  要修改的文件路径
 * @param {any} extName 要修改成的扩展名
 * @returns 
 */
function changeExtName(oldDir, extName){
    var pathObj = path.parse(oldDir)
    return  pathObj.dir + "/" + pathObj.name + "." + extName
}
/**
 * 改变文件路径上的dir,成新的地址
 * @param {*} oldDir 要修改的文件路径 
 * @param {*} newDir 替换成的文件路径（不含文件名）
 */
function changeFileDir(oldDir, newDir){
    var pathObj = path.parse(oldDir)
    return newDir + "/" + pathObj.base
}
exports.reImagename = reImagename
exports.ifExistsFile = ifExistsFile
exports.changeExtName = changeExtName
exports.changeFileDir = changeFileDir
exports.reVideoName = reVideoName