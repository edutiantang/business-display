// pages/main/main.js
import { config } from '../../api/config.js'
var QQMapWX = require('../../asserts/libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    frontColor: "#ffffff", // white
    backgroundColor: "#008000", // green
    businessName: "张江汤臣豪园",
    displayAddress: "上海市浦东新区金科路附近", // 用于页面显示的地址
    mapAddress: "上海市浦东新区晨晖路828弄1～75号", // 用于地址解析
    scale: 17, // wx.openLocation参数之一,表示缩放比例，范围5~18，默认为18
    phoneNumber: "12345678901",
    businessHours: "8:00~22:00",
    imageSwiper: {
      indicatorDots: true, // 是否显示面板指示点
      autoplay: true, // 是否自动切换
      interval: 3000, // 自动切换时间间隔
      duration: 1000, // 滑动动画过渡时长
      circular: true, // 是否采用衔接滑动
      displayMultipleItems: 1, // 同时显示的滑块数量
      skipHiddenItemLayout: false, // 是否跳过未显示的滑块布局，设为 true 可优化复杂情况下的滑动性能，但会丢失隐藏状态滑块的布局信息
      imgUrls: [
        "http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg",
        "http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg",
        "http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg"
      ], 
    },
  },

  call: function () {
    const { phoneNumber } = this.data;
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    })
  },

  findLocation: function () {
    const { businessName, mapAddress, scale } = this.data;
    qqmapsdk.geocoder({
          address: mapAddress,
          success: function (res) {
                console.log(res);
                wx.openLocation({
                  name: businessName, // 位置名
                  address: mapAddress, // 地址的详细说明
                  latitude: res.result.location.lat,
                  longitude: res.result.location.lng,
                  scale: scale
                })
          },
          fail: function (res) {
                wx.showModal({
                  title: '温馨提示',
                  content: '定位失败，请检查后重试',
                  showCancel: false,
                  confirmText: '好的'
                })
          },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: config.qqMapKey
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const { businessName, frontColor, backgroundColor } = this.data;
    wx.setNavigationBarTitle({
      title: businessName
    })

    wx.setNavigationBarColor({
      frontColor,
      backgroundColor,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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