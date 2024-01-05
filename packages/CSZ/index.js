Page({
  data: {
    countList: [],
    cardIndex: null,
    countDown: 10, // 倒计时
    showCardBack: false,
    score: 0,
    timer: null,
    gameover: false,
    randomCount: null,
    playFalg: false
  },
  onLoad() {
    this.initConut()
  },
  initConut() {
    clearTimeout(this.data.timer)
    let countList = []
    for (let i = 1; i <= 6; i++) {
      countList.push(i)
    }
    this.getRandomCount()
    this.setData({
      countList: countList.sort(() => Math.random() - 0.5),
      showCardBack: false,
      countDown: 10,
      score:0,
      playFalg: false,
      gameover:false
    })
  },
  getRandomCount() {
    let randomNumber = Math.floor(Math.random() * 6) + 1
    this.setData({
      randomCount: randomNumber
    })
  },
  start() {
    this.getRandomCount()
    this.setData({
      countDown: 10,
      playFalg: true,
      countList: this.data.countList.sort(() => Math.random() - 0.5)
    })
    getApp().showToast('游戏开始')
    this.startCountDown()
  },
  // 翻开
  rotatedCard(e) {
    if (!this.data.playFalg) return
    const that = this
    if (this.data.gameover) return
    this.setData({
      showCardBack: false
    })
    let {
      index,
      item
    } = e.currentTarget.dataset
    this.setData({
      cardIndex: index
    })
    setTimeout(() => {
      this.setData({
        showCardBack: true
      }, () => {
        if (item == that.data.randomCount) {
          getApp().showToast('恭喜你，猜中了！')
          that.setData({
            score: this.data.score += 1
          })
          that.getRandomCount()
        } else {
          getApp().showToast('哦吼，没猜中，再试一次吧！')
        }
      })
    }, 200)
  },
  startCountDown() {
    // 启动倒计时
    this.setData({
      timer: setInterval(() => {
        let countDown = this.data.countDown;
        if (countDown > 0) {
          countDown--;
          this.setData({
            countDown: countDown
          });
        }
        if (countDown == 0) {
          this.setData({
            gameover: true,
            playFalg: false,
          })
          clearInterval(this.data.timer);
          getApp().showToast(`游戏结束,您得了${this.data.score}分`)
        }
      }, 1000)
    });
  },
  onShareAppMessage: function () {
    return {
      title: '一起来玩猜数字~',
      path: '/packages/CSZ/index',
      imageUrl: '/static/image/logo.jpg'
    }
  }
})