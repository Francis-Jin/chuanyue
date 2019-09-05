<template>
    <!-- 微信授权页面 -->
    <div>

    </div>
</template>

<script>

export default {
  data () {
    return {
      token: '',
      urls: ''
    }
  },
  mounted () {
  },
  created () {
    this.logins()
  },
  methods: {

    logins () {
      this.$toast.loading({
        mask: true,
        message: '获取微信授权中...',
        duration: 0
      })

      console.log(this.$store.state.userData.appId)
      this.token = window.localStorage.getItem('userToken')

      // 判断当前的url有没有token参数,如果不存在那就跳转到微信授权的url
      if (this.token) {
        // 直接进入
        this.$router.push({
          path: 'circulateIndex'
        })
      } else {
        // 判断是否为已经获取授权
        if (this.GetQueryString('code')) {
          this.wxLogin()
          console.log('进入登录')
        } else {
          const pageUrl = window.location.href
            .replace(/[/]/g, '%2f')
            .replace(/[:]/g, '%3a')
            .replace(/[#]/g, '%23')
            .replace(/[&]/g, '%26')
            .replace(/[=]/g, '%3d')
          const url =
                'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.$store.state.userData.appId + '&redirect_uri=' + pageUrl +
                '&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect'
          window.location.href = url
        }
      }
    },

    // 获取地址栏参数
    GetQueryString (name) {
      const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      const r = window.location.search.substr(1).match(reg)
      if (r != null) { return unescape(r[2]) }
      return null
    },

    // 微信登录
    wxLogin () {
      let param = this.$Qs.stringify({code: this.GetQueryString('code')})
      console.log(param)
      this.$toast.clear()
      this.$api.getOIDApi(param).then((res) => {
        console.log(res)
        // this.$router.push({
        //   path: '/author'
        // })
      }).catch((error) => {
        console.log('网络错误' + error)
      })
    }

  }

}
</script>
