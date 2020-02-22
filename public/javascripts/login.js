$(function() {

    /*
    $(window).scroll(function () {
        var a = document.getElementById("videoContainer").offsetTop;
        if (a >= $(window).scrollTop() && a < ($(window).scrollTop()+$(window).height())) {
            //alert("div在可视范围");
        }
    });    
    */


   $('#login').on('click', function(){
     $.ajax({
       url: '/user/login',
       type: 'post',
       data:{username:$('#username').val(), password:$('#password').val()},
       success: function(result){
         if (!result.status){
            location.reload()
         }else{
           alert(result.message)
         }
       }
     })
   })

   $('#publish').on('click',function(){

    var allImageUrl = []
    $.each(allFile,function(k,v){
       allImageUrl.push(v.tempUrl)
    })
    if (allImageUrl.length == 0){
        allImageUrl = videoUrl
    }
     $.ajax({
       url: '/article/insert',
       type: 'post',
       data:{
                title:$('#content').val(),
                content:$('#content').val(),
                multiMedia:allImageUrl
        },
       success:function(result){
         if (!result.status){
           location.reload()
         }else{
           alert(result.message)
         }
       }
     })
   })
   // 关闭图片预览框事件
   $(".ficon_close").on('click',function(){
      $('#filesUpload').css('visibility','hidden')
   })

   $('.media-box-a-image').on('click',function(){
       var selectIndex = parseInt($(this).attr("action-data"))
       var parent = $(this).parents('.info-media')
       parent.prev().css('display','')
       parent.css('display','none')
       var allImage=parent.find("ul").attr("action-data")
       allImage=allImage.replace(/big/g,"real")
       if (parent.prev().children().length == 0){
            parent.prev().imageViewer({
                readonly: true,
                loop: true,
                showQueue: true,
                images: allImage.split(","),
                selectIndex: selectIndex
            })
        }else{
            parent.prev().imageViewer().setIndex(selectIndex)
        }
   })

   // startVideo("/uploads/video/202002181036573912035.mp4");
})


/******************************本地图片上传***************************************** */
var fileTypeArr = ['jpg','gif','jpeg','png'];//文件格式限制
var fileSizeControl = 3;//文件大小控制 单位: MB
var allFile = [];//所有上传文件数组初始化 注：将根据此数组上传至后台
var htmlNums = 0;//页面元素ID属性控制

/*FileReader 开始*/
//判断浏览器是否支持FileReader接口 
if(new FileReader == 'undefined') {
    result.InnerHTML = "<p>你的浏览器不支持FileReader！</p>";
    window.location.href = 'about:blank';
}

//该方法将文件读取为一段以 data: 开头的字符串，这段字符串的实质就是 Data URL，Data URL是一种将小文件直接嵌入文档的方案。
function readAsDataURL(curfileObj){
    //检验是否为图像文件
    var fileObj = curfileObj; //获取图像临时路径
    var flagLength = 0;//文件循环标记
    var reader = new FileReader(); //初始化FileReader
    var valres = true;//图像验证标记
    var tempFileName;//临时上传图片标记 验证重复值使用
    $('#filesUpload').css('visibility','visible')
    if (fileObj[0].files.length != 0) {
        //多文件上传
        $.each(fileObj[0].files,function(k,v){
          valres = picVal(v);//图片大小和格式验证
        })
        if (valres == false) {return false;}

        reader.readAsDataURL(fileObj[0].files[flagLength]);

        reader.onload = function(e) {
            tempFileName = fileObj[0].files[flagLength].name;
            if(e.target.result) {
                if (!upPic_repeat(tempFileName)){//重复上传图片验证
                    $("#newUpload").before(getHtmlFile(fileObj[0].files[flagLength],reader.result));//加入模态框浏览
                    fileObj[0].files[flagLength]['tempUrl'] = reader.result;//临时浏览路径
                    fileObj[0].files[flagLength]['flagNums'] = "1";//文件标记
                    uploadPhoto(fileObj[0].files[flagLength],$("#newUpload").prev()); //上传服务器
                }else{
                    alert('上传图片重复~');
                }

                flagLength++;//控制循环次数
                if(flagLength <  fileObj[0].files.length) {
                    reader.readAsDataURL(fileObj[0].files[flagLength]);//读取文件 再次调用onload
                } 
            }
        };
    }else{
        alert('请上传文件后再点击~');
    }
} 

/**
* 获取浏览图片页面追加元素
* @param tempUrl 返回的BASE64临时图片位置地址
*/
function getHtmlFile(obj,tempUrl){
    var cons =
        '<div class="file-append">' +
        '<div class="loading-div" style="position: absolute;width: 100%;height: 100%">'+
        '<div class="loading" style="height:100%;width: 100%;z-index: 1;position: absolute;"></div>'+
        '<div style="position: absolute;width: 100%;height: 100%;opacity: 0.6;background-color: #ccc;">'+
        '</div>'+
        '</div>'+
        '<div class="del-temp-file" onmouseover="showDel($(this))" onmouseleave="hideDel($(this))">' +
        '<div style="padding:5px;">' +
        '<p class="file_name">'+ obj.name +'</p>' +
        '<span class="file_del" data-index="0" title="删除" onclick="real_delFile($(this))"></span>' +
        '</div>' +
        '</div>' +
        '<a style="height:80px;width:80px;" href="#" class="imgBox" onmouseover="showDel($(this).parents(\'.file-append\').find(\'.del-temp-file\'))" onmouseleave="hideDel($(this).parents(\'.file-append\').find(\'.del-temp-file\'))">' +
        '<div class="uploadImg" style="width:80px;height:80px">' +
        '<img id="uploadImage_0" class="upload-file" src="'+ tempUrl +'" style="width:80px;height:80px;">' +
        '</div>' +
        '</a>' +
        '<p id="uploadFailure_0" class="upload_fail">上传失败，请重试</p>' +
        '<p id="uploadSuccess_0" class="upload_success"></p>' +
        '</div>';
        return cons;
    }
    /*fileReader End*/

//删除浏览图片方法
function real_delFile(obj){
    var fileName = obj.parents('.del-temp-file').find('.file_name').html();
    var delFlag;

    //从文件集合的数组中删除这个文件
    $.each(allFile,function(k,v){
        if (fileName == v.name) {
            delFlag = k;//储存键
        }
    })

    allFile.splice(delFlag,1);//删除对应键位数据 防止数组长度问题出现的报错
    obj.parents('.file-append').remove();//将这个文件从页面浏览中删除
    getNumAndSize();//重新提示
    clearFile();
}

//图片移入删除按钮显示
function showDel(obj){
    obj.addClass("del-temp-file-hover");
}
//图片移出删除按钮消失
function hideDel(obj){
    obj.removeClass("del-temp-file-hover");
}

//图片验证大小和格式
function picVal(obj){
    //验证格式
    if($.inArray(obj.type.substr(6),fileTypeArr)  == -1){ 
        alert("格式错误~"); 
        return false; 
    } 

    //验证大小
    if (obj.size >= fileSizeControl * 1024 * 1024) {
        alert("文件不能超过3MB~");
        return false;
    }
    return true;
}
//大小单位 最高单位为MB
function getComp(comp){
    var compReturn = {};

    if (comp > 1024) {
        if (comp/1024 < 1024) {
            compReturn['comp'] = 'KB';
            compReturn['val'] = (comp/1024).toFixed(2);
        }else{
            compReturn['comp'] = 'MB';
            compReturn['val'] = (comp/1024/1024).toFixed(2);
        }
    }else{
        compReturn['comp'] = 'B';
        compReturn['val'] = comp;
    }

    return compReturn;
}
//清除FILE标签的内容 PS:防止删除图片后重新传造成重新传的相同图片无法上传的问题
function clearFile(){
    $('#fileImgs').val('');
}
//验证上传的图片在allfile中是否有重复值 返回值为 true false
function upPic_repeat(name) {
    var rFlag = false;

    $.each(allFile,function (k,v) {
        if (v.name == name){
            rFlag = true;
        }
    })

    return rFlag;
}
//上传服务器
function uploadPhoto(pic, node){
    var file = new FormData();
    file.append('image', pic);
    $.ajax({
      url:'/article/uploadPhoto',
      type: "post",
      data: file,
      cache: false,
      contentType: false,
      processData: false,
      success: function(data) {
          node.find('.loading-div').addClass('divHidden')
          node.find('.upload-file').attr('src',data.message)
          pic['tempUrl'] = data.message
          allFile.push(pic);//将文件对象放入数组中
          console.log(data);
          callback()
         // var res = data;
         // $("#resimg").append("<img src='/" + res + "'>")
      }
    })
}


/******************************本地视频上传***************************************** */
var videoUrl = [];

/*对上传的视频进行解析并上传 */
function readVideoAsData(curfileObj){
    var fileObj = curfileObj;
    var flagLength = 0;
    var reader = new FileReader();
    if (fileObj[0].files.length != 0) {
        var file = fileObj[0].files[flagLength]
        reader.readAsArrayBuffer(file);
        reader.onload = function(e) {
            $('#videoUpload').css('visibility','visible')
            var size = file.size;
            $('#uploadAllSize').text((size/(1024*1024)).toFixed(1))
            var i=0,allPage=[]
            for (var start = 0; start < size; start += 10*1024*1024){
                var sliceTo = start + 10*1024*1024
                if (sliceTo >= size)
                {
                    sliceTo = size
                }
                allPage[i] = [start,sliceTo]
                i ++
            }
            function upload(j, newFile){
                if (j == allPage.length)
                {
                    return
                }
                var slice = file.slice(allPage[j][0], allPage[j][1]);
                var formData = new FormData()
                formData.append('video',slice)
                formData.append("newFile", newFile);
                formData.append("name", file.name);
                $.ajax({
                    url: '/article/uploadVideo',
                    type: 'POST',
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function(data) {
                      $('#progress-bar').css('width', ((allPage[j][1] / size) * 100).toFixed(0) + "%")
                      $('#uploadedNum').text((allPage[j][1]/( 1024 * 1024 )).toFixed(1))
                      $('#uploaded').text((( allPage[j][1] / size ) * 100).toFixed(1))
                      if (allPage[j][1] == size){
                        videoUrl.push(data.newFile)
                      }else{
                        upload(j+1, data.newFile)
                      }
                    }
                })

            }
            upload(0,"");
        };
    }else{
        alert('请上传文件后再点击~');
    }
    
}
/**播放视频 */
function startVideo(that){
    var options = {
        sources : [{
            src : $(that).parent().attr("action-data"),
            type : "video/mp4"
        }],
        //是否显示控制条
        controls : true,      
        //播放器高度
        height : 280, 
        //播放器宽度
        width : 500,
        //是否循环播放
        loop : false,
        //是否静音
        muted: false,
        //播放前显示的封面图片，通常为logo
        poster : "logo.png",
        //预加载：auto自动加载、metadata加载元数据信息视频尺寸等、none不加载任何信息
        preload : "none",
        //是否缩放视频以适应播放器大小
        fluid : false,
        //是否自动播放，大多浏览器屏蔽此功能
        autoplay : false,
        //是否初始化时进入全屏，大多数浏览器屏蔽此功能
        isFullscreen : false
    };
   
    videojs($(that).parent().attr("id"), options, onPlayReady);
}


function onPlayReady() {
    //播放无效，因为以chrome为首的绝大数浏览器拒接非用户触发的自动播放
    //this.play();
    //音量调整0-1之间
    this.volume(0.5);
    this.on("ended", function() {
        //类似console.log();
        videojs.log("播放结束！");
    })
}











