//logs.js

Page({
  data:{
    tempPath:'',
  },
  //拍照并上传
  start:function(){
    var _this=this
    const ctx=wx.createCameraContext(this)
    ctx.takePhoto({
      success:(res)=>{
        wx.uploadFile({
          url: 'https://tofna.hfzhang.wang:443/upload',
          filePath: res.tempImagePath,
          name: 'picture',
          success:(res)=>{
            var downUrl=JSON.parse(res.data).downUrl//获取服务器传回的图片链接
            //console.log(downUrl)
            _this.setData({
              tempPath:downUrl
            })
          }
        })
      },
    })
  },
  //下载处理后的图片
  get:function(){
    var _this=this
    wx.downloadFile({
      url:'https://tofna.hfzhang.wang:443/result',
      success:(res)=>{
        //console.log(res.statusCode)
        _this.setData({
          src:res.tempFilePath,
        })
      },
    })
  }
})
