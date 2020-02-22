/** 
 * @author ouzilin
 * @description article 类
*/
var articleHandler = require('./articleHandler')
var mongoose = require('./db')
var articleSchema = mongoose.Schema({
     //文章标题
     title:{type:String},
     //文章内容
     content:{type:String},
     //图片或视频地址(多个)
     multiMedia: [String],
     //评论
     comment: [{
         //评论人
         commentUser:{type:String},
         //评论内容
         commentText:{type:String},
         //评论时间
         commentTime:{type:Date,default: Date.now()}
     }],
     // 作者
     author:{type:String},
     //发布时间
     releaseTime:{type:Date,default: Date.now()},
     //修改时间
     updateTime:{type:Date,default: Date.now()}
  },{
    versionKey: false,
    timestamps: { createdAt: 'releaseTime', updatedAt: 'updateTime' }
  });

  articleSchema.statics.findAll = function(callback){
      this.model('article').find({},function(error, articles){
        if (error){
            callback(error)
            return
        }
        articleHandler.mainUpdateArticleData(articles, 'MM月dd日 hh:mm').then((data) => {
            callback(null, data)
        })
      }).sort('field -releaseTime');
  }
  articleSchema.statics.insert = function(data, callback){
    data.releaseTime = new Date()
    this.model('article').create(data,function(error, article){
        if (error){
            callback(error)
            return
        }
          callback(null,article)

      })
    }

/*
var articleModel = mongoose.model('article', articleSchema);
articleModel.insert({
    title: "欧自林的文章",
    content:"测试的认账内容",
    multiMedia:['/uploads/test.img'],
    comment:[
        {commentUser:'liqi', commentText:'这是个好文章'},
        {commentUser:'liqi', commentText:'非常不错'},
    ],
    author:'liqi'
})
*/

module.exports = mongoose.model('article', articleSchema);