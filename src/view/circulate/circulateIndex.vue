<template>
    <div>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">

            <div class="minHeightBox" style="min-height: 100vh;">

                <div class="main">
                    <Banner></Banner>

                    <div v-if="showModalStatus" class="barWrap">

                        <div v-if="userIdentity === 1" class="teacherNavs navs">
                            <div class="item" v-for="(item,index) in teacherNavLists" :key="index"
                                 @click="toggle(index)">
                                <div class="imgIcon">
                                    <img :src="item.icon" alt="">
                                </div>
                                <div class="navText">
                                    <span>{{item.name}}</span>
                                </div>
                            </div>
                        </div>

                        <div v-if="userIdentity === 2" class="ParentNavs navs">
                            <div class="item" v-for="(item,index) in parentNavLists" :key="index"
                                 @click="toggle(index)">
                                <div class="imgIcon">
                                    <img :src="item.icon" alt="">
                                </div>
                                <div class="navText">
                                    <span>{{item.name}}</span>
                                </div>
                            </div>
                        </div>

                        <div v-if="userIdentity === 3" class="navs">
                            <div class="item" v-for="(item,index) in navDataLists" :key="index" @click="toggle(index)">
                                <div class="imgIcon">
                                    <img :src="item.img" alt="">
                                </div>
                                <div class="navText">
                                    <span>{{item.text}}</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="contentWrap">
                        <div class="hotNews">
                            <div class="hotNavs">
                                <div v-for="(item, index) in newsTypeLists"
                                     :key="index"
                                     class="item margin_right_10"
                                     :class="hotActive == index ? 'active': ''"
                                     @click="hotNavFn(index, item.code)">
                                    <span>{{item.name}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="contentLists">

                            <div class="item" v-for="(item,index) in contentLists" :key="index"
                                 @click="toDetails(item.id)">
                                <div class="imgWrap">
                                    <img :src="imgApi + item.cover" alt="">
                                </div>
                                <div class="textWrap">
                                    <div class="title overflow2">
                                        <span>{{item.title}}</span>
                                    </div>
                                    <div class="time">
                                        <div class="l"><span>{{item.newsTime}}</span></div>
                                        <div class="r">
                                            <van-icon name="eye-o"/>
                                            <span>{{item.clickTimes}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div style="height: 60px;line-height: 60px;text-align: center;color: #999;font-size: .26rem;">
                            <van-loading v-if="tips===0" size="24px">加载中...</van-loading>
                            <span v-if="tips===1">没有更多了</span>
                        </div>
                    </div>
                </div>

            </div>

        </van-pull-refresh>
        <FooterBar :curIndex='0'></FooterBar>

    </div>
</template>

<script>
import FooterBar from '../../components/footerBar'
import Banner from '../../components/banner'
import BindUser from '../../components/bindUser'

export default {
  components: {
    FooterBar,
    Banner,
    BindUser
  },
  data () {
    return {
      showModalStatus: false,
      imgApi: this.GLOBAL.BEFORE_IMG_URL,
      userIdentity: 0,
      hotActive: 0,
      isLoading: false,
      teacherNavLists: [
        {
          name: '作品上传',
          icon: require('../../assets/icon/js_zpsc.png'),
          url: '/teacherUpload?title=作品上传'
        },
        {
          name: '批改列表',
          icon: require('../../assets/icon/js_pglb.png'),
          url: 'teacherUpload?title=批改列表'
        },
        {
          name: '班级管理',
          icon: require('../../assets/icon/js_bjgl.png'),
          url: 'administrationClass'
        },
        {
          name: '学员管理',
          icon: require('../../assets/icon/js_xygl.png'),
          url: '/classDetails?headTop=true&title=学员管理'
        }
      ],
      parentNavLists: [
        {
          name: '作文批改',
          icon: require('../../assets/icon/pg.png'),
          url: '/uploadExcellent?isWhat=1'
        },
        {
          name: '作文精批',
          icon: require('../../assets/icon/jp.png'),
          url: '/uploadExcellent?isWhat=2'
        },
        {
          name: '同步辅导',
          icon: require('../../assets/icon/fd.png'),
          url: '/uploadExcellent?isWhat=3'
        },
        {
          name: '批改报告',
          icon: require('../../assets/icon/jp.png'),
          // url: '/teacherUpload?title=批改报告'
          url: '/resultSearchPage?title=批改报告&category=0'
        },
        {
          name: '能力测评',
          icon: require('../../assets/icon/nl.png'),
          url: 'abilityTesting'
        },
        {
          name: '传阅商城',
          icon: require('../../assets/icon/yh.png'),
          url: '/preferentialZone'
        }
      ],
      navDataLists: [
        {
          text: '作文批改',
          img: require('../../assets/icon/pg.png'),
          url: '/uploadExcellent?isWhat=1'
        },
        {
          text: '作文精批',
          img: require('../../assets/icon/jp.png'),
          url: '/uploadExcellent?isWhat=2'
        },
        {
          text: '同步辅导',
          img: require('../../assets/icon/fd.png'),
          url: '/uploadExcellent?isWhat=3'
        },
        {
          text: '批改报告',
          img: require('../../assets/icon/result.png'),
          url: '/resultSearchPage?title=批改报告&category=0'
        },
        {
          text: '能力测评',
          img: require('../../assets/icon/nl.png'),
          url: 'abilityTesting'
        },
        {
          text: '传阅商城',
          img: require('../../assets/icon/yh.png'),
          url: 'preferentialZone'
        }
      ],
      LISTS_LIMIT: 10,
      newsTypeLists: [],
      contentLists: [],
      timer: null,
      thisType: 1,
      page: 1,
      showNotData: false,
      tips: 0
    }
  },
  created () {
    if (!this.$route.query.clear) {
      localStorage.clear()
    }
    if (localStorage.getItem('oid') === 'undefined' || !localStorage.getItem('oid')) {
      localStorage.setItem('oid', this.$route.query.OID)
    }
    this.getUrserInfoData()
    document.title = '传阅语文学习平台'
  },
  mounted () {
    document.documentElement.scrollTop = 0
    this.immediatelyFn()
    this.getHotArticle()
    this.getNewsStatusApi()
  },
  methods: {
    /** 设置下拉刷新. */
    onRefresh () {
      setTimeout(() => {
        this.page = 1
        this.contentLists = []
        let parms = {
          'page': 1,
          'limit': this.LISTS_LIMIT,
          'type': this.thisType,
          'openId': localStorage.getItem('oid')
        }
        this.$api.getHotArticle(this.$Qs.stringify(parms)).then((res) => {
          if (res.data.code * 1 === 200) {
            this.contentLists = this.contentLists.concat(res.data.data)
            // this.$toast('刷新成功')
          }
        }).catch((error) => {
          this.$toast.clear()
          console.log('发生错误！', error)
        })
        this.isLoading = false
      }, 300)
    },

    //  获取最新资讯和好文推荐
    getHotArticle () {
      let parms = {
        'page': this.page,
        'limit': this.LISTS_LIMIT,
        'type': this.thisType,
        'openId': localStorage.getItem('oid')
      }
      if (this.tips === 0) {
        this.$api.getHotArticle(this.$Qs.stringify(parms)).then((res) => {
          if (res.data.code * 1 === 200) {
            if (res.data.data.length > 0) {
              this.contentLists = this.contentLists.concat(res.data.data)
              if (res.data.data.length > 9) {
                this.tips = 0
              } else {
                this.tips = 1
              }
            } else {
              this.tips = 1
            }
          } else {
            this.tips = 1
          }
        }).catch((error) => {
          this.$toast.clear()
          console.log('发生错误！', error)
        })
      }
    },

    /* eslint-disable */
    // 导航跳转
      toggle (index) {
          let parentUrl = this.parentNavLists[index].url == 'abilityTesting'
          let ordinaryUrl = this.navDataLists[index].url == 'abilityTesting'
          if ((parentUrl && this.userIdentity == 2) || (ordinaryUrl && this.userIdentity == 3)) {
              this.$toast.fail({
                  message: '该功能暂未开放',
                  duration: 500
              })
              return false
          }

          if (this.userIdentity === 1) {
              let isTrue = false
              if (index * 1 === 1) isTrue = true
              this.$router.push({
                  path: this.teacherNavLists[index].url,
                  query: {
                      'hideAddUpload': isTrue,
                      'showFooterBar': true
                  }
              })
          } else if (this.userIdentity === 2) {
              this.$router.push({
                  path: this.parentNavLists[index].url,
                  query: {
                      'hideAddUpload': true,
                      'userIdent': 'parent'
                  }
              })
              return false
          } else {
              this.$router.push({
                  path: this.navDataLists[index].url
              })
          }
      },

      /** 获取新闻分类. */
      getNewsStatusApi () {
          this.$api.getNewsStatusApi().then(res => {
              if (res.data.code * 1 === 200) {
                  this.newsTypeLists = res.data.data
              }
          })
      },

//  最新资讯和热门文字切换
      hotNavFn (index, code) {
          console.log('点击切换调')
          document.documentElement.scrollTop = 0
          this.hotActive = index
          this.page = 1
          this.thisType = code
          this.tips = 0
          this.contentLists = []
          this.getHotArticle()
      },

//  滚动触底函数
      isScrollBottom () {
          let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
          let clientHeight = document.documentElement.clientHeight
          let scrollHeight = document.documentElement.scrollHeight
          if (scrollTop + clientHeight >= scrollHeight - 1) { // 如果滚动到接近底部，自动加载下一页
              clearTimeout(this.timer)
              this.timer = setTimeout(() => {
                  this.page++
                  console.log('触底调用')
                  let parms = {
                      'page': this.page,
                      'limit': this.LISTS_LIMIT,
                      'type': this.thisType,
                      'openId': localStorage.getItem('oid')
                  }
                  if (this.tips === 0) {
                      this.$api.getHotArticle(this.$Qs.stringify(parms)).then((res) => {
                          if (res.data.code * 1 === 200) {
                              if (res.data.data.length > 0) {
                                  this.tips = 0
                                  this.contentLists = this.contentLists.concat(res.data.data)
                              } else {
                                  this.tips = 1
                              }
                          }
                      }).catch((error) => {
                          console.log('发生错误！', error)
                      })
                  }
              }, 500)
          }
      },

//    跳转到详情页面
      toDetails (id) {
          this.$router.push({
              path: 'hotDetails',
              query: {
                  'articleId': id
              }
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
                  } else if (code === 7) {
                      this.userIdentity = 2
                      localStorage.setItem('identity', '2')
                  } else {
                      this.userIdentity = 3
                      localStorage.setItem('identity', '3')
                  }
                  this.showModalStatus = true
              } else {
                  this.showModalStatus = true
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
                  } else if (userInfo.roleIdStr === '7') {
                      this.userIdentity = 2
                      localStorage.setItem('identity', '2')
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
                  } else {
                      alert('该账户未查询到角色，请联系管理员')
                  }
                  this.showModalStatus = true
                  this.userInfo = userInfo

                  if (userInfo.photoUrl.indexOf('http') === -1) userInfo.photoUrl = this.GLOBAL.BEFORE_IMG_URL + userInfo.photoUrl

                  this.userInfoPhotoUrl = userInfo.photoUrl

                  sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
              }
          })
      },
      /* eslint-disable */

        //  进页面内须立即调用的方法
      immediatelyFn () {
          window.addEventListener('scroll', this.isScrollBottom) // 滚动到底部，再加载的处理事件
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

        },
        beforeDestroy () {
            window.removeEventListener('scroll', this.isScrollBottom) // 离开页面时移除
        }
    }

</script>

<style scoped lang="less">

    .main {
        min-height: 100vh;
        background: #f5f5f5;
    }

    /* 导航 */
    .navs {
        width: 100%;
        /*padding: 10px 0 0;*/
        background: #fff;
        &.teacherNavs {
            .item {
                width: 25%;
            }
        }

        .item {
            float: left;
            width: 33%;
            text-align: center;
            margin-bottom: 10px;

            .imgIcon {
                width: 50px;
                height: 50px;
                font-size: 0;
                margin: 0 auto;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .navText {
                font-size: .24rem;
                color: #999999;
            }
        }

        &:after {
            content: "";
            display: block;
            clear: both;
        }
    }

    /* 内容 */
    .contentWrap {
        width: 100%;
        background: #fff;
        margin-top: 10px;
        .hotNews {
            width: 100%;

            .hotNavs {
                display: flex;
                /*box-sizing: border-box;*/
                padding: 0 20px;

                position: relative;
                &::after{
                    display: block;
                    content: "";
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    border-bottom: 1px solid #cdcdcd;
                    transform: scaleY(.3);
                }
                .item {
                    text-align: center;
                    color: #666;
                    padding-top: 10px;
                    padding-bottom: 10px;
                    position: relative;
                    span {
                        position: relative;
                        z-index: 2;
                        font-size: .24rem;
                    }

                    &.active {
                        color: #4276DF;

                        span {
                            font-size: .32rem;
                            font-weight: 900;
                        }

                        &:after {
                            position: absolute;
                            content: "";
                            left: 0;
                            bottom: 0px;
                            display: block;
                            width: 100%;
                            height: 2px;
                            /*border-radius: 3px;*/
                            background: #4276DF;
                            z-index: 2;
                        }
                    }
                }
            }
        }

        .contentLists {

            .item {
                display: flex;
                height: 100px;
                box-sizing: border-box;
                padding: 10px 20px;
                position: relative;
                &::after{
                    display: block;
                    content: "";
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    border-bottom: 1px solid #cdcdcd;
                    transform: scaleY(.3);
                }
                .imgWrap {
                    width: 25%;
                    font-size: 0;
                    box-sizing: border-box;
                    padding: .1rem;

                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 10px;
                    }
                }

                .textWrap {
                    width: 75%;
                    position: relative;

                    .title {
                        width: 100%;
                        margin-top: 6px;
                        color: #333333;
                        box-sizing: border-box;
                        padding-left: 10px;
                        font-size: .28rem;
                    }

                    .time {
                        position: absolute;
                        left: 0;
                        box-sizing: border-box;
                        padding-left: 10px;
                        bottom: 6px;
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        line-height: .5rem;
                        color: #999;

                        .r {
                            i {
                                position: relative;
                                top: 2px;
                                margin-right: 6px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
