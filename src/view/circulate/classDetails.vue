<template>
    <div>
        <div class="main">
            <div v-show="!headTop" class="titleMessage">
                <div class="item">
                    <div class="itemLeft">
                        <van-icon
                            :name="require('../../assets/icon/js_nj.png')"
                        />
                        <span>年级：</span>
                        <span>{{ classInfoVo.gradeName }}</span>
                    </div>
                    <div class="itemRight">
                        <van-icon
                            :name="require('../../assets/icon/js_bj.png')"
                        />
                        <span>班级：</span>
                        <span>{{ classInfoVo.name }}</span>
                    </div>
                </div>
                <div class="item">
                    <div class="itemLeft">
                        <van-icon
                            :name="require('../../assets/icon/js_bzr.png')"
                        />
                        <span>班主任：</span>
                        <span>{{ classInfoVo.teacherName }}</span>
                    </div>
                    <div class="itemRight">
                        <van-icon
                            :name="require('../../assets/icon/js_xyrs.png')"
                        />
                        <span>学员人数：</span>
                        <span>{{ classInfoVo.total }}</span>
                    </div>
                </div>
            </div>

            <div class="searchWrap">
                <!--<div class="search">-->
                <!--<form action="javascript:(function() { return true })()">-->
                <!--<input type="search" v-model="searchValue" placeholder="你想搜索..." @keypress="searchFn($event)">-->
                <!--<i class="iconfont icon-search" @click="searchDataFn"></i>-->
                <!--</form>-->
                <!--</div>-->
                <van-search
                    v-model="searchValue"
                    placeholder="请输入搜索关键词"
                    @search="searchFn"
                />
            </div>

            <div class="listsWrap">
                <div class="listItemHead flex border_bottom_1">
                    <div class="init">
                        <span>学员姓名</span>
                    </div>
                    <div class="init">
                        <span>机构学号</span>
                    </div>
                    <div class="init">
                        <span>家长手机号</span>
                    </div>
                </div>
                <div v-if="showNotdata" class="importantContent">
                    <div
                        class="listItem border_bottom_1"
                        v-for="(item, index) in lists"
                        :key="index"
                    >
                        <div class="item">
                            <span>{{ item.name }}</span>
                        </div>
                        <div class="item">
                            <span>{{ item.schoolStudentNumber }}</span>
                        </div>
                        <div class="item">
                            <a :href="'tel:' + item.parentPhone">{{item.parentPhone}}</a>
                        </div>
                    </div>

                    <div v-if="!showNotdata" class="notData">
                        <span class="color_999">暂无数据</span>
                    </div>

                </div>
            </div>
        </div>

        <div
            v-if="showNotdata && lists.length > 10"
            style="height: 60px;line-height: 60px;text-align: center;color: #999; background: #f5f5f5;font-size: .26rem;"
        >
            <van-loading v-if="tips === 0" size="24px">加载中...</van-loading>
            <span v-if="tips === 1">没有更多了</span>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      headTop: this.$route.query.headTop,
      title: this.$route.query.title,
      itemId: this.$route.query.itemId,
      lists: [],
      classInfoVo: [],
      pageNum: 1,
      tips: 0,
      showNotdata: true,
      searchValue: ''
    }
  },
  mounted () {
    if (this.title === '学员管理') document.title = this.title
    if (!this.headTop) {
      this.getStudentsLists()
    } else {
      this.getAdminStudentLists()
    }

    /** 滚动到底部，再加载的处理事件. */
    window.addEventListener('scroll', this.isScrollBottom)
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.isScrollBottom) // 离开页面时移除
  },

  methods: {
    /** 获取数据列表. */
    getStudentsLists () {
      let parm = this.$Qs.stringify({
        classId: this.itemId,
        name: this.searchValue
      })
      // this.$toast.loading({
      //   mask: true,
      //   message: '加载中...',
      //   duration: 0
      // })
      this.$api.getStudentsListsApi(parm).then(res => {
        // this.$toast.clear()
        this.tips = 1
        if (res.data.code * 1 === 200) {
          this.classInfoVo = res.data.data.classInfo[0]
          this.lists = res.data.data.studentList
        } else {
          this.$toast.fail(res.data.message)
        }
      })
    },

    /** 获取学员管理列表. */
    getAdminStudentLists () {
      let parms = this.$Qs.stringify({
        teacherId: JSON.parse(sessionStorage.getItem('userInfo'))
          .teacherId,
        page: this.pageNum,
        limit: this.GLOBAL.LISTS_LIMIT,
        name: this.searchValue
      })
      // this.$toast.loading({
      //   mask: true,
      //   message: '加载中...',
      //   duration: 0
      // })
      this.$api.getAdminStudentListsApi(parms).then(res => {
        // this.$toast.clear()
        if (res.data.code * 1 === 200) {
          if (res.data.data.length > 0) {
            this.tips = 0
            this.lists = this.lists.concat(res.data.data)
          } else {
            this.tips = 1
          }
          if (this.lists.length !== 0) {
            this.showNotdata = true
          } else {
            this.showNotdata = false
          }
        } else {
          this.$toast.fail(res.data.message)
        }
      })
    },

    /** 搜索学员. */
    searchFn (e) {
      // if (e.keyCode === 13) {
      if (this.headTop) {
        this.getAdminStudentLists()
      } else {
        this.getStudentsLists()
      }
      // }
    },

    /** 点击按钮搜索. */
    searchDataFn () {
      if (this.headTop) {
        this.getAdminStudentLists()
      } else {
        this.getStudentsLists()
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
            if (this.headTop) {
              this.getAdminStudentLists()
            } else {
              this.getStudentsLists()
            }
          }
        }, 500)
      }
    }

    /** end. */
  }
}
</script>

<style scoped lang="less">
@import "../../style/common";
.titleMessage {
    width: 94%;
    position: relative;
    z-index: 2;
    margin: 0.3rem auto 0.15rem;
    box-shadow: 0 4px 16px 4px rgba(237, 243, 251, 0.6);
    border-radius: 6px;
    padding: 10px 10px;
    .item {
        display: flex;
        justify-content: space-between;
        font-size: 0.24rem;
        height: 0.4rem;
        color: #a6a6a6;
        margin-bottom: 0.1rem;
        line-height: 0.4rem;
        i {
            font-size: 0.24rem;
            color: #4276df;
        }
        .itemLeft {
            width: 60%;
        }
        .itemRight {
            width: 40%;
        }
    }
}

.searchWrap {
    box-shadow: 0 3px 12px 3px rgba(237, 243, 251, 1);
    .search {
        width: 100%;
        padding: 0 5px;
        height: 30px;
        background: #f8f8f8;
        border-radius: 15px;
        input {
            width: 90%;
            height: 100%;
            border: 0;
            text-indent: 0.1rem;
            margin-right: 0.1rem;
            background: transparent;
        }
        i {
            color: #4276df;
        }
    }
}

.listsWrap {
    margin-top: 0.3rem;
    .listItem {
        display: flex;
        justify-content: space-between;
        text-align: center;
        .item {
            width: 32%;
            height: 0.8rem;
            line-height: 0.8rem;
            font-size: 0.24rem;
        }
    }
    .listItemHead {
        justify-content: space-between;
        text-align: center;
        .init {
            font-size: 0.28rem;
            font-weight: 600;
            width: 32%;
            height: 0.8rem;
            line-height: 0.8rem;
        }
    }
}
</style>
