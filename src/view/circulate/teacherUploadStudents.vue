<template>
    <div>
        <div class="main">
            <div class="titleMessage">
                <div class="item">
                    <div class="itemLeft">
                        <i class="iconfont icon-fuwenben"></i>
                        <span>批次号：</span>
                        <span>{{topContent.batchNumber}}</span>
                    </div>
                    <div class="itemRight">
                        <i class="iconfont icon-fuwenben"></i>
                        <span>班级：</span>
                        <span>{{topContent.className}}</span>
                    </div>
                </div>
                <div class="item">
                    <div class="itemLeft">
                        <i class="iconfont icon-clover"></i>
                        <span>批改类型：</span>
                        <span>{{topContent.correctTypeName}}</span>
                    </div>
                    <div class="itemRight">
                        <i class="iconfont icon-wo1"></i>
                        <span>班主任：</span>
                        <span>{{topContent.teacherName}}</span>
                    </div>
                </div>
                <div class="item">
                    <div class="itemLeft">
                        <i class="iconfont icon-time" style="font-size: .28rem"></i>
                        <span>创建时间：</span>
                        <span>{{formatDate(topContent.createTime)}}</span>
                    </div>
                    <div class="itemRight">
                        <i class="iconfont icon-wo1"></i>
                        <span>学员人数：</span>
                        <span>{{topContent.studentNumber}}</span>
                    </div>
                </div>
            </div>

            <div class="searchWrap">
                <div class="search">
                    <form action="javascript:(function() { return true })()">
                        <input type="search" v-model="searchValue" placeholder="你想搜索..." @keypress="searchFn($event)">
                        <i class="iconfont icon-search" @click="searchDataFn"></i>
                    </form>
                </div>
            </div>

            <div class="listsWrap">
                <div class="listItemHead flex border_bottom_1">
                    <div class="init">
                        <span>学员姓名</span>
                    </div>
                    <div class="init">
                        <span>机构学号</span>
                    </div>
                    <div class="init">
                        <span>作品上传</span>
                    </div>
                </div>
                <div class="importantContent">
                    <div class="listItem border_bottom_1" v-for="(item,index) in lists" :key="index">
                        <div class="item">
                            <span>{{item.name}}</span>
                        </div>
                        <div class="item">
                            <span>{{item.schoolStudentNumber}}</span>
                        </div>
                        <div class="item">
                            <div class="icon" v-if="item.photoNumber == 0" @click="toUploadPage(item.id)">
                                <i class="iconfont icon-add"></i>
                            </div>
                            <div class="icon" v-else-if="item.photoNumber == 6">
                                <span>{{item.photoNumber}}</span>
                                <i class="iconColor iconfont icon-duiduidui"></i>
                            </div>
                            <div class="icon" v-else @click="toUploadPage(item.id)">
                                <span>{{item.photoNumber}}</span>
                                <i class="iconColor iconfont icon-add"></i>
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
      lists: [],
      itemId: this.$route.query.itemId,
      topContent: '',
      searchValue: ''
    }
  },
  mounted () {
    this.getCorrectionDetails()
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

    /** 根据itemId查询数据 */
    getCorrectionDetails () {
      let parm = this.$Qs.stringify({
        id: this.itemId,
        trainingSchoolId: JSON.parse(sessionStorage.getItem('userInfo')).trainingSchoolId,
        searchName: this.searchValue
      })
      this.$toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0
      })
      this.$api.getCorrectionUploadApi(parm).then((res) => {
        this.$toast.clear()
        if (res.data.code * 1 === 200) {
          this.topContent = res.data.data.uploadBatch
          this.lists = res.data.data.studentInfoList
        }
      })
    },

    /** 跳转到上传页面. */
    toUploadPage (studentsId) {
      this.$router.push({
        path: '/uploadExcellent',
        query: {
          batchId: this.topContent.id,
          schoolId: this.topContent.trainingSchoolId,
          classId: this.topContent.classId,
          gradeId: this.topContent.grade,
          studentsId: studentsId,
          isWhat: this.topContent.correctType
        }
      })
    },

    /** 搜索学员. */
    searchFn (e) {
      if (e.keyCode === 13) {
        this.getCorrectionDetails()
      }
    },

    /** 点击按钮搜索. */
    searchDataFn () {
      this.getCorrectionDetails()
    }

    /** end. */
  }

}
</script>

<style scoped lang="less">
    @import "../../style/common";
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

    .searchWrap{
        padding:.2rem 20px .2rem;
        box-shadow: 0 3px 12px 3px rgba(237,243,251,1);
        .search{
            width: 100%;
            padding: 0 5px;
            height: 30px;
            background: #F8F8F8;
            border-radius: 15px;
            input{
                width: 90%;
                height: 100%;
                border: 0;
                text-indent: .1rem;
                margin-right: .1rem;
                background: transparent;
            }
            i{
                color: #4276DF;
            }
        }
    }

    .listsWrap{
        margin-top: .3rem;
        .listItem{
            display: flex;
            justify-content: space-between;
            text-align: center;

            .item{
                width: 32%;
                height: .8rem;
                line-height: .8rem;
                .icon{
                    color: #C4C4C4;
                    span{
                        padding: 2px 6px;
                        background: #4276DF;
                        color: #ffffff;
                    }
                    .iconColor{
                        color: #4276DF;
                        font-size: .18rem;
                        position: relative;
                        top: .15rem;
                        font-weight: 900;
                    }
                    i{
                        font-size: .24rem;
                    }
                }
            }
        }
        .listItemHead{
            justify-content: space-between;
            text-align: center;
            .init{
                width: 32%;
                height: .8rem;
                line-height: .8rem;
            }
        }
    }

</style>
