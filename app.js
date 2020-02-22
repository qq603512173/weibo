var express = require('express')
var app = new express()
var router = require('./router.js')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var session = require('express-session');
var  MongoStore = require('connect-mongo')(session);
app.use(cookieParser('keyboard cat'));
app.use(session({
    secret:'keyboard cat', //加密字符串也可以写数组
    resave:true,     //强制保存session 建议设置成false
    saveUninitialized:true,  //强制保存未初始化的内容
    rolling:true, //动态刷新页面cookie存放时间
    cookie:{maxAge:1000 * 60 * 60}, //保存时效
    store:new MongoStore({   //将session存进数据库  用来解决负载均衡的问题
        url:'mongodb://localhost/weibo',
        touchAfter:24*3600 //通过这样做，设置touchAfter:24 * 3600，您在24小时内
       //只更新一次会话，不管有多少请求(除了在会话数据上更改某些内容的除外)
    })
}))
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine','ejs')
/**
 * 设置静态文件
 */
app.use(express.static("./public"))
app.use('/uploads',express.static("./uploads"))

app.use(bodyParser.json())

app.use("/",function(req,res,next){
    if (req.url == "/favicon.ico")
    {
        res.send("success")
        return;
    }
    console.log(new Date().toString() + "当前"+req.method+"请求" + req.originalUrl)  //  /admin/123
    next();
})

app.use(router())

app.use(function( req, res) {
    res.status(404).send('请求页面不存在!');
});
app.listen('3030')