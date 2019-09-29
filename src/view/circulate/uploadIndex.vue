<template>
    <div v-if="showContent">
        <Banner></Banner>

        <div class="main">

            <div class="example">
                <!--<span>上传类型</span>-->
            </div>

            <div class="uploadType">
                <!--<div class="item" :class="activeIndex === index ? 'active' : ''" v-for="(item,index) in typeLists" :key="index" @click="toTarget(index)">-->
                <div class="item" :class="activeIndex === index ? 'active' : ''" v-for="(item,index) in typeLists" :key="index" @click="toPage(index)">
                    <span>{{item.text}}</span>
                </div>
            </div>

            <!--<div class="next" @click="toPage">
                <span>下一步</span>
            </div>-->

            <div style="height: 70px;"></div>

        </div>

        <FooterBar :curIndex = '1'></FooterBar>
    </div>
</template>

<script>
import FooterBar from '../../components/footerBar'
import Banner from '../../components/banner'

export default {
  components: {
    FooterBar,
    Banner
  },
  data () {
    return {
      showContent: false,
      pageUrl: '',
      activeIndex: '',
      typeLists: [
        {
          text: '作文批改',
          url: '/uploadExcellent?isWhat=1'
        },
        {
          text: '作文精批',
          url: '/uploadExcellent?isWhat=2'
        },
        {
          text: '同步辅导',
          url: '/uploadExcellent?isWhat=3'
        }
      ]
    }
  },
  mounted () {
    if (!this.$route.query.clear) {
      localStorage.clear()
    }
    if (localStorage.getItem('oid') === 'undefined' || !localStorage.getItem('oid')) {
      localStorage.setItem('oid', this.$route.query.OID)
    }
    document.title = '拍照上传'
    this.getUrserInfoData()
    // this.simpleGetChildresDetails()
    /** 初始哈jssdk. */
    this.initJssdk()
  },
  methods: {
    toTarget (index) {
      this.activeIndex = index
      this.pageUrl = this.typeLists[index].url
    },

    /** 判断类型然后跳转. */
    toPage (index) {
      this.$router.push({
        path: this.typeLists[index].url
      })
    },

    /** 判断用户是否认证. */
    getAuthenticationStatus (id) {
      let parm = this.$Qs.stringify({
        userId: id
      })
      this.$api.getAuthenticationStatusApi(parm).then(res => {
        if (res.data.code * 1 === 200) {
          let code = res.data.data * 1
          if (code === 6) {
            this.userIdentity = 1
            localStorage.setItem('identity', '1')
            this.$router.push({
              path: '/teacherUpload?title=作品上传'
            })
          } else if (code === 7) {
            this.userIdentity = 2
            localStorage.setItem('identity', '2')
          } else {
            this.userIdentity = 3
            localStorage.setItem('identity', '3')
          }
        } else {
          localStorage.setItem('identity', '')
        }
      })
    },

    /** 获取用户信息并存储. */
    getUrserInfoData () {
      let parm = this.$Qs.stringify({
        openId: localStorage.getItem('oid')
      })
      this.$api.getUrserInfoApi(parm).then((res) => {
        if (res.data.code * 1 === 200) {
          const userInfo = res.data.data

          /** 判断用户是否验证. */
          // this.getAuthenticationStatus(userInfo.id)

          if (userInfo.roleIdStr === '6') {
            this.userIdentity = 1
            localStorage.setItem('identity', '1')
            this.$router.push({
              path: '/teacherUpload?title=作品上传'
            })
          } else if (userInfo.roleIdStr === '7') {
            this.userIdentity = 2
            localStorage.setItem('identity', '2')
            this.showContent = true
          } else if (userInfo.roleIdStr === '8') {
            if (userInfo.phone) {
              console.log('已认证认证')
              this.userIdentity = 3
              localStorage.setItem('identity', '3')
            } else {
              console.log('未认证')
              this.userIdentity = 3
              localStorage.setItem('identity', '')
            }
            this.showContent = true
          } else {
            alert('该账户未查询到角色，请联系管理员')
          }
          this.userInfo = userInfo

          if (userInfo.photoUrl.indexOf('http') === -1) userInfo.photoUrl = this.GLOBAL.BEFORE_IMG_URL + userInfo.photoUrl

          this.userInfoPhotoUrl = userInfo.photoUrl

          sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
        }
      })
    },
    /* eslint-disable */
      /** 初始哈jssdk. */
      initJssdk () {
          let url = window.location.href.split('#')[0]
          let parm = this.$Qs.stringify({
              url: url
          })
          //  路由全局 注入config
          this.$api.getJsSingle(parm).then(res => {
              if (res.data.code * 1 === 200) {
                  let data = res.data.data
                  wx.config({
                      // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                      debug: false,
                      // 必填，公众号的唯一标识
                      appId: data.appid,
                      // 必填，生成签名的时间戳
                      timestamp: data.timestamp,
                      // 必填，生成签名的随机串
                      nonceStr: data.nonceStr,
                      // 必填，签名
                      signature: data.signature,
                      // 必填，需要使用的JS接口列表，所有JS接口列表
                      jsApiList: [
                          'scanQRCode',
                          'chooseImage',
                          'previewImage',
                          'uploadImage'
                      ]
                  })
                  wx.ready(function () {

                  })
                  wx.error(function (res) {
                      // alert(JSON.stringify(res))
                  })
              }
          })
      },
  }
}
</script>

<style scoped lang="less">
    .main{
        .example{
            height: 60px;
            line-height: 60px;
            text-indent: 10%;
        }
        .uploadType{
            width: 200px;
            margin: 0 auto;
            .item{
                width: 100%;
                height: 40px;
                line-height: 40px;
                margin-bottom: 20px;
                text-align: center;
                border-radius: 20px;
                border: 1px solid #2D7CED;
                color: #2D7CED;
                &.active{
                    background: #2D7CED;
                    color: #fff;
                }
            }
        }
        .next{
            width: 100%;
            height: 50px;
            background: #2d7ced;
            color: #fff;
            font-size: .32rem;
            line-height: 50px;
            text-align: center;
            margin-top: 30px;
        }

    }

</style>
