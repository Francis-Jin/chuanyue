<template>
    <div>
        <div style="height: 60px;"></div>
        <div class="footerBar">
            <div v-for="(item, index ) in navData.list" :key="index" class="item" :class="navData.active === index ? 'active' : ''" @click="toggle(index)">
                <div class="iconWrap">
                    <i class="iconfont" :class="item.icon"></i>
                </div>
                <div class="text">
                    <span>{{item.text}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: ['curIndex'],
  data () {
    return {
      userIdentity: localStorage.getItem('identity') * 1,
      navData: {
        // 当前选项
        active: parseInt(this.curIndex),

        // 选项列表
        list: []

      }

    }
  },
  mounted () {
    this.setFooterBar()
  },
  methods: {

    /** 设置底部导航. */
    setFooterBar () {
      if (!this.userIdentity || this.userIdentity === 3 || this.userIdentity === 2) {
        this.navData.list = [
          {
            text: '首页',
            url: '/circulateIndex',
            icon: 'icon-home'
          },
          {
            text: '拍照上传',
            url: '/uploadIndex',
            icon: 'icon-paizhao'
          },
          {
            text: '个人中心',
            url: '/myCenterIndex',
            icon: 'icon-me'
          }
        ]
      } else {
        this.navData.list = [
          {
            text: '首页',
            url: '/circulateIndex',
            icon: 'icon-home'
          },
          {
            text: '作品上传',
            url: '/teacherUpload?title=作品上传',
            icon: 'icon-paizhao'
          },
          {
            text: '个人中心',
            url: '/myCenterIndex',
            icon: 'icon-me'
          }
        ]
      }
    },

    /** 底部文字、icon设置. */
    setFooterBarTextFn () {
      if (this.userIdentity === 1) {
        this.navData.list[1].text = '作品上传'
      } else if (this.userIdentity === 2) {
        this.navData.list[1].text = '优惠专区'
        this.navData.list[1].icon = 'icon-shouye'
      }
    },

    /** 跳转. */
    toggle (index) {
      // if (this.userIdentity === 1 && index === 1) {
      //   this.$router.push({
      //     path: ''
      //   })
      //   return false
      // } else if (this.userIdentity === 2 && index === 1) {
      //   this.$router.push({
      //     path: '/preferentialZone',
      //     query: {
      //       'showFooterBar': true
      //     }
      //   })
      //   return false
      // } else {
      this.$router.push({

        path: this.navData.list[index].url

      })
      // }
    }
  }

}
</script>

<style scoped lang="less">
    .footerBar {
        position: fixed;
        bottom: 0;
        left: 0;
        height: 60px;
        width: 100%;
        background: #ffffff;
        z-index: 12;
        display: flex;
        justify-content: space-between;
        box-shadow: 0 -4px 10px rgba(219,219,219,.6);
        .item{
            width: 33%;
            height: 100%;
            text-align: center;
            color: #C3C3C3;
            &.active{
                color: #0069FF;
                .text{
                    font-size: .26rem;
                }
            }
            .iconWrap{
                padding: 8px 0 0px;
            }
            .text{
                font-size: .22rem;
            }
        }
    }
</style>
