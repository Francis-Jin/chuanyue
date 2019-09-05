const isIE = function () {
  return (window.navigator.userAgent.indexOf('MSIE') >= 1)
}

// 修复IE10及以下版本不支持dataset属性的问题，兼容transfer-dom.js中使用了dataset的问题
if (isIE() && window.HTMLElement) {
  if (Object.getOwnPropertyNames(HTMLElement.prototype).indexOf('dataset') === -1) {
    Object.defineProperty(HTMLElement.prototype, 'dataset', {
      get: function () {
        const attributes = this.attributes
        const name = [], value = []
        const obj = {}
        for (let i = 0; i < attributes.length; i++) {
          if (attributes[i].nodeName.slice(0, 5) === 'data-') {
            name.push(attributes[i].nodeName.slice(5))
            value.push(attributes[i].nodeValue)
          }
        }
        for (let j = 0; j < name.length; j++) {
          obj[name[j]] = value[j]
        }
        return obj
      }
    })
  }
}

// 禁止两指缩放页面
document.documentElement.addEventListener('touchstart', function (event) {
  if (event.touches.length > 1) {
    event.preventDefault()
  }
}, false)

// 禁止双击放大页面
let lastTouchEnd = 0
document.documentElement.addEventListener('touchend', function (event) {
  const now = Date.now()
  if (now - lastTouchEnd <= 300) {
    event.preventDefault()
  }
  lastTouchEnd = now
}, false)
