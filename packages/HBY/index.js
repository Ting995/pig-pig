Page({
  data: {
  },
  onLoad(options) {

  },
  onShareAppMessage: function () {
    return {
      title: '一起来玩华容道~',
      path: '/packages/SZHRD/index',
      imageUrl: '/static/image/logo.jpg'
    }
  },
})