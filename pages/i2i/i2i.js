Page({
  data: {
    typeVal: ""
  },
  singleImageGen: function(e){
    this.setData({
      typeVal:e.currentTarget.dataset.text
    }),
    wx.navigateTo({
      url: '../singleImageGen/gen?typeData=' + this.data.typeVal
    })
  }
});

