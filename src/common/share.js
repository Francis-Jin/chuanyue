
const wx = require('weixin-js-sdk')

export default {
  install (Vue) {
    Vue.prototype.weixinShare = function (shareObj) {
      let url = location.href.split('#')[0]

      console.log(url)

      let parm = this.$Qs.stringify({
        url: url
      })

      this.$api.getJsSingle(parm).then(res => {
        if (res.data.code * 1 === 200) {
          let d = res.data.data
          console.log(d)
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: d.appid, // 必填，公众号的唯一标识
            timestamp: d.timestamp, // 必填，生成签名的时间戳
            nonceStr: d.nonceStr, // 必填，生成签名的随机串
            signature: d.signature, // 必填，签名
            jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表
          })
          wx.ready(res => {
            console.log(res)
            // wx.openAddress({
            //   success: function (res) {
            //     console.log(res)
            // var userName = res.userName // 收货人姓名
            // var postalCode = res.postalCode // 邮编
            // var provinceName = res.provinceName // 国标收货地址第一级地址（省）
            // var cityName = res.cityName // 国标收货地址第二级地址（市）
            // var countryName = res.countryName // 国标收货地址第三级地址（国家）
            // var detailInfo = res.detailInfo // 详细收货地址信息
            // var nationalCode = res.nationalCode // 收货地址国家码
            // var telNumber = res.telNumber // 收货人手机号码
            //   }
            // })
          })
          wx.error(err => {
            console.log(err)
          })
        }
      })
    }
  }
}
