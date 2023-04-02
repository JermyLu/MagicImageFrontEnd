Page({
  data: {
    inputVal: "",
    promptVal: "",
    negativePromptVal: "",
    buttonVal: ""
  },
  getInput: function(e) {
    this.setData({
      inputVal:e.detail.value
    }) 
  }, 
  getPrompt: function(e) {
    this.setData({
      promptVal:e.detail.value
    }) 
  }, 
  getNegativePrompt: function(e) {
    this.setData({
      negativePromptVal:e.detail.value
    }) 
  },
  getButton: function(e) {
    this.setData({
      buttonVal:e.currentTarget.dataset.text
    })
  },

  // 跳转至text2imageGen-页面
  t2iGen: function(){
    wx.navigateTo({
      url: '../t2iGen/gen?inputData=' + this.data.inputVal + '&promptData=' + this.data.promptVal + '&negativePromptData=' + this.data.negativePromptVal + '&buttonData=' + this.data.buttonVal
    })
  },
});