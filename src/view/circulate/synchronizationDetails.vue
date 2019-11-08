<template>

    <div>
        <div class="main" v-if="showMain">
            <div class="titleMessageTop">
                <span>批次号：</span>
                <span>{{info.schoolworkInfoVo.batchNumber}}</span>
            </div>
            <div class="titleMessage">
                <div class="item">
                    <div class="itemLeft">
                        <van-icon :name="iconList[0]" />
                        <span>传阅学号：</span>
                        <span>{{info.schoolworkInfoVo.platformStudentNumber}}</span>
                    </div>
                    <div class="itemRight">
                        <van-icon :name="iconList[3]" />
                        <span>学生姓名：</span>
                        <span>{{info.schoolworkInfoVo.studentName}}</span>
                    </div>
                </div>
                <div class="item">
                    <div class="itemLeft">
                        <van-icon :name="iconList[1]" />
                        <span>所属年级：</span>
                        <span>{{info.schoolworkInfoVo.gradeName}}</span>
                    </div>
                    <div class="itemRight">
                        <van-icon :name="iconList[2]" />
                        <span>批改类型：</span>
                        <span>{{info.schoolworkInfoVo.correctTypeName}}</span>
                    </div>
                </div>
                <div class="item">
                    <div class="itemLeft">
                        <van-icon :name="iconList[4]" />
                        <span>上传时间：</span>
                        <span>{{formatDate(info.schoolworkInfoVo.createTime)}}</span>
                    </div>
                    <div class="itemRight overflow1">
                        <van-icon :name="iconList[0]" />
                        <span>得 分 率：</span>
                        <!-- <span style="color:orangered;font-size: .3rem;">{{info.schoolworkCorrectVo.score}}分</span>-->
                        <span>{{info.schoolworkInfoVo.scoreRate * 100}}</span><span>%</span>
                    </div>
                </div>
            </div>

            <div class="content">

                <div class="item" v-for="(item,index) in info.schoolworkInfoVo.schoolworkPhotoList" :key="index">
                    <!--<div class="dp">-->
                        <!--<div class="small">-->
                            <!--<p class="smallTitle"><span>{{info.questionInfoList[index].title}}</span></p>-->
                        <!--</div>-->
                    <!--</div>-->
                    <div class="imgWrap" @click="showImage(index)">
                        <img :src="imgUrl + item.photo" alt="">
                    </div>
                </div>

                <div class="answerWrap">

                    <div class="allP">
                        <p class="allPTitle"><span>错题提示及解析</span></p>
                        <div class="allPContent" v-html="info.schoolworkCorrectVo.remark"></div>
                    </div>

                    <div style="display: none;" class="item">
                        <div class="answer" v-for="(item,index) in info.questionInfoList" :key="index">
                            <h4>{{item.title}}</h4>
                            <div>
                                <span>参考答案：</span>
                                <p v-for="(item1,index2) in item.children" :key="index2" style="margin-right: 6px;"><span v-html="item1.answer"></span>  </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </div>

</template>

<script>

export default {
  data () {
    return {
      iconList: [
        require('../../assets/icon/js_pch.png'),
        require('../../assets/icon/js_bj.png'),
        require('../../assets/icon/js_lx.png'),
        require('../../assets/icon/js_bzr.png'),
        require('../../assets/icon/js_sj.png'),
        require('../../assets/icon/js_xyrs.png')
      ],
      images: [],
      showMain: false,
      imgUrl: this.GLOBAL.BEFORE_IMG_URL,
      info: '',
      itemId: this.$route.query.itemId
    }
  },

  mounted () {
    this.getSchoolworkSynchronizationDetails()
  },

  methods: {

    /** 图片预览. */
    showImage (index) {
      this.$imagePreview({
        images: this.images,
        showIndex: true,
        loop: false,
        startPosition: index
      })
    },

    /** 时间戳转日期. */
    formatDate (time) {
      const now = new Date(time)
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      const date = now.getDate()
      const hour = now.getHours()
      const minute = now.getMinutes()
      // const second = now.getSeconds()
      return year + '-' + month + '-' + date + ' ' + hour + ':' + minute
      // return year + '-' + month + '-' + date
    },

    /** 獲取批改詳情. */
    getSchoolworkSynchronizationDetails () {
      let parm = this.$Qs.stringify({
        schoolworkId: this.itemId
      })
      this.$api.getSynchronizationDetailsApi(parm).then(res => {
        if (res.data.code * 1 === 200) {
          if (res.data.data) {
            this.info = res.data.data

            this.info.schoolworkInfoVo.schoolworkPhotoList.forEach(e => {
              this.images.push((this.imgUrl + e.photo))
            })

            this.showMain = true
          } else {
            this.showMain = false
          }
        }
      })
    }

  }
}
</script>

<style scoped lang="less">
    @import "../../style/common";
    .titleMessageTop{
        line-height: 1rem;
        font-size: .3rem;
        text-indent: .6rem;
        border-bottom: 1px solid #ededed;
    }
    .not{
        text-align: center;
        line-height: 6rem;
        color: #999;
    }
    .titleMessage{
        width: 94%;
        position: relative;
        z-index: 2;
        margin: .3rem auto .15rem;
        box-shadow: 0 4px 16px 4px rgba(237,243,251,.6);
        border-radius: 6px;
        padding: 10px 10px;

        .item{
            display: flex;
            justify-content: space-between;
            font-size: .24rem;
            height: .4rem;
            color: #A6A6A6;
            margin-bottom: .1rem;
            line-height: .4rem;
            i{
                font-size: .24rem;
                color: #4276DF;
            }
            .itemLeft{
                width: 60%;
            }
            .itemRight{
                width: 40%;
            }
        }
    }

    .content{
        width: 100%;
        background: #f5f5f5;
        .item{
            margin-bottom: .3rem;
            box-sizing: border-box;
            padding: .3rem .2rem;
            background: #fff;
            .answer{
                margin-bottom: .2rem;
                h4{
                    padding-bottom: .2rem;
                }
            }
            .imgWrap{
                img{
                    max-width: 100%;
                }
            }
            .dp{
                padding-bottom: .3rem;
                .smallTitle{
                    line-height: .6rem;
                    font-weight: 600;
                    font-size: .28rem;
                }
                .smallContent{
                    text-indent: .6rem;
                    font-size: .24rem;
                }
            }
        }
        .gxpfList{
            .init{
                display: flex;
                justify-content: space-between;
                text-align: center;
                height: .8rem;
                line-height: .8rem;
                .head{
                    width: 32%;
                }
                &:nth-child(2n-1){
                    color: #666;
                    background: rgba(66,118,223,.18);
                }
                &:nth-child(1){
                    color: #333;
                    font-weight: 600;
                    background: rgba(66,118,223,.5);
                }
            }
        }

        .allP{
            background: #fff;
            padding-bottom: 1rem;
            margin-bottom: .3rem;
            .allPTitle{
                border-top: 1px solid #ededed;
                line-height: 1.2rem;
                font-size: .32rem;
                font-weight: 600;
                background: #fff;
                box-sizing: border-box;
                padding: 0 .2rem;
            }
            .allPContent{
                box-sizing: border-box;
                padding: 0 .2rem;
                text-indent: .6rem;
                font-size: .28rem;
            }
        }
    }
</style>
