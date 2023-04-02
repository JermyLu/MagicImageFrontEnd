Page({
  data: {
    absUrl: "",
    star: 0,
    starMap: [
      '1',
      '2',
      '3',
      '4',
      '5',
    ],
    suggestion: ""
  },
  myStarChoose(e) {
    let star = parseInt(e.target.dataset.star) || 0;
    this.setData({
      star: star,
    });
  },
  getInput: function(e) {
    this.setData({
      suggestion: e.detail.value
    }) 
  },
  feedback: function(){
    var that = this;
    wx.request({
      url: "https://www.magicimage.site/feedback",
      method: 'POST',
      data: {
        star: that.data.starMap[that.data.star - 1],
        suggestion: that.data.suggestion,
        absUrl: that.data.absUrl
      },
      dataType: 'json',
      header: {
        'content-type': 'application/json' // 默认值
      },

      success: function (res) {
        // console.log(res) // 查看完整response结构体
        console.log(res.data)
        if (res.statusCode == 200) {
          wx.showToast({
            title: '反馈提交成功'
          })
        } else {
          wx.showToast({
            title: '反馈提交失败，请重试',
            icon: 'none'
          })
        }
      },
      fail: function () {
        // 处理上传失败的响应
        wx.showToast({
          title: '反馈提交失败，请重试',
          icon: 'none'
        })
      }
    })
  },

  onLoad: function (options) {
    this.setData({
      absUrl: options.absUrl
    })
  },
});