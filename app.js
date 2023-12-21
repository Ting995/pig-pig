// app.js
App({
  globalData(){},
  showToast(title) {
    wx.showToast({
      icon: 'none',
      title,
    })
  },
})
