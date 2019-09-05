<template>
    <div class="wrap">
        <div class="img">
            <img src="../../static/icon/404.png" alt="">
        </div>

        <h1>404页面没有找到！</h1>
        <p>可能原因：</p>
        <p class="init">1、原来的页面不存在了！</p>
        <p class="init">2、可能我们的服务器被外星人劫持了!</p>
        <div class="btn" @click="toLink">
            <span>返回首页</span>
        </div>
    </div>
</template>
<script>
export default {
  methods: {
    toLink () {
      this.$router.push({
        path: '/'
      })
    }
  }
}
</script>
<style scoped lang="less">
    .wrap{
        width: 280px;
        margin:  50px auto;
        .img{
            text-align: center;
        }
        h1{
            text-align: center;
        }
        p{
            color: #999999;
            &.init{
                text-indent: 28px;
            }
        }
        .btn{
            text-align: center;
            height: 40px;
            margin-top: 10px;
            line-height: 40px;
            span{
                background: #4276DF;
                color: #fff;
                padding: 10px 26px;
            }
        }
    }
</style>
