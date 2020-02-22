var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var fileHandler = require('../model/fileHandler')
var imageHandler = require('../model/imageHandler')
var user = require('../model/user')
var path = require('path')
var article = require('../model/article')
var fs = require('fs')

var index = function(req, res, next){
    article.findAll(function(error,data){
        if (error)
        {
            res.render("index",{
                user: req.session.user
            })
            return
        }
        res.render("index",{
            user: req.session.user,
            articles: data
        })
    })
}
/**
 * 获取界面
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
var getView = function(req, res, next){
    fileHandler.ifExistsFile("views",req.params.view,function(err){
        if (err){
            next()
        }else{
            res.render(req.params.view)
        }
    })
}
/**
 * 下载用户上传的头像
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
var uploadImg = function (req, res, next) {
    fileHandler.reImagename(req.file,function(error, fileUrl){
           if (error){
              res.json({message:error,status:-1})
           }else{
            imageHandler.resizeCurrentImg(fileUrl,fileUrl,60,function(error, newFile){
                if (error){
                    conso.log(error)
                    res.json({message:"压缩图片失败!",status:-1})
                }else{
                    user.setUserImgById(req.body.id, '/uploads/' + path.basename(newFile), function(error){
                        if (error)
                        {
                            console.log(error)
                            res.json({message:"上传头像失败!",status:-1})
                        }
                        else
                        {
                            res.json({message:"success",status:0})
                        }
                    })
                }
            })
           }
    })
}
/**
 * 注册用户
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
var signup = function(req, res, next){
    user.insert(req.body,function(error,id){
        if (error){
            res.json({message:error.errmsg,status:-1})
        }else{
            res.json({message:id,status:0})
        }
    })
}
/**
 * 根据用户名判断是否存在
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
var ifexist = function (req, res, next){
    user.ifexistUserName(req.body.username, function(error){
        if(error){
            res.json({message:error,status:-1})
        }else{
            res.json({message:"success",status:0})
        }
    })
}
/**
 * 登录用户
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
var login = function(req, res, next){
    user.login(req.body.username, req.body.password, function(error, user){
        if (error){
            res.json({message: error, status: -1})
            return
        }
        req.session.user = user
        res.json({message:'success', status:0})

    })
}
/**
 * 插入文章
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
var articleInsert = function(req, res,next){
    req.body.author = req.session.user.username
    article.insert(req.body,function(error,article){
        if (error)
        {
            req.json({message:error, status:-1})
            return
        }
        res.json({message:'success', status:0})
    })
}
/**
 * 微博图片上传
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
var uploadPhoto = function(req, res, next){
    fileHandler.reImagename(req.file,function(error, fileUrl){
        if (error){
           res.json({message:error,status:-1})
        }else{
         var fileUrlInfo = path.parse(fileUrl)
         imageHandler.resizeRelCurrentImg(fileUrl,path.resolve(fileUrlInfo.dir + '/small/' +fileUrlInfo.base),80,function(error, newFile){
             if (error){
                 console.log(error)
                 res.json({message:"压缩图片失败!",status:-1})
             }else{
                res.json({message:'/uploads/small/' + path.basename(newFile),status:0})
             }
         })
         imageHandler.resizeRelCurrentImg(fileUrl,path.resolve(fileUrlInfo.dir + '/big/' +fileUrlInfo.base),150,function(error, newFile){})
         imageHandler.resizeCurrentImg(fileUrl,path.resolve(fileUrlInfo.dir + '/real/' +fileUrlInfo.base),690,function(error, newFile){})
        }
 })
}
/**
 * 视频上传
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
var uploadVideo = function(req, res, next){
    fileHandler.reVideoName(req.file,'video',req.body.name,req.body.newFile, function(error, newFile){
        if (error){
            console.log(error)
            res.json({message:error,status:-1})   
            return
        }
        res.json({message:'success',status:0, newFile : newFile})
    })
}
module.exports = {
    'GET /': index,
    'POST /article/uploadPhoto': [upload.single('image'), uploadPhoto],
    'POST /article/uploadVideo': [upload.single('video'),  uploadVideo],
    'POST /article/insert': articleInsert,
    'POST /user/signup': signup,
    'POST /user/ifexist': ifexist,
    'POST /user/login': login,
    'POST /uploadImg': [upload.single('image'),  uploadImg],
    'GET /:view': getView,
};