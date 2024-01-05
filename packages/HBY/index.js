Page({
  data: {
    redPackList: [],
    timer: null,
    countDown: 15,
    gameover: false,
    score:0,
  },
  onLoad(options) {

  },
  start() {
    if (this.data.gameover) return
    this.startCountDown()
    let redPackList = this.data.redPackList
    setTimeout(() => {
      let random = Math.floor(Math.random() * 600)
      let randomMoney = Math.floor(Math.random() * 10)
      redPackList.push({
        left: random,
        money:randomMoney
      })
      this.start()
    }, 500)
    this.setData({
      redPackList: redPackList
    })
  },
  getMoney(e){
    let item=e.currentTarget.dataset.item.money
    if(this.data.gameover) return
    this.setData({
      score: this.data.score += item
    })
  },
  // 倒计时
  startCountDown() {
    // 启动倒计时
    this.setData({
      timer: setTimeout(() => {
        let countDown = this.data.countDown;
        if (countDown > 0) {
          countDown--;
          this.setData({
            countDown: countDown
          });
        }
        if (countDown == 0) {
          this.setData({
            gameover: true
          })
          clearInterval(this.data.timer);
          getApp().showToast(`游戏结束`)
        }
      }, 1000)
    });
  },
  reset() {
    clearTimeout(this.data.timer)
    this.setData({
      score:0,
      countDown:15,
      gameover:false,
    })
  },
  onShareAppMessage: function () {
    return {
      title: '一起来赢红包吧~',
      path: '/packages/HBY/index',
      imageUrl: '/static/image/logo.jpg'
    }
  },
})