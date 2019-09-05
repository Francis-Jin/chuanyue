<template>
    <div>
        <div class="lists_wrap">
            <van-tabs
                color="#2182F0"
                sticky
                swipeable
                @change="tabsChangeFn($event)"
            >
                <van-tab
                    v-for="item in statusLists"
                    :key="item.code"
                    :title="item.name"
                >
                    <div v-if="showNotdata" class="orderListWrap">
                        <div
                            class="item"
                            v-for="(item, index) in orderLists"
                            :key="index"
                        >
                            <div class="wrap" @click="toOrderDetails(item.id)">
                                <div class="details border_bottom_1">
                                    <div class="left">
                                        订单号：<span>{{ item.id }}</span>
                                    </div>
                                    <div class="right">
                                        <span
                                            v-if="item.status === 1"
                                            style="color: #e13d13"
                                            >{{ item.statusName }}</span
                                        >
                                        <span v-else>{{
                                            item.statusName
                                        }}</span>
                                    </div>
                                </div>
                                <div class="details border_bottom_1">
                                    <div class="left">
                                        购买数量：<span>{{
                                            item.quantity
                                        }}</span>
                                    </div>
                                    <div class="right">
                                        下单时间：<span>{{
                                            formatDate(item.createTime)
                                        }}</span>
                                    </div>
                                </div>
                                <div class="details border_bottom_1">
                                    <div class="left">
                                        平台减免：<span>{{
                                            item.platformAmount
                                        }}</span>
                                    </div>
                                    <div class="right">
                                        商品总额：<span class="price"
                                            ><i
                                                class="iconfont icon-moneyrmb"
                                            ></i
                                            >{{ item.productAmount }}</span
                                        >
                                    </div>
                                </div>
                                <div class="details border_bottom_1">
                                    <div class="left"></div>
                                    <div class="right">
                                        实付金额：<span class="price"
                                            ><i
                                                class="iconfont icon-moneyrmb"
                                            ></i
                                            >{{ item.orderAmount }}</span
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="!showNotdata" class="notData">
                        <span class="color_999">暂无数据</span>
                    </div>
                </van-tab>
            </van-tabs>

            <div v-if="showNotdata && orderLists.length > 10" style="height: 60px;line-height: 60px;text-align: center;color: #999; background: #f5f5f5;font-size: .26rem;">
                <van-loading v-if="tips === 0" size="24px"
                    >加载中...</van-loading
                >
                <span v-if="tips === 1">没有更多了</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      statusLists: [
        {
          code: 0,
          name: '全部'
        }
      ],
      pageNum: 1,
      showNotdata: true,
      orderLists: [],
      tips: 0,
      thisCode: 0
    }
  },

  mounted () {
    this.getAllOrderStatus()
    this.getOrderLists(0)
    this.backMyCenter()
    /** 滚动到底部，再加载的处理事件. */
    window.addEventListener('scroll', this.isScrollBottom)
  },

  methods: {
    /** 返回到个人中心. */
    backMyCenter () {
      let that = this
      window.onpopstate = function () {
        if (document.title === '提交订单') {
          that.$router.push({
            path: '/myCenterIndex'
          })
        }
      }
    },

    /** 获取所有订单状态. */
    getAllOrderStatus () {
      this.$api.getAllOrderStatusApi().then(res => {
        if (res.data.code * 1 === 200) {
          let lists = res.data.data.slice(0, 4)
          this.statusLists = this.statusLists.concat(lists)
        }
      })
    },

    /** 时间戳转日期. */
    formatDate (time) {
      const now = new Date(time)
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      const date = now.getDate()
      const hour = now.getHours()
      const minute = now.getMinutes()
      // const second = now.getSeconds()
      return year + '-' + month + '-' + date + ' ' + hour + ':' + minute
      // return year + '-' + month + '-' + date
    },

    /** 跳转订单详情页面. */
    toOrderDetails (orderId) {
      this.$router.push({
        path: '/orderDetails',
        query: {
          orderId: orderId
        }
      })
    },

    /** 获取订单列表. */
    getOrderLists () {
      let parms = this.$Qs.stringify({
        status: this.thisCode,
        page: this.pageNum,
        limit: this.GLOBAL.LISTS_LIMIT,
        createUser: JSON.parse(sessionStorage.getItem('userInfo')).id
      })
      this.$api.getOrderListsApi(parms).then(res => {
        if (res.data.code * 1 === 200) {
          if (res.data.data.length > 0) {
            this.tips = 0
            this.orderLists = this.orderLists.concat(res.data.data)
          } else {
            this.tips = 1
          }
          if (this.orderLists.length !== 0) {
            this.showNotdata = true
          } else {
            this.showNotdata = false
          }
        }
      })
    },

    /** 点击切换时. */
    tabsChangeFn (e) {
      let code = this.statusLists.filter((item, i) => i === e)[0].code
      this.thisCode = code
      this.pageNum = 1
      this.orderLists = []
      this.getOrderLists()
    },

    //  滚动触底函数
    isScrollBottom () {
      let scrollTop =
                document.documentElement.scrollTop || document.body.scrollTop
      let clientHeight = document.documentElement.clientHeight
      let scrollHeight = document.documentElement.scrollHeight
      if (scrollTop + clientHeight >= scrollHeight - 1) {
        // 如果滚动到接近底部，自动加载下一页
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.pageNum++
          console.log('触底调用')

          if (this.tips === 0) {
            this.getOrderLists()
          }
        }, 500)
      }
    }

    /** end. */
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.isScrollBottom) // 离开页面时移除
  }
}
</script>

<style scoped lang="less">
.lists_wrap {
    box-sizing: border-box;
}
.orderListWrap {
    border-top: 1px solid #ededed;
    width: 100%;
    padding-top: 10px;
    min-height: 100vh;
    padding-bottom: 10px;
    background: #f5f5f5;
    .item {
        box-sizing: border-box;
        padding: 0.2rem;
        background: #fff;
        margin-bottom: 10px;
        .details {
            display: flex;
            justify-content: space-between;
            padding-bottom: 0.1rem;
            .left,
            .right {
                color: #666;
                font-size: 0.28rem;
                span {
                    font-size: 0.32rem;
                    color: #999;
                    &.price {
                        color: #e13d13;
                    }
                    i {
                        font-size: 0.28rem;
                    }
                }
            }
        }
    }
}

.notData {
    line-height: 5rem;
    text-align: center;
    color: #999;
    min-height: 100vh;
    background: #f5f5f5;
}
</style>
