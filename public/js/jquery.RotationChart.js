function ImageViewer(container, settings) {
    this.container = container;
    this.setting = settings;
}

ImageViewer.prototype = {
    _index: 0,
    _init: function () {
        let viewBox = [
            '<div class="info-expand-media-box">',
                '<div class="media-feed-a"></div>',
                '<div class="media-view">',
                    '<div class="view-show-box W-pr">',
                        '<ul>',
                            '<li class="W-fl">',
                                '<div class="box_artwork W-pr">',
                                    '<div class="W-pr box_artwork_img smallcursor">',
                                        '<img  class="showImg" style="width: 690px;" src="">',
                                    '</div>',
                                '</div>',
                                '<i class="W_loading"></i>',
                            '</li>',
                        '</ul>',
                    '</div>',
                    '<div class="view-choose-box W-pr clear">',
                        '<div class="box-stage W-fl">',
                            '<ul class="choose-box">',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>',
        ];
        this.container.append($(viewBox.join("\r\n")));
        this._loadImage();
    },

    _loadImage: function () {
        var that = this;
        this._index = this.setting.selectIndex;
        if (this.setting.images.length === 0)
            return;

        $.each(this.setting.images, function (index, el) {
            that._addImage(that, el,  that.setting.readonly, index)
        })
        this._setView(this.setting.images[this._index]);
        this._border(this)

        //鼠标在图片范围内显示的的样式
        this.container.find(".box_artwork_img").on("mousemove",function(e){
            var positionX=e.pageX-$(this).offset().left; //获取当前鼠标相对div的X坐标  
            var location = positionX/($(this).width()/3)
            $(this).unbind('click');
            switch(parseInt(location)){
                case 0:
                    $(this).removeClass("smallcursor")
                    $(this).removeClass("rightcursor")
                    $(this).removeClass("leftcursor")
                    if (that._index != 0)
                    {
                        $(this).addClass("leftcursor")
                        that._setImageClickEvent(this,that,parseInt(location))
                    }
                    break;
                case 1:
                    $(this).addClass("smallcursor")
                    $(this).removeClass("rightcursor")
                    $(this).removeClass("leftcursor")
                    that._setImageClickEvent(this,that,parseInt(location))
                    break;
                case 2:
                    $(this).removeClass("smallcursor")
                    $(this).removeClass("rightcursor")
                    $(this).removeClass("leftcursor")
                    if (that._index != (that.setting.images.length-1))
                    {
                        $(this).addClass("rightcursor")
                        that._setImageClickEvent(this,that,parseInt(location))
                    }
                    break;
                default:
                    break;
            }
            
        })
    },
    addImage: function(url) {
        this.setting.images.push(url)
        this._loadImage();
    },
    setImages: function(urls) {
        this.setting.images = urls
        this._loadImage();
    },
    getImages: function() {
        return this.setting.images;
    },
    setIndex: function(selectIndex){
        this._index = selectIndex
        this._select(this)

    },
    _addImage: function(that, url, readonly, index) {
        var img = $("<li><a href='javascript:;'  action-data="+index+" class=''><img src=" +url+ "></a></li>");
        img.on('click',function(){
            that._index = parseInt(img.children().attr('action-data'))
            that._select(that)
        })
        that.container.find(".choose-box").append(img)   
    },
    _setView: function (url) {
        this.container.find(".showImg").attr("src",   url);
    },
    _preOne: function (that) {
        if (!that.setting.loop && that._index === 0) {
            return;
        }
        that._index = that._index === 0 ? that.setting.images.length - 1 : that._index - 1;
        that.container.find(".box_artwork img").attr('src',that.setting.images[that._index])
    },
    _nextOne: function (that) {
        var maxIndex = that.setting.images.length - 1;
        if (!that.setting.loop && that._index === maxIndex) {
            return;
        }
        that._index = that._index === maxIndex ? 0 : that._index + 1;
        that.container.find(".box_artwork img").attr('src',that.setting.images[that._index])
    },
    _border: function (that) {
        that.container.find(".choose-box li:eq("+ that._index +") a").addClass("current").parent().siblings().find("a").removeClass("current")
        that._moveSelect(that)
    },
    _select: function(that){
        that.container.find(".box_artwork img").attr('src',that.setting.images[that._index])
        that._border(that)
    },
    _setImageClickEvent: function(self, that, flag){
        switch (flag){
            case 0:
                $(self).on("click",function(){
                    if (that._index != 0)
                    {
                        that._preOne(that)
                        that._border(that)
                    }
                })
                break;
            case 1:
                $(self).on("click",function(){
                    that.container.css("display","none")
                    that.container.next().css("display","")
                })
                break;
            case 2:
                $(self).on("click",function(){
                    if (that._index != (that.setting.images.length-1))
                    {
                        that._nextOne(that)
                        that._border(that)
                    }
                })
                break;
            default:
                break;
        }
    },
    _moveSelect: function(that){
        var allImagesLength = that.setting.images.length
        if (allImagesLength > 9){
            if ((that._index >=5)&&(that._index <= (allImagesLength-5)))
            {   
                that.container.find('.choose-box').css("margin-left",-((that._index-4)*56) + "px")
            }
            if (that._index > (allImagesLength-5))
            {
                that.container.find('.choose-box').css("margin-left",-((allImagesLength-5-4)*56) + "px")
            }
            if (that._index < 5)
            {
                that.container.find('.choose-box').css("margin-left", "0px")
            }
        }
    }
};

$.fn.imageViewer = function (options) {
    let defaultOptions = {
        readonly: true,
        loop: true,
        showQueue: true,
        images: [],
        selectIndex: 0
    }
    if ($(this).data("imageViewer") && !options)
        return $(this).data("imageViewer");
    let setting = $.extend({}, defaultOptions, options);
    let imageViewer = new ImageViewer($(this), setting)
    imageViewer._init();
    $(this).data("imageViewer", imageViewer);
};