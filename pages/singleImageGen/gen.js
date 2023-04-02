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
  data: {
    absUrl: "",
    title: "请选择图像体验Image2Image魔法",
    typeVal: null,
    selectedImage: "", // 存储被选中的图片
    generatedImage: "",// 存储生成的图片
    // request_id: randomString(12)
  },

  // 点击选择图片按钮
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 最多可以选择1张图片
      sizeType: ['original', 'compressed'], // 可以指定原图或压缩后的图片
      sourceType: ['album', 'camera'], // 可以指定来源相册或相机
      success: function (res) {
        // 将选择的图片临时文件路径存储起来
        that.setData({
          selectedImage: res.tempFilePaths[0]
        })
      }
    })
  },

  image2Image: function () {
    var that = this;
    // 判断是否已选择图片
    if (!that.data.selectedImage) {
      wx.showToast({
        title: '请先选择图片',
        icon: 'none'
      })
      return;
    }
    
    that.data.title = "AI努力生成中, 请耐心等待一会儿~"
    wx.request({
      url: "https://www.magicimage.site/image2image",
      method: 'POST',
      data: {
        request_id: randomString(12),
        style: that.data.typeVal,
        image: wx.getFileSystemManager().readFileSync(that.data.selectedImage, 'base64')
      },
      dataType: 'json',
      header: {
        'content-type': 'application/json' // 默认值
      },

      success: function (res) {
        // console.log(res) // 查看完整response结构体
        console.log(res.data) // 查看api返回结构体, 若data是json格式, 可以通过字典的方式获取返回值
        var tmpUrl = res.data["absUrl"]
        if (res.statusCode == 200) {
          wx.downloadFile({
            url: "https://www.magicimage.site/download?file_path=" + res.data["absUrl"],
            success (res) {
              if (res.statusCode === 200) {
                wx.showToast({
                  title:'转换成功'
                })
                // that.setData({
                //   title: "AI转换成功"
                // })
                that.setData({
                  generatedImage: res.tempFilePath,
                  absUrl: tmpUrl
                })
              } else {
                wx.showToast({
                  title: '转换失败',
                  icon: 'none'
                })
                // that.setData({
                //   title: "AI转换失败，请重试"
                // })
              }
            },
            fail (res) {
              wx.showToast({
                title: '转换失败',
                icon: 'none'
              })
              // that.setData({
              //   title: "AI转换失败，请重试"
              // })
            }
          })
        } else {
          wx.showToast({
            title: '转换失败',
            icon: 'none'
          })
          // that.setData({
          //   title: "AI转换失败，请重试"
          // })
        }
      },
      fail: function () {
        // 处理上传失败的响应
        wx.showToast({
          title: '图像上传失败，请重试',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      typeVal: options.typeData
    })
  },

  saveImg(){//保存到相册
    var that = this;
		wx.saveImageToPhotosAlbum({
      filePath: that.data.generatedImage,
      success:(res)=>{
        wx.showToast({
          title:'保存成功！'
        })
        wx.navigateTo({
          url: '../feedback/feedback?absUrl=' + this.data.absUrl
        })
      },
      faile:(err)=>{
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
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