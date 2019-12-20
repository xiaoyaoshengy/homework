const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    n: 0,
    t: 0,
    p0: 2, c: 0,
    wc: 1
  },

  f: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  t: function () {
    app.globalData.p = this.data.p0
    wx.navigateTo({
      url: '../history/history',
    })
  },
  get: function () {
    var _this = this
    wx.downloadFile({
      url: 'https://tofna.hfzhang.wang:443/result',
      success: (res) => {
        console.log(res.statusCode)
        _this.setData({
          src: res.tempFilePath,
        })
      },
    })
  },






  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({ v1: app.globalData.v1 })
    this.setData({ t1: app.globalData.t1 })
    this.setData({ w1: app.globalData.w })

  },


})