// packages/ELSFK/index.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        fkWidth:0,
        gameover:false,//游戏结束
        defaultData:{
            positionTop:720,
            nowIndex:0,
            allArr:[{
                oneList:[
                    {
                        left:0,
                        sum:2,
                        color:'green'
                    },
                    {   
                        sum:0,
                        left:2,
                    },
                    {   
                        left:3,
                        sum:1,
                        color:'blue',
                    },
                    {   
                        left:4,
                        sum:1,
                        color:'red',
                    },
                    {   
                        sum:0,
                        left:5,
                    },
                    {   
                        left:6,
                        sum:2,
                        color:'red',
                    },
                ]
            },{
                oneList:[
                    {
                        left:0,
                        sum:0,
                    },
                    {
                        left:1,
                        sum:0,
                    },
                    {   
                        sum:1,
                        left:2,
                        color:'red',
                    },
                    {   
                        left:3,
                        sum:1,
                        color:'blue',
                    },
                    {   
                        left:4,
                        sum:0,
                    },
                    {   
                        sum:0,
                        left:5,
                    },
                    {   
                        left:6,
                        sum:2,
                        color:'red',
                    },
                ]
            }],
            dragInfo:{
                allindex:0,
                color:'',
                sum:0,
                left:0,
                offsetX:0,
            }
        },
        positionTop:0,
        nowIndex:0,
        allArr:[],
        isDragging:false,//是否正在拖拽
        dragInfo:{},//被拖拽元素的属性
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.resetFn()
        // 获取拖动元素
        var query = wx.createSelectorQuery()
        query.select('#fk-box').boundingClientRect((res)=> {
            this.setData({fkWidth:res.width})
        }).exec()
    },
    resetFn(){
        for (const key in this.data.defaultData) {
            this.setData({
                [key]:this.data.defaultData[key],
            })
        }
        this.playFn()
        this.moveUpFn()
    },
    // 移动后执行的函数
    moveUpFn(){
        if(this.data.gameover)return
        let {positionTop:oldTop,nowIndex:oldIndex} = this.data
        if(oldIndex >= this.data.allArr.length-2){
            this.setData({allArr:this.data.allArr.concat(this.createNewItem())})
        }
        this.setData({
            nowIndex:oldIndex+1,
            positionTop:oldTop-80
        })
        this.checkFk()
        if(this.data.positionTop==0){
            this.gameoverFn()
        }
    },
    // 检验方块是否会向下落
    checkFk(){
        console.log('开始检测');
        let overFlag = false
        for (let index = 1; index <= this.data.nowIndex; index++) {
            console.log(`当前行数：${index}`);
            const element = this.data.allArr[index];
            const preElement = this.data.allArr[index-1];
            let allFkArr = []
            preElement.oneList.forEach((item,preI)=>{
                if(item.sum!=0){
                    allFkArr.push({
                        index:preI,
                        color:item.color,
                        start:item.left,
                        end:item.left+item.sum,
                    })
                }
            })
            let blankArr = []
            element.oneList.forEach((item,elI)=>{
                if(item.sum==0){
                    if(blankArr.length==0){
                        blankArr.push({
                            index:elI,
                            start:item.left,
                            end:item.left+1,
                        })
                    }else if(blankArr[blankArr.length-1].end==item.left){
                        blankArr[blankArr.length-1].end++
                    }else{
                        blankArr.push({
                            index:elI,
                            start:item.left,
                            end:item.left+1,
                        })
                    }
                }
            })
            let resetFlag = false
            try {
                console.log(blankArr,allFkArr);
                allFkArr.forEach((item)=>{
                    let blankObj = blankArr.filter(value=>{
                        return value.start<=item.start&&value.end>=item.end
                    })[0]
                    console.log('执行到了',blankObj);
                    if(blankObj){
                        resetFlag = true
                        let obj = this.data.allArr[index-1]
                        let obj2 = this.data.allArr[index]
                        let newBlankobj = []
                        let newItemObj = {
                            left:item.start,
                            sum:item.end-item.start,
                            color:item.color,
                        }
                        for (let itemI = item.start; itemI < item.end; itemI++) {
                            newBlankobj.push({
                                sum:0,
                                left:itemI
                            })
                        }
                        obj.oneList.splice(item.index,1,...newBlankobj)
                        obj2.oneList.splice(blankObj.index, item.end-item.start,newItemObj)
                        console.log(obj,obj2,'新数据');
                        this.setData({
                            ['allArr[' + (index-1) + ']']:obj,
                            ['allArr[' + index + ']']:obj2,
                        })
                        throw Error();
                    }
                })
            } catch (error) {
            }
            if(resetFlag){
                overFlag = false
                this.checkFk()
            }else{
                if(index==this.data.nowIndex){
                    overFlag = true
                }

            }
        }
        if(overFlag){
            console.log('执行结束');
        }
    },  
    // 监听按下事件
    onDragStart(e) {
        const {left,sum,color} = e.currentTarget.dataset.info
        const allindex  = e.currentTarget.dataset.allindex
        if(allindex>this.data.nowIndex)return
        let offsetX = e.changedTouches[0].clientX - e.currentTarget.offsetLeft
        this.setData({
            isDragging:true,
            dragInfo:{offsetX,left,sum,color,allindex}
        })
    },
    // 监听触控移动事件
    onDragMove(e) {
        if (this.data.isDragging) {
            const {offsetX,sum} = this.data.dragInfo
            // 计算拖动后的位置
            var x = e.changedTouches[0].clientX - offsetX
            // 限制拖动范围，使拖动元素不会被拖出窗口。
            let offsetWidth = Math.floor(e.currentTarget.dataset.width * (642/750))
            x =  Math.min(x, 642 - offsetWidth)
            let dragLeft = Math.ceil(x/this.data.fkWidth)
            dragLeft = Math.min(dragLeft,8-sum)
            dragLeft = Math.max(dragLeft,0)
            if(dragLeft==this.data.dragInfo.left)return
            // 获取当前元素前后的元素，检验可移动范围
            const {allindex,index,info} = e.currentTarget.dataset
            let nowOneList = this.data.allArr[allindex].oneList; //当前行
            let flag = true
            nowOneList.forEach((item,i)=>{
                if(!flag||i==index)return
                if(index==0&&item.sum!=0){//如果是第一个元素，就只需判断向后可移动距离
                    // 找到右侧第一个非空元素，可移动范围是 该非空元素left-拖拽元素的sum
                    dragLeft = Math.min(dragLeft,item.left-info.sum)
                    flag = false
                }else if(index==nowOneList.length-1&&item.sum!=0){
                    // 如果是最后一个元素，就只需判断前方元素的sum+left最大值
                    dragLeft = Math.max(dragLeft,item.left+item.sum)
                }else{
                    let preLeft = 0
                    let nextLeft = 8-sum
                    if(i<index&&item.sum!=0){
                        preLeft = item.sum+item.left
                        dragLeft = Math.max(dragLeft,preLeft)
                    }
                    if(i>index&&item.sum!=0){
                        nextLeft = item.left-info.sum
                        dragLeft = Math.min(dragLeft,nextLeft)
                        flag = false
                    }
                }
            })
            // 更新拖动元素位置
            this.setData({
                'dragInfo.left':dragLeft
            })
        }
    },
    // 监听触控结束事件
    onDragEnd(e) {
        if(this.data.isDragging){
            const {allindex,index,info} = e.currentTarget.dataset
            if(info.left!=this.data.dragInfo.left){
                let newList = this.data.allArr[allindex].oneList
                let newLeft = newList[index].left
                for (let i = newLeft; i < (newLeft+newList[index].sum); i++) {
                    newList.push({
                        sum:0,
                        left:i
                    })
                }
                newList[index].left = this.data.dragInfo.left
                newList.splice(this.data.dragInfo.left,newList[index].sum)
                newList.sort((a,b)=>a.left-b.left)
                this.setData({isDragging:false,dragInfo:{...this.data.defaultData.dragInfo},['allArr[' + allindex + '].oneList']:newList})
                this.checkFk()
                this.moveUpFn()
            }
        }
    },
    //生成新的数据
    createNewItem(){
        let colorArr = ['red','blue','green']
        let sumArr = [
            { 
                flag:false,//是否组建成一行
                oneList:[]
            },
        ]
        for (let i = 0; i < 50; i++) {
            let num = Math.floor(Math.random()*5) // 获得0-4之间的数字
            let colorNum = Math.floor(Math.random()*3) // 获得0-2之间的数字
            let isAdd = false
            sumArr.forEach((item,index)=>{
                if(!item.flag){// 如果还未组成完整的一行，就判断当前随机到的数字是否能继续放入当前行
                    let nowSum = 0
                    item.oneList.forEach((value)=>{
                        nowSum = nowSum + ( value.sum==0?1:value.sum)
                    })
                    let numValue = num==0?1:num
                    if(nowSum+numValue>8){
                        isAdd = true
                    }else{
                        if(nowSum+numValue==8){
                            item.flag = true
                        }
                        isAdd = false
                        item.oneList.push({
                            left:nowSum,
                            sum:num,
                            color:colorArr[colorNum]
                        })
                    }
                }else{
                    if(!sumArr[index+1]){
                        isAdd = true
                    }
                }
            })
            if(isAdd){
                sumArr.push({
                    flag:false,
                    oneList:[
                        {
                            left:0,
                            sum:num,
                            color:colorArr[colorNum]
                        }
                    ]
                })
            }
        }
        let arr = []
        sumArr.forEach(item=>{
            if(item.flag&&this.isAllZeroOrAllNotZero(item.oneList)){
                arr.push(item)
            }
        })
        let fillerList = []
        arr.forEach((arrItem,arrIndex)=>{
            fillerList.push({})
            arrItem.oneList.forEach((item,index)=>{
                
            })
        })
        return arr
    },
    // 判断生成的数据中是否符合规则 每一行中既有空白又有方块
    isAllZeroOrAllNotZero(arr) {
        let zeroCount = 0;
        let notZeroCount = 0;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].sum === 0) {
            zeroCount++;
          } else {
            notZeroCount++;
          }
        }
        if (zeroCount === arr.length || notZeroCount === arr.length) {
            return false; // 全都为0或全都不为0，返回true
        } else {
          return true; // 既有0又有非0，返回false
        }
    },
    // 游戏开始函数
    playFn(){
        this.setData({gameover:false})
    },
    // 游戏结束函数
    gameoverFn(){
        getApp().showToast(`游戏结束`)
        this.setData({gameover:true})
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})