// https://juejin.cn/post/7145447742515445791
let dragging = false
let cloneEl = null
let initial = {}
let queue = []

document.getElementById('list').addEventListener('mousedown', function (e) {
  e.preventDefault()
  if (e.target.classList.contains('item') && !cloneEl) {
    document.getElementById('app').classList.add('active')
    // 选中了元素
    cloneEl = e.target.cloneNode(true)
    cloneEl.classList.add('flutter')
    // 模拟一个随机大小的"原图"，实际业务中不存在
    const fakeSize = parseInt(100 * randomNum(3, 5))
    // 初始化数据
    init(e, { width: e.target.offsetWidth }, fakeSize, Math.random())
    // 加载"原图"
    simulate(cloneEl.src.replace(/w=100/g, 'w=' + fakeSize), initial.flag)

    e.target.parentElement.appendChild(cloneEl)
    dragging = true
    e.target.classList.add('hide') // 放在最后
    queue.push(() => {
      e.target.classList.remove('hide')
    })
  }
})

window.addEventListener("mousemove", (e) => {
  if (dragging && cloneEl) {
    moveFlutter(e.clientX - initial.offsetX, e.clientY - initial.offsetY, distance(e))
  }
})

document.getElementById('content').addEventListener("mouseup", (e) => {
  if (e.target.id !== 'content') {
    const lostX = e.x - document.getElementById('content').getBoundingClientRect().left
    const lostY = e.y - document.getElementById('content').getBoundingClientRect().top
    done(lostX, lostY)
  } else { done(e.offsetX, e.offsetY) }
})

// 鼠标抬起
window.addEventListener("mouseup", (e) => {
  dragging = false
  document.getElementById('app').classList.remove('active')
  setTimeout(() => { end() }, 10)
})
// 鼠标离开了视窗
document.addEventListener("mouseleave", (e) => {
  end()
})
// 用户可能离开了浏览器
window.onblur = () => {
  end()
}

// 结束处理（动画）
function end() {
  dragging = false
  if (!cloneEl) { return }
  cloneEl.classList.add('is_return')
  changeStyle([`left: ${initial.clientX - initial.offsetX}px`, `top: ${initial.clientY - initial.offsetY}px`, 'transform: scale(1)'])
  setTimeout(() => {
    queue.length && queue.shift()()
    cloneEl && cloneEl.remove()
    cloneEl = null
  }, 300)
}
// 完成处理
function done(x, y) {
  if (!cloneEl) { return }
  const newEl = cloneEl.cloneNode(true)
  newEl.classList.remove('flutter')
  newEl.src = cloneEl.getAttribute('raw')
  newEl.style.cssText = `left: ${x - initial.offsetX}px; top: ${y - initial.offsetY}px;`
  document.getElementById('content').appendChild(newEl)
  cloneEl.remove()
  cloneEl = null
  queue.length && queue.shift()()
}

// 改变漂浮元素（合并多个操作）
function moveFlutter(x, y, d = 0) {
  // const scale = null // TODO: 关闭缩放
  const scale = d ? initial.width + d <= initial.fakeSize ? `transform: scale(${(initial.width + d) / initial.width})` : null : null
  const options = [`left: ${x}px`, `top: ${y}px`]
  scale && options.push(scale)
  changeStyle(options)
}
function changeStyle(arr) {
  const original = cloneEl.style.cssText.split(';')
  original.pop()
  cloneEl.style.cssText = original.concat(arr).join(';') + ';'
}

// 记录鼠标初始化事件
function init({ offsetX, offsetY, clientX, clientY }, { width }, fakeSize, flag) {
  initial = { offsetX, offsetY, clientX, clientY, width, fakeSize, flag }
  moveFlutter(clientX - offsetX, clientY - offsetY)
}

// 计算两点之间距离
function distance({ clientX, clientY }) {
  const { clientX: x, clientY: y } = initial
  const b = clientX - x;
  const a = clientY - y;
  return Math.sqrt(Math.pow(b, 2) + Math.pow(a, 2))
}

// 加载原图通常需要时间，利用缓存来优化卡顿
function simulate(url, flag) {
  cloneEl.setAttribute('raw', url)
  const image = new Image()
  image.src = url
  image.onload = function () {
    // 异步任务，克隆节点可能会先被清理
    cloneEl && initial.flag === flag && (cloneEl.src = url)
  }
}

function randomNum(n, m) {
  return Math.random() * (m - n) + n
}