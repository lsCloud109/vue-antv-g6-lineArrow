import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI, { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import axios from 'axios'
/* axios请求超时 */
axios.defaults.timeout = 200000 // 正式环境
axios.defaults.retry = 2
axios.defaults.retryDelay = 1000
axios.interceptors.request.use(config => {
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})
axios.interceptors.response.use(undefined, function axiosRetryInterceptor (err) {
  var config = err.config
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '错误请求'
        break
      case 401:
        err.message = '未授权，请重新登录'
        break
      case 403:
        err.message = '拒绝访问'
        break
      case 404:
        err.message = '请求错误,未找到该资源(code:404)'
        break
      case 405:
        err.message = '请求方法未允许'
        break
      case 408:
        err.message = '请求超时'
        break
      case 500:
        err.message = '服务器端出错'
        break
      case 501:
        err.message = '网络未实现'
        break
      case 502:
        err.message = '网络错误'
        break
      case 503:
        err.message = '服务不可用'
        break
      case 504:
        err.message = '网络超时'
        break
      case 505:
        err.message = 'http版本不支持该请求'
        break
      default:
        err.message = `连接错误${err.response.status}`
    }
  } else {
    err.message = '连接到服务器失败'
  }

  if (!config || !config.retry) return Promise.reject(err)
  config.__retryCount = config.__retryCount || 0
  if (config.__retryCount >= config.retry) {
    Message({
      showClose: true,
      message: err.message,
      type: 'error',
      duration: 2000
    })
    return Promise.reject(err)
  }

  config.__retryCount += 1

  var backoff = new Promise(function (resolve) {
    setTimeout(function () {
      resolve()
    }, config.retryDelay || 1)
  })

  return backoff.then(function () {
    return axios(config)
  })
})
Vue.prototype.$axios = axios

// 定义表情方法
function toEmotion (text, isNoGif) {
  var list = ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '愉快', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', '不', '好', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极']

  if (!text) {
    return text
  }

  text = text.replace(/\[[\u4E00-\u9FA5]{1,3}\]/gi, function (word) {
    var newWord = word.replace(/\[|\]/gi, '')
    var index = list.indexOf(newWord)
    var backgroundPositionX = -index * 24
    var imgHTML = ''
    if (index < 0) {
      return word
    }

    if (isNoGif) {
      if (index > 104) {
        return word
      }
      imgHTML = `<i class="static-emotion" style="background:url(https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/default218877.gif) ${backgroundPositionX}px 0;"></i>`
    } else {
      var path = index > 104 ? '/img' : 'https://res.wx.qq.com/mpres/htmledition/images/icon'
      imgHTML = `<img class="static-emotion-gif" style="vertical-align: middle" src="${path}/emotion/${index}.gif">`
    }
    return imgHTML
  })
  return text
}

Vue.directive('emotion', {
  bind: function (el, binding) {
    el.innerHTML = toEmotion(binding.value)
  }
})

Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
