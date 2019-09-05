<template>
    <div>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <div class="searchWrap">
                <van-sticky>
                    <van-search placeholder="搜索" v-model="searchValue" @search="onSearch" />
                </van-sticky>
            </div>
            <div class="lists" v-if="showNotData">
                <div class="item"
                     v-for="(item,index) in info"
                     :key="index"
                     @click="toCorrectionDetails(item.id, item.status, item.auditStatus,item.correctTypeName)">
                    <p>批次号：{{item.batchNumber}}</p>
                    <div class="resultType">
                        <div class="l">
                            <span>学员姓名：<span>{{item.studentName}}</span></span>
                        </div>
                        <div class="l">
                            <span>批改类型：<span>{{item.correctTypeName}}</span></span>
                        </div>
                    </div>
                    <div class="resultType">
                        <div class="l">
                            <span>上传时间：<span>{{formatDate(item.createTime)}}</span></span>
                        </div>
                        <div class="l">作业状态：
                            <van-tag type="primary" v-if="item.status == 0">待批改</van-tag>
                            <van-tag color="#FF976A" v-if="item.status == 1">批改中</van-tag>
                            <span v-if="item.status == 2">
                                <van-tag color="#FF976A" v-if="item.auditStatus == 0">待审核</van-tag>
                                <van-tag type="success" v-if="item.auditStatus == 1">通过</van-tag>
                                <van-tag type="danger" v-if="item.auditStatus == 2">未通过</van-tag>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="notData" v-if="!showNotData">
                <span>暂无数据！</span>
            </div>
        </van-pull-refresh>

        <div v-if="showNotdata && info.length > 4" style="height: 60px;line-height: 60px;text-align: center;color: #999; background: #f5f5f5;font-size: .26rem;">
            <van-loading v-if="tips === 0" size="24px"
            >加载中...</van-loading
            >
            <span v-if="tips === 1">没有更多了</span>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      info: [],
      searchValue: '',
      isLoading: false,
      showNotData: true,
      category: this.$route.query.category,
      titleHead: this.$route.query.title,
      pageNum: 1,
      tips: 0,
      showNotdata: false
    }
  },

  mounted () {
    document.title = this.titleHead
    this.getResult()
    /** 滚动到底部，再加载的处理事件. */
    window.addEventListener('scroll', this.isScrollBottom)
  },

  methods: {

    /** 下拉刷新. */
    onRefresh () {
      setTimeout(() => {
        this.searchValue = ''
        this.info = []
        this.pageNum = 1
        this.getResult()
        this.isLoading = false
      }, 300)
    },

    /** 搜索. */
    onSearch () {
      this.info = []
      this.pageNum = 1
      this.getResult()
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

    /** 获取数据列表. */
    getResult () {
      let parms = this.$Qs.stringify({
        correctType: this.category,
        createUser: JSON.parse(sessionStorage.getItem('userInfo')).id,
        studentName: this.searchValue,
        page: this.pageNum,
        limit: this.GLOBAL.LISTS_LIMIT
      })

      this.$api.getSearchResultApi(parms).then(res => {
        if (res.data.code * 1 === 200) {
          if (res.data.data.length > 0) {
            this.tips = 0
            this.info = this.info.concat(res.data.data)
          } else {
            this.tips = 1
          }
          if (this.info.length !== 0) {
            this.showNotdata = true
          } else {
            this.showNotdata = false
          }
        }
      })
    },

    /** 跳转查看详情. */
    toCorrectionDetails (id, status, auditStatus, correctType) {
      if (status === 0 || status === 1) {
        this.$toast({
          message: status === 0 ? '待批改' : '正在批改中',
          duration: 300
        })
        return false
      }

      if (auditStatus === 0 || auditStatus === 2) {
        this.$toast({
          message: auditStatus === 0 ? '待审核' : '审核未通过',
          duration: 1000
        })
        return false
      }

      if (correctType === '同步辅导') {
        this.$router.push({
          path: '/synchronizationDetails',
          query: {
            itemId: id
          }
        })
      } else {
        this.$router.push({
          path: '/correctionDetailsInfo',
          query: {
            itemId: id
          }
        })
      }
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
          if (this.tips === 0) {
            this.getResult()
          }
        }, 500)
      }
    }

    /** end。 */
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.isScrollBottom) // 离开页面时移除
  }
}
</script>

<style scoped lang="less">

    .notData{
        line-height: 6rem;
        text-align: center;
        color: #999;
    }

    .lists{
        box-sizing: border-box;
        padding-top: .2rem;
        padding-bottom: .01rem;
        font-size: .28rem;
        background: #f5f5f5;
        .item{
            width: 96%;
            margin: 0 auto .3rem;
            box-sizing: border-box;
            padding-bottom: 1px;
            border-radius: .1rem;
            overflow: hidden;
            position: relative;
            background: #fff;
            p{
                line-height: 30px;
                text-indent: 10px;
                font-size: .3rem;
                font-weight: 600;
                margin-bottom: 6px;
            }
            &:before{
                content: ' ';
                display: block;
                position: absolute;
                left: -.1rem;
                width: .2rem;
                height: 100%;
                top: 0;
                border-radius: .1rem 0 0 .1rem;
                background: #409eff;
            }
            .resultType{
                box-sizing: border-box;
                padding: 0 10px;
                display: flex;
                font-size: .28rem;
                margin-bottom: 6px;
                justify-content: space-between;
                .l{
                }
            }
            .look{
                margin-top: .2rem;
                text-align: center;
                line-height: .8rem;
                box-sizing: border-box;
                border: 1px solid #409eff;
                color: #409eff;
                border-radius: .05rem;
                letter-spacing: .2rem;
            }
        }
    }

</style>
