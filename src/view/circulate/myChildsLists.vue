<template>
    <div>
        <div class="main relative">
            <div class="topImg">
                <img src="../../assets/images/banner.png" alt="" />
            </div>
            <div class="contentLists">
                <div class="item margin_top_20 padding_top_bottom_10px">
                    <van-swipe-cell v-for="(item, index) in lists" :key="index">
                        <van-cell-group>
                            <van-cell
                                :title="item.name"
                                :value="item.trainingSchoolName"
                                :icon="require('../../assets/icon/my_xsxm.png')"
                                is-link
                                @click="toPageFn(item.id)"
                            />
                        </van-cell-group>
                        <template slot="right">
                            <van-button square type="danger" text="删除" @click="deleteStudentFn(item.id)"/>
                        </template>
                    </van-swipe-cell>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      identity: localStorage.getItem('identity') * 1,
      lists: []
    }
  },
  mounted () {
    this.getChildresDetails()
  },
  methods: {
    /** 家长获取学生详情. */
    getChildresDetails () {
      let parm = this.$Qs.stringify({
        userId: JSON.parse(sessionStorage.getItem('userInfo')).id
      })
      this.$api.parentGetChildrenDetailsApi(parm).then(res => {
        if (res.data.code * 1 === 200) {
          this.lists = this.lists.concat(res.data.data)
        }
      })
    },

    /** 删除学生. */
    deleteStudentFn (id) {
      console.log(id)
      let parm = this.$Qs.stringify({
        userId: JSON.parse(sessionStorage.getItem('userInfo')).id,
        studentId: id
      })
      this.$api.deleteStudentApi(parm).then(res => {
        if (res.data.code * 1 === 200) {
          if (this.identity === 2) {
            this.getChildresDetails()
          } else {
            this.simpleGetChildresDetails()
          }
          this.$toast.success(res.data.message)
        }
      })
    },

    /** 跳转页面. */
    toPageFn (itemid) {
      sessionStorage.setItem('childsLits', JSON.stringify(this.lists))
      this.$router.push({
        path: '/seayMyChilds',
        query: {
          itemId: itemid
        }
      })
    }

    /** end. */
  }
}
</script>
<style scoped lang="less">
.topImg {
    width: 100%;
    height: 200px;
    text-align: center;
    font-size: 0;
    box-shadow: 0 6px 10px rgba(45, 146, 239, 0.15);
    img {
        width: 100%;
        height: 100%;
        vertical-align: middle;
    }
}
.userWrap {
    position: relative;
    top: -0.8rem;
    width: 100%;
    height: 2.4rem;
    .editHeadPhoto {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
    .userIcon {
        width: 1.6rem;
        height: 1.6rem;
        border-radius: 100%;
        margin: 0 auto;
        box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.2);
        img {
            width: 100%;
            height: 100%;
            border-radius: 100%;
        }
    }
    .userName {
        text-align: center;
        color: #4276df;
        margin-top: 0.2rem;
    }
}
.contentLists {
    position: relative;
    top: -0.5rem;
    .item {
        .dh {
            border: 1px solid #4276df;
            color: #4276df !important;
            padding: 2px 6px;
            font-size: 0.24rem;
            border-radius: 18px;
            .iconfont {
                font-size: 0.2rem;
            }
        }
    }
}
</style>
