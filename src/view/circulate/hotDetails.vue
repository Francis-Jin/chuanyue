<template>
    <div>
        <div class="main">
            <div v-if="isCustom != 1" class="titleHead">
                <div class="title">
                    <span>{{details.title}}</span>
                </div>
                <div class="timeAuthor">
                    <div class="l">
                        <span class="margin_right_30">{{details.newsTime}}</span>
                        <span>作者：</span>
                        <span>{{details.source}}</span>
                    </div>

                    <div class="r">
                        <van-icon name="eye-o" /><span>{{details.clickTimes}}</span>
                    </div>
                </div>
            </div>

            <div class="articleContent">
                <div class="content" v-html="details.content"></div>
            </div>

            <!-- 评论列表 -->
            <div v-if="showContent"  class="commentWrap">
                <div class="item" v-for="(item,index) in commentLists" :key="index">
                    <div class="headPortrait">
                        <img :src="item.imgUrl" alt="">
                    </div>
                    <div class="rightContent">
                        <div class="titleName">
                            <div class="name">
                                <span>{{item.userName}}</span>
                            </div>
                            <div class="fabulous" :class="item.isFabulous ? 'fabulousActive' : ''">
                                <i class="iconfont icon-zan"></i>
                                <span>{{item.fabulousNum}}</span>
                            </div>
                        </div>
                        <div class="commentContent">
                            <span>{{item.commentContent}}</span>
                        </div>
                        <div class="commentTime">
                            <span>{{item.createTime}}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <!--发表评论-->
        <div v-if="showContent" class="publishWrap">
            <div class="inputWrap">
                <textarea @blur="inputBlurFn" placeholder="发表评论..." ></textarea>
            </div>
            <div class="btnWrap">
                <div class="star">
                    <i class="iconfont icon-iconfontxingxing"></i>
                </div>
                <div class="submit">
                    <i class="iconfont icon-iconfontfenxiang"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      isCustom: this.$route.query.isCustom * 1,
      showContent: false,
      details: '',
      articleId: this.$route.query.articleId,
      commentLists: [
        {
          imgUrl: require('../../assets/images/shili.png'),
          userName: '这是用户名',
          commentContent: '这是评论内容',
          fabulousNum: 336,
          createTime: '2019-07-31',
          isFabulous: false
        },
        {
          imgUrl: require('../../assets/images/shili.png'),
          userName: '这是用户名',
          commentContent: '这是评论内容',
          fabulousNum: 336,
          createTime: '2019-07-31',
          isFabulous: true
        },
        {
          imgUrl: require('../../assets/images/shili.png'),
          userName: '这是用户名',
          commentContent: '这是评论内容',
          fabulousNum: 336,
          createTime: '2019-07-31',
          isFabulous: false
        }
      ],
      inputValue: ''
    }
  },
  mounted () {
    if (this.isCustom !== 1) {
      this.getDetails()
    } else {
      this.getBannerCustomDetails()
    }
  },
  methods: {
    //  解决键盘推起页面后无法恢复
    inputBlurFn () {
      document.body.scrollTop = 0
    },

    /** 获取轮播自定义详情. */
    getBannerCustomDetails () {
      let parm = this.$Qs.stringify({
        id: this.$route.query.articleId
      })
      this.$api.getBannerCustomDetailsApi(parm).then(res => {
        if (res.data.code * 1 === 200) {
          this.details = res.data.data
        } else {
          this.$toast(res.data.message)
        }
      })
    },

    //  获取文章详情
    getDetails () {
      let parms = {
        'newsId': this.articleId,
        'openId': localStorage.getItem('oid')
      }
      this.$api.getHotArticleDetails(this.$Qs.stringify(parms)).then((res) => {
        if (res.data.code * 1 === 200) {
          this.details = res.data.data
        }
      }).catch((error) => {
        this.$toast.clear()
        console.log('发生错误！', error)
      })
    }
  }
}
</script>

<style>
    .articleContent img{
        max-width: 100%;
    }
    h1,h2,h3,h4,h5,h6,p{
        max-width: 100% !important;
        white-space: pre-wrap;
    }
</style>

<style scoped lang="less">

    .main{
        width: 100%;
        box-sizing: border-box;
        padding: 0 .3rem;
    }

    .titleHead{
        .title{
            padding: 20px 0;
            color: #333333;
            font-size: .4rem;
            font-weight: 900;
        }
        .timeAuthor{
            margin-top: 10px;
            color: #C7C6C6;
            width: 100%;
            display: flex;
            justify-content: space-between;
            .r i{
                position: relative;
                top: 2px;
                margin-right: 6px;
            }
        }
    }

    .articleContent{
        max-width: 100%;
        min-height: 50vh;
        margin-top: 10px;
        box-sizing: border-box;
        padding: .2rem 0;
        .content{
            white-space: pre-wrap; //解决的关键就是这一句,换行
            max-width: 100%;
            overflow: hidden;
            img{
                max-width: 100% !important;
            }
        }
    }

    .commentWrap{
        padding: 20px 0;
        position: relative;
        .item{
            display: flex;
            width: 100%;
            margin-bottom: 10px;
            .headPortrait{
                width: 20%;
                font-size: 0;
                img{
                    width: 50px;
                    height: 50px;
                    border-radius: 100%;
                }
            }
            .rightContent{
                width: 80%;
                .titleName{
                    margin:6px 0 10px;
                    display: flex;
                    justify-content: space-between;
                    .name{
                        width: 70%;
                        color: #4276DF;
                        font-size: .28rem;
                    }
                    .fabulous{
                        width: 25%;
                        font-size: .24rem;
                        text-align: right;
                        color: #D4D4D4;
                        &.fabulousActive{
                            color: #FA6565;
                        }
                    }
                }
                .commentContent{
                    font-size: .28rem;
                    color: #666;
                }
                .commentTime{
                    margin-top: 10px;
                    color: #d1d1d1;
                }
            }
        }
        &:before{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 1px;
            transform: scaleY(.5);
            content: " ";
            background: #eee;
        }
    }

    .publishWrap{
        /*position: fixed;*/
        /*left: 0;*/
        /*bottom: 0;*/
        background: #fff;
        width: 100%;
        display: flex;
        justify-content: space-between;
        box-shadow: 0 -4px 10px rgba(219,219,219,.6);
        z-index: 2;
        .inputWrap{
            width: 70%;
            height: 70px;
            box-sizing: border-box;
            padding-left: 16px;
            textarea{
                margin-top: 10px;
                /* input，textarea在ios和Android上阴影和边框的处理方法 -webkit-appearance: none; */
                -webkit-appearance: none;
                display: block;
                box-sizing: border-box;
                width: 100%;
                color: #323233;
                height: 50px;
                border: 1px solid #e5e5e5;
                padding: 12px 10px 0;
                text-align: left;
                background-color: transparent;
                resize: none;
                border-radius: 25px;
                position: relative;
                z-index: 2;
            }
        }
        .btnWrap{
            width: 30%;
            display: flex;
            justify-content: space-between;
            box-sizing: border-box;
            padding-top: 10px;
            .star,.submit{
                width: 50%;
                text-align: center;
                height: 50px;
                line-height: 50px;
            }
            .star{
                .iconfont{
                    font-size: 30px;
                    color: #FFF656;
                }
            }
            .submit{
                .iconfont{
                    font-size: 30px;
                    color: #EEEEEE;
                }
            }
        }
    }
</style>
