// index.js
Page({
  data: {

  },
  onLoad() {},
  goDetail(e) {
    let type = e.target.dataset.type
    switch (type) {
      case 'huarongdao':
        wx.navigateTo({
          url: `/packages/SZHRD/index`
        })
        break;
      case 'dadishu':
        wx.navigateTo({
          url: `/packages/DDS/index`
        })
        break;
      case 'elsfk':
        wx.navigateTo({
          url: `/packages/ELSFK/index`
        })
        break;
      case 'csz':
        wx.navigateTo({
          url: `/packages/CSZ/index`,
        })
        break;
        case 'hby':
          wx.navigateTo({
            url: `/packages/HBY/index`,
          })
          break;
    }
  },
  onShareAppMessage: function () {
    return {
      title: '一起来玩啊~',
      path: '/pages/index/index',
      imageUrl: '/static/image/logo.jpg'
    }
  },
})