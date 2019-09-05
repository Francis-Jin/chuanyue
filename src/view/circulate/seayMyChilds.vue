<template>
    <div>
        <div class="main relative">
            <div class="topImg">
                <img src="../../assets/images/banner.png" alt="">
            </div>
            <div class="contentLists">
                <div class="item margin_top_20 margin_bottom_10 border_bottom10 padding_top_bottom_10px">
                    <van-cell-group>
                        <van-cell title="学员姓名" :value="itemDetails.name" :icon="require('../../assets/icon/my_xsxm.png')"/>
                        <van-cell title="传阅学号" :value="itemDetails.platformStudentNumber" :icon="require('../../assets/icon/my_cyxh.png')" />
                        <van-cell title="性别" :value="itemDetails.sex == 1 ? '男':'女'" :icon="require('../../assets/icon/my_cyxh.png')" />
                        <van-cell v-if="itemDetails.parentPhone" title="家长手机号" :value="itemDetails.parentPhone" :icon="require('../../assets/icon/my_jz_sjh.png')" />
                    </van-cell-group>
                </div>
                 <div v-if="itemDetails.trainingSchoolName && itemDetails.schoolStudentNumber" class="item margin_bottom_10 border_bottom10 padding_top_bottom_10px">
                     <van-cell-group>
                         <van-cell v-if="itemDetails.trainingSchoolName" title="机构名称" :value="itemDetails.trainingSchoolName" :icon="require('../../assets/icon/my_jgmc.png')"/>
                         <van-cell v-if="itemDetails.schoolStudentNumber" title="机构学号" :value="itemDetails.schoolStudentNumber" :icon="require('../../assets/icon/my_jz_jgxh.png')" />
                     </van-cell-group>
                 </div>
                 <div class="item padding_top_bottom_10px">
                     <van-cell-group>
                         <van-cell title="年级" :value="itemDetails.gradeName" :icon="require('../../assets/icon/js_nj.png')" />
                         <van-cell v-if="itemDetails.className" title="班级" :value="itemDetails.className" :icon="require('../../assets/icon/my_jz_bj.png')"/>
                         <van-cell v-if="itemDetails.teacherName" title="班主任" :value="itemDetails.teacherName" :icon="require('../../assets/icon/js_bzr.png')"/>
                     </van-cell-group>
                 </div>
            </div>
        </div>
    </div>
</template>

<script>

import FooterBar from '../../components/footerBar'
export default {
  components: {
    FooterBar
  },
  data () {
    return {
      identity: localStorage.getItem('identity') * 1,
      itemId: this.$route.query.itemId,
      itemDetails: ''
    }
  },
  mounted () {
    // if (this.identity === 2) {
    // this.getChildresDetails()
    // } else {
    // this.simpleGetChildresDetails()
    // }
    let childs = JSON.parse(sessionStorage.getItem('childsLits'))
    childs.forEach(e => {
      if (e.id === this.itemId) {
        this.itemDetails = e
      }
    })
  },
  methods: {
    /** 家长获取学生详情. */
    getChildresDetails () {
      let parm = this.$Qs.stringify({
        userId: JSON.parse(sessionStorage.getItem('userInfo')).id
      })
      this.$api.parentGetChildrenDetailsApi(parm).then(res => {
        if (res.data.code * 1 === 200) {
          for (let i = 0; i < res.data.data.length; i++) {
            if (this.itemId * 1 === res.data.data[i].id * 1) {
              this.itemDetails = res.data.data[i]
            }
          }
        }
      })
    },

    /** 普通用户获取学生详情. */
    simpleGetChildresDetails () {
      let parm = this.$Qs.stringify({
        userId: JSON.parse(sessionStorage.getItem('userInfo')).id
      })
      this.$api.simpleParentGetChildrenDetailsApi(parm).then(res => {
        if (res.data.code * 1 === 200) {
          for (let i = 0; i < res.data.data.length; i++) {
            if (this.itemId * 1 === res.data.data[i].id * 1) {
              this.itemDetails = res.data.data[i]
            }
          }
        }
      })
    },

    /** 跳转页面. */
    toPageFn (path) {
      this.$router.push({
        path: path
      })
    }

    /** end. */
  }
}
</script>
<style scoped lang="less">
    .topImg{
        width: 100%;
        height: 200px;
        text-align: center;
        font-size: 0;
        box-shadow: 0 6px 10px rgba(45, 146, 239, .15);
        img{
            width: 100%;
            height: 100%;
            vertical-align: middle;
        }
    }
    .userWrap{
        position: relative;
        top: -.8rem;
        width: 100%;
        height: 2.4rem;
        .editHeadPhoto{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }
        .userIcon{
            width: 1.6rem;
            height: 1.6rem;
            border-radius: 100%;
            margin: 0 auto;
            box-shadow: 0 0 10px 2px rgba(255,255,255,.2);
            img{
                width: 100%;
                height: 100%;
                border-radius: 100%;
            }
        }
        .userName{
            text-align: center;
            color: #4276DF;
            margin-top: .2rem;
        }
    }
    .contentLists{
        position: relative;
        top: -.5rem;
        .item{
            .dh{
                border: 1px solid #4276DF;
                color: #4276DF !important;
                padding: 2px 6px;
                font-size: .24rem;
                border-radius: 18px;
                .iconfont{
                    font-size: .2rem;
                }
            }
        }
    }
</style>
