<template>
    <div>
        <div class="top">
            <span v-if="type==1">我的剩余量</span>
            <span v-if="type==2">机构剩余量</span>
        </div>
        <van-cell-group>
            <van-cell title="作文批改剩余次数" :value="compositionCorrectTimes" />
            <van-cell title="作文精批剩余次数" :value="compositionLuxuryCorrectTimes" />
            <van-cell title="同步辅导剩余次数" :value="syncGuidanceTimes" />
        </van-cell-group>
        <!--<div class="btn" @click="toPage">-->
            <!--<span>去购买</span>-->
        <!--</div>-->
    </div>
</template>

<script>
export default {
  data () {
    return {
      type: 1,
      compositionCorrectTimes: 0,
      compositionLuxuryCorrectTimes: 0,
      syncGuidanceTimes: 0
    }
  },

  mounted () {
    this.allowanceFn()
  },

  methods: {

    /** 跳转. */
    toPage () {
      this.$router.push({
        path: '/preferentialZone'
      })
    },

    /** 余量查询. */
    allowanceFn () {
      let parm = this.$Qs.stringify({
        userId: JSON.parse(sessionStorage.getItem('userInfo')).id,
        trainingSchoolId: JSON.parse(sessionStorage.getItem('userInfo')).trainingSchoolId
      })
      this.$toast.loading({
        mask: true,
        message: '查询中...',
        duration: 0
      })
      this.$api.getAllowanceApi(parm).then(res => {
        this.$toast.clear()
        if (res.data.code * 1 === 200) {
          let d = res.data.data
          if (d) {
            this.type = d.category
            this.compositionCorrectTimes = d.compositionCorrectTimes
            this.compositionLuxuryCorrectTimes = d.compositionLuxuryCorrectTimes
            this.syncGuidanceTimes = d.syncGuidanceTimes
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="less">

    .top{
        text-align: center;
        font-size: .4rem;
        font-weight: 600;
        color: #333;
        line-height: 1.6rem;
    }
    .btn{
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1.2rem;
        line-height: 1.2rem;
        text-align: center;
        color: #fff;
        background: #2b85e4;
    }

</style>
