<template>
    <div>
        <van-cell-group>
            <van-cell
                title="客服电话"
                :icon="require('../../assets/icon/my_kf.png')">
                <a :href="'tel:' + kfTel" style="color: #666;padding-top: .4rem;box-sizing: border-box">{{kfTel}}</a>
            </van-cell>
            <van-cell
                title="客服微信"
                icon="chat-o"
                value="chuanyueyuwen">
            </van-cell>
            <van-cell
                title="客服QQ"
                :icon="require('../../assets/icon/qq.png')"
                value="2307460685">
            </van-cell>
        </van-cell-group>
    </div>
</template>

<script>
export default {
  data () {
    return {
      kfTel: ''
    }
  },
  mounted () {
    this.getSystemMessage()
  },
  methods: {
    /** 获取客服电话. */
    getSystemMessage () {
      this.$api.getSystemMessageApi().then(res => {
        console.log(res)
        if (res.data.code * 1 === 200) {
          this.kfTel = res.data.data.platformPhone
        }
      })
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
