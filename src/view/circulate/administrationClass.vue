<template>
    <div>
        <div class="headWrap">
            <div class="teacherHead flex">
                <div class="headImg">
                    <img :src="userInfo.photoUrl" alt="">
                </div>
                <div class="teacherText">
                    <p class="name color_fff font_30"><span class="margin_right_20">{{userInfo.teacherName}}</span><span>老师</span></p>
                    <p class="mechanism color_fff font_30">{{userInfo.trainingSchoolName}}</p>
                </div>
            </div>
            <div class="searchVal flex">
                <div class="item">
                    <van-dropdown-menu>
                        <van-dropdown-item v-model="searchGrade" :options="optionGrade" @change="gradeChange($event)"/>
                    </van-dropdown-menu>
                </div>
                <div class="item">
                    <van-dropdown-menu>
                        <van-dropdown-item v-model="searchClass" :options="optionClass" @change="classChange($event)"/>
                    </van-dropdown-menu>
                </div>
            </div>
        </div>
        <div class="contentLists">

            <div
                class="init"
                v-for="(item,index) in contentLists"
                :key="index"
                @click="toDetailsPage(item.id)">
                <div class="top clearfix">
                    <div class="Batch-number float_left color_333">
                        <span>{{item.name}}</span>
                    </div>
                    <div class="status float_right">
                        <span class="status0">进入班级</span>
                    </div>
                </div>
                <div class="message flex">
                    <div class="left">
                        <span>创建时间</span>
                        <span>:</span>
                        <span>{{formatDate(item.createTime)}}</span>
                    </div>
                    <div class="right">
                        <span>学员人数</span>
                        <span>:</span>
                        <span>{{item.studentCount}}</span>
                    </div>
                </div>
            </div>

        </div>

    </div>
</template>
<style type="text/css">
    .headWrap .van-dropdown-menu.van-hairline--top-bottom{
        height: 40px;
    }
    .headWrap .van-cell.van-cell--clickable:first-child{
        display: none;
    }
    .headWrap .van-dropdown-menu__item .van-dropdown-menu__title .van-ellipsis{
        font-size: .26rem !important;
        padding: 2px 15px;
        border-radius: 15px;
        background: #F8F8F8;
        height: 30px;
        line-height: 26px;
    }
    .headWrap .van-cell__title{
        font-size: .24rem !important;
    }

    .headWrap .van-dropdown-menu__title::after{
        border-width: 2px;
        /*border-color: ;*/
        top: 10px;
        border-bottom-color: #999;
        border-left-color: #999;
    }
    .headWrap .van-popup.van-popup--top.van-dropdown-item__content{
        max-height: 60vh;
    }
</style>
<script>
import FooterBar from '../../components/footerBar'
export default {
  components: {
    FooterBar
  },
  data () {
    return {
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
      active: 0,
      isShowAddUpload: false,
      isShowOption: false,
      contentLists: [],
      optionGrade: [
        { text: '年级', value: '0' },
        {text: '全部', value: 'all'}
      ],
      searchGrade: '0',
      searchGradeId: 0,
      optionClass: [
        { text: '班级', value: '0' },
        { text: '请先选择年级', value: 'code' }
      ],
      searchClass: '0',
      searchClassId: 0
    }
  },
  mounted () {
    this.getAllClassName()
    this.getAllGrade()
  },
  methods: {

    /** 时间戳转日期. */
    formatDate (time) {
      const now = new Date(time)
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      const date = now.getDate()
      // const hour = now.getHours()
      // const minute = now.getMinutes()
      // const second = now.getSeconds()
      // return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
      return year + '-' + month + '-' + date
    },

    /** 获取班级列表. */
    getAllClassName () {
      const parm = this.$Qs.stringify({
        grade: this.searchGradeId,
        classId: this.searchClassId,
        openId: localStorage.getItem('oid')
      })
      this.$api.getOpenIdAllClassNameApi(parm).then((res) => {
        if (res.data.code * 1 === 200) {
          this.contentLists = res.data.data
        }
      })
    },

    /** 获取所有年级. */
    getAllGrade () {
      this.$api.getAllGradeApi().then(res => {
        if (res.data.code * 1 === 200) {
          for (let i = 0; i < res.data.data.length; i++) {
            let obj = {
              value: res.data.data[i].code,
              text: res.data.data[i].name
            }
            this.optionGrade.push(obj)
          }
        }
      })
    },

    /** 年级选择时更新列表和更新班级选择列表. */
    gradeChange (event) {
      this.optionClass = [
        { text: '班级', value: '' }
      ]
      this.searchClass = ''
      if (event === 'all') event = '0'
      this.searchClassId = '0'
      this.searchGradeId = event
      this.getConditionClassApi(event)
      this.getAllClassName()
    },

    /** 班级选择改变时. */
    classChange (event) {
      if (event === 'code' || event === 'not') {
        this.searchClass = ''
        return false
      }
      this.searchClassId = event
      this.getAllClassName()
    },

    /** 条件获取班级列表. */
    getConditionClassApi (gradeId) {
      const parm = this.$Qs.stringify({
        grade: gradeId,
        trainingSchoolId: JSON.parse(sessionStorage.getItem('userInfo')).trainingSchoolId
      })
      this.$api.getConditionClassApi(parm).then((res) => {
        if (res.data.code * 1 === 200) {
          if (res.data.data.length === 0) {
            let obj = {
              value: 'not',
              text: '该年级下暂无班级列表'
            }
            this.optionClass.push(obj)
          }
          for (let i = 0; i < res.data.data.length; i++) {
            let obj = {
              value: res.data.data[i].id,
              text: res.data.data[i].name
            }
            this.optionClass.push(obj)
          }
        }
      })
    },

    toDetailsPage (itemId) {
      this.$router.push({
        path: '/classDetails',
        query: {
          itemId: itemId
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
    @import "../../style/common";

    .headWrap {
        box-shadow: 0 6px 10px rgba(45, 146, 239, .15);

        .teacherHead {
            width: 100%;
            padding: 0 20px;
            height: 2rem;
            background: url("../../assets/images/teacherTopBg.png");

            .headImg {
                width: 1.4rem;
                height: 100%;
                font-size: 0;
                padding-top: .3rem;

                img {
                    width: 100%;
                    height: 1.4rem;
                    border-radius: 100%;
                    vertical-align: middle;
                }
            }

            .teacherText {
                margin-left: .3rem;

                .name {
                    margin-top: .5rem;
                    margin-bottom: .1rem;
                }
            }
        }

        .searchVal {
            height: 40px;
            background: #fff;
            padding: 0 20px;
            justify-content: space-between;
            position: -webkit-sticky;
            position: sticky;
            top: 0;
            z-index: 2;
            box-shadow: 0 2px 10px 2px rgba(45, 146, 239, .15);
            .item {
                width: 50%;
            }
        }
    }
    .contentLists{
        padding: 10px 20px;
        background: #F8FAFC;
        .init{
            position: relative;
            margin-bottom: .3rem;
            padding: 6px 6px 6px 20px;
            border-radius: 6px;
            background: #fff;
            &:before{
                position: absolute;
                left: 0;
                top: 0;
                width: 8px;
                height: 100%;
                background: #2D7CED;
                border-radius: 6px 0 0 6px;
                content: '';
            }
            .top{
                margin-bottom: .2rem;
                .status{
                    color: #2D7CED;
                }
            }
            .message{
                justify-content: space-between;
                font-size: .24rem;
                margin-bottom: .1rem;
                color: #969696;
                &:last-child{
                    margin-bottom: 0;
                }
                .left{
                    width: 60%;
                    .two{
                        letter-spacing: 12px;
                    }
                    .three{
                        letter-spacing: 4px;
                    }
                }
                .right{
                    width: 40%;
                }
            }
        }
    }

</style>
