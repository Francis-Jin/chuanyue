<template>
    <div>
        <div class="main">
            <div class="titleMessage">
                <div class="item">
                    <div class="itemLeft">
                        <van-icon :name="require('../../assets/icon/js_pch.png')" />
                        <span>批次号：</span>
                        <span>{{topContent.batchNumber}}</span>
                    </div>
                    <div class="itemRight">
                        <van-icon :name="require('../../assets/icon/js_bj.png')" />
                        <span>班级：</span>
                        <span>{{topContent.className}}</span>
                    </div>
                </div>
                <div class="item">
                    <div class="itemLeft">
                        <van-icon :name="require('../../assets/icon/js_lx.png')" />
                        <span>批改类型：</span>
                        <span>{{topContent.correctTypeName}}</span>
                    </div>
                    <div class="itemRight">
                        <van-icon :name="require('../../assets/icon/js_bzr.png')" />
                        <span>班主任：</span>
                        <span>{{topContent.teacherName}}</span>
                    </div>
                </div>
                <div class="item">
                    <div class="itemLeft">
                        <van-icon :name="require('../../assets/icon/js_sj.png')" />
                        <span>创建时间：</span>
                        <span>{{topContent.createTime}}</span>
                    </div>
                    <div class="itemRight">
                        <van-icon :name="require('../../assets/icon/js_xyrs.png')" />
                        <span>学员人数：</span>
                        <span>{{topContent.studentNumber}}</span>
                    </div>
                </div>
            </div>

            <div class="searchWrap">
                <!--<div class="search">-->
                    <!--<form action="javascript:(function() { return true })()">-->
                        <!--<input type="search" v-model="searchValue" placeholder="你想搜索..." @keypress="searchFn($event)">-->
                        <!--<i class="iconfont icon-search" @click="searchDataFn"></i>-->
                    <!--</form>-->
                <!--</div>-->
                <van-search
                    v-model="searchValue"
                    placeholder="请输入搜索关键词"
                    @search="searchFn"
                />
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
                        <span>批改状态</span>
                    </div>
                    <div class="init">
                        <span>操作</span>
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
                            <span v-if="item.status === 0">未批改</span>
                            <span v-if="item.status === 1">已批改</span>
                        </div>
                        <!--<div class="item" v-if="item.status === 0" @click="targetFn(0)">-->
                            <!--<span class="urge">催阅</span>-->
                        <!--</div>-->
                        <!--<div class="item" v-if="item.status === 1" @click="targetFn(1)">-->
                        <div class="item" @click="targetFn(item.status, item.id)">
                            <span class="del">查看</span>
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
      topContent: {},
      itemId: this.$route.query.itemId,
      lists: [],
      searchValue: ''
    }
  },
  mounted () {
    this.getCorrectionDetails()
  },
  methods: {

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
      this.$api.getCorrectionDetailsApi(parm).then((res) => {
        this.$toast.clear()
        if (res.data.code * 1 === 200) {
          this.topContent = res.data.data.uploadBatch
          this.lists = res.data.data.studentInfoList
        }
      })
    },

    /** 提箱批阅或删除. */
    targetFn (status, id) {
      if (status === 0) {
        this.$toast('待批改')
      } else {
        this.$router.push({
          path: '/correctionDetailsInfo',
          query: {
            itemId: id
          }
        })
      }
    },

    /** 搜索学员. */
    searchFn (e) {
      // if (e.keyCode === 13) {
      this.getCorrectionDetails()
      // }
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
        /*padding:.2rem 20px .2rem;*/
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
                width: 25%;
                height: .8rem;
                line-height: .8rem;
                font-size: .24rem;
                .urge{
                    color: #fff;
                    background: #4276DF;
                    padding: 4px 10px;
                    border-radius: 14px;
                }
                .del{
                    color: #4276DF;
                    border: 1px solid #4276DF;
                    padding: 2px 9px;
                    border-radius: 14px;
                }
            }
        }
        .listItemHead{
            justify-content: space-between;
            text-align: center;
            .init{
                font-size: .28rem;
                font-weight: 600;
                width: 25%;
                height: .8rem;
                line-height: .8rem;
            }
        }
    }

</style>
