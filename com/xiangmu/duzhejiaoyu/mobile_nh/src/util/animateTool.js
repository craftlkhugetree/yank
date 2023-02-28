
const sliceNodeArr = (nodes, index = 0) => Array.prototype.slice.call(nodes, index)
// 参考https://github.com/daneden/animate.css
function animateCSS (node, animationName, callback) {
  node.classList.add('animated', animationName)
  function handleAnimationEnd () {
    node.classList.remove('animated', animationName)
    node.removeEventListener('animationend', handleAnimationEnd)
    if (typeof callback === 'function') callback()
  }
  node.addEventListener('animationend', handleAnimationEnd)
}
export function addAnimation ({
  className,
  animationName = 'fadeInUp',
  pageSize = 10
}) {
  sliceNodeArr(document.querySelectorAll(className), -pageSize).forEach(node => animateCSS(node, animationName))
}