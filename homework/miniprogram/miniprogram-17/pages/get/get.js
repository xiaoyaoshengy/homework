const app = getApp()
Page({
  data: {
    w1: 2,
    t: 0,
    t1: 0,
    t2: 0,
    t3: 0,
    t4: 0,
    t5: 0,
    a: 0,
    b: 1,
    c: 1,
    d: 1,
    p: 1
  },

  a: function () {
    wx.navigateTo({
      url: '../history/history',
    })

  },
  onLoad() {
    app.globalData.t = this.data.t
    app.globalData.p = this.data.p
    this.ctx = wx.createCameraContext()
  },

  startRecord() {
    this.setData({ c: 0 })
    var _this = this
    const ctx = wx.createCameraContext(this)
    ctx.takePhoto({
      success: (res) => {
        _this.setData({
          src: res.tempImagePath
        })
      },
    })},
  error(e) {
    console.log(e.detail)
  },

  www: function () {
    this.setData({ t: this.data.t + 1 })
    this.setData({ t5: this.data.t4 })
    this.setData({ t4: this.data.t3 })
    this.setData({ t3: this.data.t2 })
    this.setData({ t2: this.data.t1 })
    this.setData({ t1: this.data.t })
    app.globalData.t = this.data.t
    app.globalData.t1 = this.data.t1
    app.globalData.t2 = this.data.t2
    app.globalData.t3 = this.data.t3
    app.globalData.t4 = this.data.t4
    app.globalData.t5 = this.data.t5
    app.globalData.num = app.globalData.num + 1
    this.setData({ c: 1 })
    var _this = this
    wx.uploadFile({
      url: 'https://tofna.hfzhang.wang:443/upload',
      filePath: this.data.src,
      name: 'picture',
      success: (res) => {
        var downUrl = JSON.parse(res.data).downUrl
        console.log(downUrl)
        _this.setData({
          tempPath: downUrl
        })
      }
    })
      wx.navigateTo({
        url: '../translation/translation',
      })
    
  },







  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {



  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})