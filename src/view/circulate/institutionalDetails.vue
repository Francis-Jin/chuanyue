<template>
    <div>
        <van-cell-group>
            <van-cell :border="false" />
            <van-cell title="培训机构" :value="info.name" />
            <van-cell title="联系人" :value="info.linkMan" />
            <van-cell title="联系电话">
                <a :href="'tel:' + info.linkPhone">{{info.linkPhone}}</a>
            </van-cell>
            <van-cell title="邮编" :value="info.countyCode" />
            <van-cell>
                <div class="title"><span>详细地址</span></div>
                <div class="title" style="text-align: right"><span>{{info.provinceName+info.cityName+info.countyName+info.address}}</span></div>
            </van-cell>
            <van-cell>
                <div class="title"><span>备注</span></div>
                <div class="title"><span>{{info.remarks}}</span></div>
            </van-cell>
        </van-cell-group>
    </div>
</template>

<script>
export default {
  data () {
    return {
      info: ''
    }
  },

  mounted () {
    this.getInstitutionalDetails()
  },

  methods: {
    /** 获取机构详情. */
    getInstitutionalDetails () {
      let parm = this.$Qs.stringify({
        id: JSON.parse(sessionStorage.getItem('userInfo')).trainingSchoolId
      })

      this.$toast.loading({
        message: '加载中...',
        mask: true,
        duration: 0
      })

      this.$api.getInstitutionalDetailsApi(parm).then(res => {
        this.$toast.clear()
        if (res.data.code * 1 === 200) {
          this.info = res.data.data
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
