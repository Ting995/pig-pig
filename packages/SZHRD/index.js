Page({
  data: {
    blocks: [], // 拼图块
    blankIndex: 9, // 空白块的下标
    step: 0, // 步数
    min: '00', // 分钟
    sec: '00', // 秒数
    ms: '00', // 毫秒数
    timer: null, // 计时器
    gameover: false, // 是否结束游戏
    step: 0
  },
  onLoad(options) {
    this.startGame()
  },
  // 开始 
  startGame() {
    // let arr = [1, 2, 3, 4, 5, 6, 7, 0,8]
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 0].sort(() => Math.random() - 0.5)
    let blocks = []
    arr.forEach((i, idx) => {
      let x = idx % 3;
      let y = Math.floor(idx / 3);
      blocks.push({
        blockNum: arr[idx],
        isEmpty: arr[idx] == 0 ? true : false,
        value: arr[idx] === 0 ? '' : arr[idx], // 0 不显示
        x: x * 200, // left值
        y: y * 200 // top值
      });
    })
    this.setData({
      blocks: blocks,
      step: 0,
      min: '00',
      sec: '00',
      ms: '00',
      gameover: false
    });
  },
  // 点击拼图块
  clickBlock(e) {
    const that = this
    if (this.data.gameover) return;
    let index = e.currentTarget.dataset.index;
    let arr = [...this.data.blocks];
    // 判断是否可以移动
    if (arr[index - 1] && arr[index - 1].isEmpty) { // 左移
      [arr[index].value, arr[index - 1].value, arr[index].isEmpty, arr[index - 1].isEmpty, arr[index].blockNum, arr[index - 1].blockNum] = [arr[index - 1].value, arr[index].value, arr[index - 1].isEmpty, arr[index].isEmpty, arr[index - 1].blockNum, arr[index].blockNum]
      this.setData({
        step: this.data.step + 1
      })
    } else if (arr[index + 1] && arr[index + 1].isEmpty) { // 右移
      [arr[index].value, arr[index + 1].value, arr[index].isEmpty, arr[index + 1].isEmpty, arr[index].blockNum, arr[index + 1].blockNum] = [arr[index + 1].value, arr[index].value, arr[index + 1].isEmpty, arr[index].isEmpty, arr[index + 1].blockNum, arr[index].blockNum]
      this.setData({
        step: this.data.step + 1
      })
    } else if (index > 2 && arr[index - 3] && arr[index - 3].isEmpty) { // 上移
      [arr[index].value, arr[index - 3].value, arr[index].isEmpty, arr[index - 3].isEmpty, arr[index].blockNum, arr[index - 3].blockNum] = [arr[index - 3].value, arr[index].value, arr[index - 3].isEmpty, arr[index].isEmpty, arr[index - 3].blockNum, arr[index].blockNum]
      this.setData({
        step: this.data.step + 1
      })
    } else if (arr[index + 3] && arr[index + 3].isEmpty) { // 下移
      [arr[index].value, arr[index + 3].value, arr[index].isEmpty, arr[index + 3].isEmpty, arr[index].blockNum, arr[index + 3].blockNum] = [arr[index + 3].value, arr[index].value, arr[index + 3].isEmpty, arr[index].isEmpty, arr[index + 3].blockNum, arr[index].blockNum]
      this.setData({
        step: this.data.step + 1
      })
    }
    this.setData({
      blocks: arr
    }, () => {
      that.checkwin()
    })
  },
  arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) {
        return false;
      }
    }
    return true;
  },
  // 检查获胜
  checkwin() {
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 0]
    let oldblocks = []
    arr.forEach((i, idx) => {
      let x = idx % 3;
      let y = Math.floor(idx / 3);
      oldblocks.push({
        blockNum: arr[idx],
        isEmpty: arr[idx] == 0 ? true : false,
        value: arr[idx] === 0 ? '' : arr[idx],
        x: x * 200,
        y: y * 200
      });
    })
    let result = this.arraysAreEqual(oldblocks, this.data.blocks)
    if (result) {
      getApp().showToast('恭喜获胜')
      this.setData({
        gameover: true
      })
    }
  },
  onShareAppMessage: function () {
    return {
      title: '一起来玩华容道~',
      path: '/packages/SZHRD/index',
      imageUrl: '/static/image/logo.jpg'
    }
  },
})