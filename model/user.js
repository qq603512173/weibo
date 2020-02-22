/** 
 * @author ouzilin
 * @description user 类
*/
var mongoose = require('./db')
var ObjectId = require('objectid')
var md5 = require('./md5')

var userSchema = mongoose.Schema({
     //登录名
     username:{type:String, index:{unique:true}},
     //登录密码
     password:{type:String},
     //真实姓名
     name:{type:String},
     //头像
     favicon:{type: String},
     //QQ
     qq:{type:String},
     //email
     email:{type:String},
     //电话
     tel:{type:String},
     //年龄
     age:{type:Number},
     //注册时间
     regTime:{type:Date,default: Date.now()},
     //修改时间
     updateTime:{type:Date,default: Date.now()}
  },{
    versionKey: false,
    timestamps: { createdAt: 'regTime', updatedAt: 'updateTime' }
  });
/**
 * @description 插入用户表
 */
  userSchema.statics.insert = function(data, callback){
      data.password = md5(data.password)
      this.model('user').create(data,function(error, user){
        if (error){
          callback(error)
        }else{
          console.log(user)
          callback(0, user._id)
        }
      })
  }

  /**
   * @description 判断是否有此用户
   */
  userSchema.statics.ifexistUserName = function(name, callback){
     this.model('user').find({username:name}, function(error,user){
       if (error){
         callback(error)
       }else{
          var msg = (user.length == 0 ) ? "" : "已存在用户!"
          callback(msg,user)
       }
     })
  }

  /**
   * @description 根绝id获取设置用户头像
  */
 userSchema.statics.setUserImgById = function(ID, imgDir, callback){
   console.log("根绝id获取设置用户头像" + ID + imgDir)
    this.model('user').updateOne({_id: ObjectId(ID)}, { $set : {favicon : imgDir}}, {}, function(error, user){
       if (error){
         callback(error)
         return
       }
       callback(null)      
    })
 }

 /**
  * 判断用户的用户名和密码
  */
 userSchema.statics.login = function(mUsername, mPassword, callback){
    console.log(mUsername + ":" + mPassword)
    mPassword = md5(mPassword)
    console.log(mPassword)
    this.model('user').find({username:mUsername}, function(error, user){
      if (error){
        callback(error)
        return
      }
      console.log(user)
      if (user.length == 0 ){
        callback('不存在此用户')
        return
      }
        var errorMessage=null
        errorMessage = ((user[0].password == mPassword) ? null : "密码错误")
        callback(errorMessage, user[0])

    })
 }

module.exports=mongoose.model('user', userSchema);