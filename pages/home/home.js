// pages/home/index.js
Page({
  data: {
    // 首页轮播图数据
    coverList:[
      {
        id: 0,
        url: "../../images/home/t2i_1.jpeg"
      },
      {
        id: 1,
        url: "../../images/home/i2i_1.png"
      },
      {
        id: 2,
        url: "../../images/home/t2i_2.jpeg"
      },
      {
        id: 3,
        url: "../../images/home/i2i_2.png"
      },
      {
        id: 4,
        url: "../../images/home/t2i_3.jpeg"
      },
      {
        id: 4,
        url: "../../images/home/i2i_3.jpeg"
      }
    ]
  },
  /* 这里实现控制中间凸显图片的样式 */
  handleChange: function (e) {
    this.setData({
      currentIndex: e.detail.current
    })
  },
})
