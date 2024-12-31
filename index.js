/* 设置常数数据 */
const sliderLength = 40//拼图长
const r = 10//半径
const canvasWidth = 310//画布宽
const canvasHeight = 155//画布高
const PI = Math.PI//圆周率
const sliderWidth = sliderLength + r * 2//拼图加上圆的长
let y = Math.random()//随机Y轴
let x = Math.random()//随机X轴
let startX = 0//开始按下的x坐标
let isMouseDown = false//是否在滑块按钮的地方按下
const mobileStatus = (/Mobile|Android|iPhone/i.test(navigator.userAgent))//判断是手机还是电脑

/* 获取dom节点 */
const captcha = document.querySelector('#captcha')
const canvas = document.querySelector('canvas')
const block = document.querySelector('.block')
const sliderContainer = document.querySelector('.slider-container')
const slider = document.querySelector('.slider')
const msg = document.querySelector('#msg')
/* 创建图片节点 */
const img = document.createElement('img')
img.src = './yz.png';//图片路径
img.onload = imgLoad//图片加载完后执行函数

/* 获取绘制二维图形环境 */
const canvasCtx = canvas.getContext('2d')
const blockCtx = block.getContext('2d')

/* 监听事件 */

/**
 * 按下事件
 */
slider.addEventListener(mobileStatus ? 'touchstart' : 'mousedown', e => {
    startX = mobileStatus ? e.touches[0].pageX : e.x//获取开始按下的x坐标
    isMouseDown = true//在滑块按钮俺的
})

/**
 * 移动
 */
document.addEventListener(mobileStatus ? 'touchmove' : 'mousemove', e => {
    if (!isMouseDown) return false
    const moveX = (mobileStatus ? e.touches[0].pageX : e.x) - startX//移动的距离
    if (moveX <= 0 || moveX + sliderWidth >= canvasWidth) return false//移动范围不能超过画布距离
    slider.style.left = `${moveX}px`
    block.style.left = `${moveX}px`
})
/**
 * 抬起
 */
document.addEventListener(mobileStatus ? 'touchend' : 'mouseup', e => {
    if (!isMouseDown) return false
    isMouseDown = false//不在按下
    if (Math.abs(parseInt(block.style.left) - x) <= 3) msg.innerHTML = '验证成功'//小于三像素误差则验证成功
    else {
        msg.innerHTML = '验证失败'
        setTimeout(reset, 1000)
    }
})
/**
 * 图片加载完成时加载的函数
 */
function imgLoad() {
    canvasCtx.drawImage(img, 0, 0, canvasWidth, canvasHeight)//绘画整张底层图片
    blockCtx.drawImage(img, 0, 0, canvasWidth, canvasHeight)//会话整张拼图图片
    const blockY = y - r * 2 + 2//计算拼图长宽
    const imgData = blockCtx.getImageData(x, blockY, sliderWidth, sliderWidth)//截取图片数据
    block.width = sliderWidth//让拼图变成拼图正常的大小
    blockCtx.putImageData(imgData, 0, blockY)//复制一份截取的图片
}
/**
 * 生成随机数
 * @param {Number} start 开始的数字
 * @param {Number} end 结束的数字
 * @returns 产生的随机数
 */
function getRandomNumberByRange(start, end) {
    return Math.round(Math.random() * (end - start) + start);
}
/**
 * 绘画拼图
 * @param {Object} ctx 画布对象
 * @param {String} operation 填充方式
 * @param {Number} x X轴坐标
 * @param {Number} y Y轴坐标
 */
function write(ctx, operation, x, y) {
    ctx.beginPath()//开始绘画
    ctx.moveTo(x, y)//移动
    ctx.lineTo(x + sliderLength / 2, y)//划线
    ctx.arc(x + sliderLength / 2, y - r + 2, r, 0, 2 * PI)//画圈
    ctx.lineTo(x + sliderLength / 2, y)
    ctx.lineTo(x + sliderLength, y)
    ctx.lineTo(x + sliderLength, y + sliderLength / 2)
    ctx.arc(x + sliderLength + r - 2, y + sliderLength / 2, r, 0, 2 * PI)
    ctx.lineTo(x + sliderLength, y + sliderLength / 2)
    ctx.lineTo(x + sliderLength, y + sliderLength)
    ctx.lineTo(x, y + sliderLength)
    ctx.lineTo(x, y)
    ctx.fillStyle = '#fff'//填充颜色
    ctx[operation]()
    ctx.beginPath()
    ctx.arc(x, y + sliderLength / 2, r, 1.5 * PI, 0.5 * PI)
    ctx.globalCompositeOperation = 'xor'//异或绘画，清除左边的半圆
    ctx.fill()
}

/**
 * 重置
 */
function reset() {
    msg.innerHTML = ''
    slider.style.left = 0
    block.style.left = 0
    canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight)//清楚画布
    blockCtx.clearRect(0, 0, canvasWidth, canvasHeight)
    block.width = canvasWidth;//恢复拼图长度，以免获取数据失败
    img.src = './yz.png';//图片路径
    draw()
}

/**
 * 绘画
 */
function draw() {
    x = getRandomNumberByRange(sliderWidth + 10, canvasWidth - (sliderWidth + 10))
    y = getRandomNumberByRange(10 + r * 2, canvasHeight - (sliderWidth + 10))
    write(canvasCtx, 'fill', x, y)
    write(blockCtx, 'clip', x, y)
}

draw()