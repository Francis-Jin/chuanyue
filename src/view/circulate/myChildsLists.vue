<template>
    <div class="main">
        <div class="main relative">
            <div class="topImg">
                <img src="../../assets/images/banner.png" alt="" />
            </div>
            <div class="contentLists">
                <div class="item margin_top_20 padding_top_bottom_10px">
                    <div  v-if="lists.length > 0" >
                        <van-swipe-cell  v-for="(item, index) in lists" :key="index">
                            <van-cell-group>
                                <van-cell
                                    :title="item.name"
                                    :value="item.trainingSchoolName"
                                    :icon="require('../../assets/icon/my_xsxm.png')"
                                    @click="toPageFn(item.id)">
                                    <span v-if="!uploadSelectedStu"><i class="iconfont icon-right"></i></span>
                                    <span v-if="uploadSelectedStu && !item.selected"><i class="iconfont icon-radio"></i></span>
                                    <span v-if="uploadSelectedStu && item.selected"><i class="iconfont icon-radiobutton" style="color:#4276df"></i></span>
                                </van-cell>
                            </van-cell-group>
                            <!--<template slot="right">-->
                                <!--<van-button square type="danger" text="删除" @click="deleteStudentFn(item.id)"/>-->
                            <!--</template>-->
                        </van-swipe-cell>
                    </div>
                    <div v-if="isShowNotData && lists.length == 0" style="width: 100%;text-align: center; color: #999;line-height: 200px;">
                        <span>提示：你还没有学员，请先添加。</span>
                    </div>
                </div>

            </div>
        </div>

        <!--添加学员按钮-->
        <!--<div class="addStudents" @click="toPageFnAdd('/addChildren?bind=false&listsAdd=true')">-->
            <!--<span>添加学员</span>-->
        <!--</div>-->

        <!--添加上传-->
        <MoveBtn @onFloatBtnClicked="toPageFnAdd('/addChildren?bind=false&listsAdd=true')"></MoveBtn>

        <!--上传页面过来选择学员-->
        <div v-if="uploadSelectedStu && lists.length > 0" class="selectedStu" @click="goBackUploadFn">
            <span>确 定</span>
        </div>
        <div style="height: 70px"></div>
    </div>
</template>

<script>
import MoveBtn from '../../components/moveBtn'
export default {
  components: {
    MoveBtn
  },
  data () {
    return {
      identity: localStorage.getItem('identity') * 1,
      lists: [],
      isShowNotData: false,
      uploadSelectedStu: this.$route.query.uploadSelectedStu,
      selectedStuId: ''
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
          let arr = []
          res.data.data.forEach(item => {
            item.selected = false
            arr.push(item)
          })
          console.log(arr)
          this.lists = arr
          this.isShowNotData = true
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
          this.lists = []
          this.getChildresDetails()
          this.$toast.success(res.data.message)
        }
      })
    },

    /** 跳转页面. */
    toPageFnAdd (path) {
      this.$router.push({
        path: path
      })
    },

    /** 跳转页面. */
    toPageFn (itemid) {
      sessionStorage.setItem('childsLits', JSON.stringify(this.lists))

      if (!this.uploadSelectedStu) {
        this.$router.push({
          path: '/seayMyChilds',
          query: {
            itemId: itemid
          }
        })
      } else {
        this.lists.forEach(item => {
          if (itemid === item.id) {
            this.selectedStuId = itemid
            sessionStorage.setItem('selectedStuItem', JSON.stringify(item))
            item.selected = true
          } else {
            item.selected = false
          }
        })
      }
    },

    /** 返回上传页面. */
    goBackUploadFn () {
      if (!this.selectedStuId) {
        this.$toast({
          duration: 1000,
          message: '请选择学生'
        })
        return false
      } else {
        this.$router.go(-1)
      }
    }

    /** end. */
  }
}
</script>
<style scoped lang="less">
    .main{
        position: relative;
        /*min-height: 80vh;*/
    }
    .addStudents{
        width: 100%;
        height: 50px;
        text-align: center;
        line-height: 50px;
        background: #fff;
        color: #409eff;
        font-weight: 600;
        font-size: 14px;
        box-shadow: 0 0 10px 2px #f5f5f5;
    }
    .selectedStu{
        position: absolute;
        left: 50%;
        bottom: 10px;
        margin-left: -80px;
        width: 160px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        background: #409eff;
        border-radius: 4px;
    }
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
