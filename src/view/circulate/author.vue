<template>
    <div class="author_box">
        <div class="title margin_top_30 margin_bottom_30 text_center">
            <h1>请选择您的身份</h1>
        </div>
        <div class="author_radio">
            <el-radio-group v-model="radio" @change="selectedFn">
                <div class="item">
                    <el-radio :label="1">
                        <span>我是教师</span>
                        <p>在机构任职的教师</p>
                    </el-radio>
                </div>
                <div class="item">
                    <el-radio :label="2">
                        <span>我是家长</span>
                        <p>孩子在机构学习</p>
                    </el-radio>
                </div>
                <!--<div class="item">-->
                    <!--<el-radio :label="3">-->
                        <!--<span>普通家长</span>-->
                        <!--<p>普通用户</p>-->
                    <!--</el-radio>-->
                <!--</div>-->
            </el-radio-group>
        </div>
        <div class="confirm_button" @click="confirmFn">
            <span>下一步</span>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      radio: 0
    }
  },
  mounted () {
  },
  methods: {
    selectedFn (e) {
      this.radio = e
    },

    confirmFn () {
      if (this.radio === 0) {
        this.$toast.fail('请选择您的身份')
      } else {
        this.$router.push({
          path: 'bindUser',
          query: {
            identity: this.radio
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
    .author_box{
        width: 100%;
        height: 100vh;
        position: fixed;
        left: 0;
        top: 0;
        background: #fff;
        h1{
            color: #2D92EF;
        }
        .author_radio{
            .el-radio-group{
                width: 100%;
            }
            .item{
                width: 100%;
                padding: .5rem 0;
                text-align: center;
                label{
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                }
                span{
                    display: inline-block;
                    width: 80px;
                    color: #2D92EF;
                }
                p{
                    margin-top: .2rem;
                    color: #999;
                    text-align: left;
                    font-size: .24rem;
                    text-indent: 45%;
                }
            }
        }
        .confirm_button{
            width: 100%;
            position: absolute;
            bottom: 10px;
            left: 0;
            text-align: center;
            span{
                display: inline-block;
                width: 70%;
                height: 50px;
                line-height: 50px;
                color: #fff;
                background: #2D92EF;
                border-radius: 25px;
            }
        }
    }

</style>
