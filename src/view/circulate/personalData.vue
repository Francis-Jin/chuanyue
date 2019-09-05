<template>
    <div>
        <div class="btn" @click="editFn">
            <span v-if="type == 0">编辑</span>
            <span v-if="type == 1" class="success">完成</span>
        </div>
        <van-cell-group>
            <van-field
                v-model="nickname"
                label="昵称"
                type="input"
                clearable
                :disabled="disabled"
                input-align="right"
            />
            <van-field
                v-model="phone"
                label="电话"
                type="input"
                clearable
                :disabled="disabled"
                input-align="right"
            />
            <van-cell title="身份" :value="userInfo.roleNameStr"/>
            <van-cell v-if="userInfo.trainingSchoolId != 0" title="机构名称" :value="userInfo.trainingSchoolName"/>
        </van-cell-group>
    </div>
</template>

<script>
export default {
  data () {
    return {
      type: 0,
      disabled: true,
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
      nickname: JSON.parse(sessionStorage.getItem('userInfo')).nickname,
      phone: JSON.parse(sessionStorage.getItem('userInfo')).phone
    }
  },

  methods: {
    editFn () {
      if (this.type === 0) {
        this.disabled = false
        this.type = 1
      } else {
        let params = this.$Qs.stringify({
          // phone: this.phone,
          nickname: this.nickname,
          id: this.userInfo.id
        })
        this.$api.editMyDataApi(params).then(res => {
          if (res.data.code * 1 === 200) {
            this.disabled = true
            this.type = 0
          } else {
            this.$toast('修改失败')
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
    .btn{
        width: 100%;
        box-sizing: border-box;
        padding-right: .4rem;
        text-align: right;
        line-height: 1.2rem;
        font-size: .32rem;
        .success{
            padding: .1rem .2rem;
            background: #2b85e4;
            color: #fff;
            border-radius: .1rem;
        }
    }

</style>
