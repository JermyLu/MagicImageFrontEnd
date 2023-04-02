function randomString(length) {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: "AI努力生成中, 请耐心等待一会儿~",
    absUrl: "",
    inputVal: null,
    promptVal: null,
    negativePromptVal: null,
    buttonVal: null,
    generatedImage: "",// 存储生成的图片
    // request_id: randomString(12)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      inputVal: options.inputData,
      promptVal: options.promptData,
      negativePromptVal: options.negativePromptData,
      buttonVal: options.buttonData
    })

    // 监听完毕后向服务器发送请求
    wx.request({
      url: "https://www.magicimage.site/text2image",
      method: 'POST',
      data: {
        request_id: randomString(12),
        style: "太乙通用",
        sequence: that.data.inputVal + "," + that.data.promptVal + "," + that.data.buttonVal
      },
      dataType: 'json',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data) // 查看api返回结构体, 若data是json格式, 可以通过字典的方式获取返回值
        var tmpUrl = res.data["absUrl"]
        if (res.statusCode == 200) {
          wx.downloadFile({
            url: "https://www.magicimage.site/download?file_path=" + res.data["absUrl"],
            success (res) {
              if (res.statusCode === 200) {
                // wx.showToast({
                //   title:'AI生成成功'
                // })
                that.setData({
                  title: "AI生成成功",
                  generatedImage: res.tempFilePath,
                  absUrl: tmpUrl
                })
              } else {
                that.setData({
                  title: "AI生成失败，请重试",
                  icon: 'none'
                })
              }
            },
            fail (res) {
              that.setData({
                title: "AI生成失败，请重试",
                icon: 'none'
              })
            }
          })
        } else {
          that.setData({
            title: "AI生成失败，请重试",
            icon: 'none'
          })
        }
      },
      fail: function () {
        that.setData({
          title: "AI生成失败，请重试",
          icon: 'none'
        })
      }
    })
  },

  saveImg(){//保存到相册
    var that = this;
		wx.saveImageToPhotosAlbum({
      filePath: that.data.generatedImage,
      success:(res)=>{
        wx.showToast({
          title:'保存成功！'
        }),
        wx.navigateTo({
          url: '../feedback/feedback?absUrl=' + this.data.absUrl
        })
      },
      faile:(err)=>{
        console.log('保存失败！')
      }
    })
  },

  clickSaveImg(){//先授权相册
		wx.getSetting({
			success:res=>{
				if(!res.authSetting['scope.writePhotosAlbum']){//未授权的话发起授权
					wx.authorize({
						scope:'scope.writePhotosAlbum',
						success:()=>{//用户允许授权，保存到相册
							this.saveImg();
						},
						fail:()=>{//用户拒绝授权，然后就引导授权（这里的话如果用户拒绝，不会立马弹出引导授权界面，坑就是上边所说的官网原因）
							wx.openSetting({
								success:()=>{
									wx.authorize({
										scope:'scope.writePhotosAlbum',
										succes:()=>{//授权成功，保存图片
										this.saveImg();
											
										}
									})
								}
							})
						}
					})
				}else{//已经授权
					this.saveImg();
				}
			}
		})
	},

  /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
});