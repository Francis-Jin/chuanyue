<template>
    <div class="teacher-wrapper">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">

            <div class="minHeightBox" style="min-height: 100vh;">

                <div class="headWrap">
                    <Banner v-if="userIdent === 'parent'"></Banner>
                    <div v-if="userIdent !== 'parent'" class="teacherHead flex">
                        <div class="headImg">
                            <img :src="userInfo.photoUrl" alt="">
                        </div>
                        <div class="teacherText">
                            <p class="name color_fff font_30"><span>{{userInfo.teacherName}}</span></p>
                            <p class="mechanism color_fff font_30">{{userInfo.trainingSchoolName}}</p>
                        </div>
                    </div>
                    <div class="searchVal flex">

                        <div v-if="userIdent !== 'parent'" class="item" @click="showMoreFn(1)">
                            <div class="text">
                            <span class="wrap">
                                <span>批次号</span>
                                <i class="iconfont icon-down"></i>
                            </span>
                            </div>
                        </div>
                        <div class="item" @click="showMoreFn(2)">
                            <div class="text">
                            <span class="wrap">
                                <span v-if="userIdent !== 'parent'">班级</span>
                                <span v-if="userIdent === 'parent'">年级</span>
                                <i class="iconfont icon-down"></i>
                            </span>
                            </div>
                        </div>
                        <div class="item" @click="showMoreFn(3)">
                            <div class="text">
                            <span class="wrap">
                                <span>批改类型</span>
                                <i class="iconfont icon-down"></i>
                            </span>
                            </div>
                        </div>
                        <div class="item" @click="showMoreFn(4)">
                            <div class="text">
                            <span class="wrap">
                                <span>创建时间</span>
                                <i class="iconfont icon-down"></i>
                            </span>
                            </div>
                        </div>

                        <div class="selectOption">
                            <div class="item">
                                <div class="leftContent">
                                    <span>高三（3）班</span>
                                </div>
                                <div class="icon">
                                    <i class="iconfont icon-me"></i>
                                </div>
                            </div> <div class="item">
                            <div class="leftContent">
                                <span>高三（3）班</span>
                            </div>
                            <div class="icon">
                                <i class="iconfont icon-me"></i>
                            </div>
                        </div> <div class="item">
                            <div class="leftContent">
                                <span>高三（3）班</span>
                            </div>
                            <div class="icon">
                                <i class="iconfont icon-me"></i>
                            </div>
                        </div> <div class="item">
                            <div class="leftContent">
                                <span>高三（3）班</span>
                            </div>
                            <div class="icon">
                                <i class="iconfont icon-me"></i>
                            </div>
                        </div> <div class="item">
                            <div class="leftContent">
                                <span>高三（3）班</span>
                            </div>
                            <div class="icon">
                                <i class="iconfont icon-me"></i>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                <div v-if="contentLists.length > 0" class="contentLists">

                    <div v-if="userIdentity !== 2"
                        class="init"
                        :class="[{'initLeftBg0':item.status===0},{'initLeftBg1':item.status===1},{'initLeftBg2':item.status===2}]"
                        v-for="(item,index) in contentLists"
                        :key="index"
                        @click="toDetailsPage(item.id)">
                        <div class="top clearfix">
                            <div class="Batch-number float_left color_333">
                                <span>批次号：</span>
                                <span>{{item.batchNumber}}</span>
                            </div>
                            <div class="status float_right">
                                <span v-if="item.status === 0" class="status0">待批改</span>
                                <span v-else-if="item.status === 1" class="status1">批改中</span>
                                <span v-else-if="item.status === 2" class="status2">已批改</span>
                            </div>
                        </div>
                        <div class="message flex">
                            <div class="left">
                                <span class="two">班级</span>
                                <span>:</span>
                                <span>{{item.className}}</span>
                            </div>
                            <div class="right">
                                <span>批改类型</span>
                                <span>:</span>
                                <span>{{item.correctTypeName}}</span>
                            </div>
                        </div>
                        <div class="message flex">
                            <div class="left">
                                <span class="three">班主任</span>
                                <span>:</span>
                                <span>{{item.teacherName}}</span>
                            </div>
                            <div class="right">
                                <span>上传老师</span>
                                <span>:</span>
                                <span>{{item.createUserName}}</span>
                            </div>
                        </div>
                        <div class="message flex">
                            <div class="left">
                                <span>创建时间</span>
                                <span>:</span>
                                <span>{{item.createTime}}</span>
                            </div>
                            <div class="right">
                                <span>学员人数</span>
                                <span>:</span>
                                <span>{{item.studentNumber}}</span>
                            </div>
                        </div>
                    </div>

                    <div v-if="userIdentity == 2"
                        class="init"
                        :class="[{'initLeftBg0':item.status===0},{'initLeftBg1':item.status===1},{'initLeftBg2':item.status===2}]"
                        v-for="(item,index) in contentLists"
                        :key="index"
                        @click="toDetailsPage(item.id, item.status)">
                        <div class="top clearfix">
                            <div class="Batch-number float_left color_333">
                                <span>创建时间：</span>
                                <span>{{formatDate(item.createTime)}}</span>
                            </div>
                            <div class="status float_right">
                                <span v-if="item.status === 0" class="status0">待批改</span>
                                <span v-else-if="item.status === 1" class="status1">批改中</span>
                                <span v-else-if="item.status === 2" class="status2">已批改</span>
                            </div>
                        </div>
                        <div class="message flex">
                            <div class="left">
                                <span class="two">班级</span>
                                <span>:</span>
                                <span>{{item.className}}</span>
                            </div>
                            <div class="right">
                                <span class="three">姓名</span>
                                <span>:</span>
                                <span>{{item.studentName}}</span>
                            </div>

                        </div>
                        <div class="message flex">
                            <div class="left">
                                <span>批改类型</span>
                                <span>:</span>
                                <span>{{item.correctTypeName}}</span>
                            </div>
                            <div class="right">
                                <span class="three">班主任</span>
                                <span>:</span>
                                <span>{{item.teacherName}}</span>
                            </div>
                        </div>
                    </div>

                </div>

                <div v-else style="width: 100%;text-align: center; color: #999;line-height: 200px;">
                    <span>暂无数据</span>
                </div>

            </div>
            <div v-if="isShowAddUpload" class="modalWrap">
                <div class="modalContent">
                    <div class="bindTitle">
                        <span>新建批次号</span>
                    </div>
                    <div class="formLists">
                        <div class="item">
                            <div class="inputContent">
                                <span class="color_4276DF">批次号(自动生成)</span>
                            </div>
                        </div>
                        <div class="item">
                            <div class="inputContent">
                                <!--<input type="number" placeholder="请输入班级">-->
                                <template>
                                    <el-select v-model="selectedGrade" placeholder="请选择年级" @change="gradeChangeFn($event)">
                                        <el-option
                                            v-for="item in optionsGrade"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </template>
                            </div>
                        </div>
                        <div class="item">
                            <div class="inputContent">
                                <!--<input type="number" placeholder="请输入班级">-->
                                <template>
                                    <el-select v-model="selectedClass" placeholder="请选择班级">
                                        <el-option
                                            v-for="item in optionsClass"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </template>
                            </div>
                        </div>
                        <div class="item">
                            <div class="inputContent">
                                <template>
                                    <el-select v-model="selectedType" placeholder="请选择批改类型">
                                        <el-option
                                            v-for="item in optionsType"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class="btn">
                        <div class="subBtn" @click="addUploadFn">
                            <span>取消</span>
                        </div>
                        <div class="subBtn" @click="toLinkPage">
                            <span>确定</span>
                        </div>
                    </div>
                </div>
            </div>

        </van-pull-refresh>

        <div class="proup">
            <van-popup v-model="showPicker" position="bottom">
                <van-picker
                    v-if="clickSearchIndex != 4"
                    :columns="columns"
                    @cancel="showPicker = false"
                    @change="onPickerChangeFn"
                />
                <div>
                    <div class="selectDate" v-if="clickSearchIndex === 4">
                        <div class="contentDate">
                            <van-cell-group>
                                <van-cell title="开始时间:" :value="startDate" @click="selectedDateFn(1)"/>
                                <van-cell title="结束时间:" :value="endDate" @click="selectedDateFn(2)"/>
                            </van-cell-group>

                            <div class="dateBtn margin_top_30 text_center">
                                <van-button type="info" size="normal" @click="confirmDateFn">确 定</van-button>
                            </div>
                        </div>
                    </div>
                </div>
            </van-popup>
            <van-popup v-model="showDatePicker" position="bottom">
                <van-datetime-picker
                    v-model="currentDate"
                    type="date"
                    @cancel="showDatePicker = false"
                    @confirm="confirmSelectedDate"
                />
            </van-popup>
        </div>
        <!--添加上传-->
        <MoveBtn v-if="htmlTitle==='作品上传'" @onFloatBtnClicked="addUploadFn"></MoveBtn>
        <FooterBar :curIndex='1' v-if="!showFooterBar && userIdent !== 'parent'"></FooterBar>
    </div>
</template>

<script>
import Banner from '../../components/banner'
import FooterBar from '../../components/footerBar'
import MoveBtn from '../../components/moveBtn'
export default {
  components: {
    FooterBar,
    Banner,
    MoveBtn
  },
  data () {
    return {
      userIdentity: localStorage.getItem('identity') * 1,
      isLoading: false, // 下来刷新
      showFooterBar: this.$route.query.showFooterBar,
      htmlTitle: this.$route.query.title,
      userInfo: '',
      active: 0,
      userIdent: this.$route.query.userIdent,
      hideAddUpload: this.$route.query.hideAddUpload,
      isShowAddUpload: false,
      isShowOption: false,
      contentLists: [],
      pageNum: 1,
      optionsClass: [],
      selectedClass: '',
      optionsGrade: [],
      selectedGrade: '',
      optionsType: [{value: '1', label: '作文批改'}, {value: '2', label: '作文精批'}, {value: '3', label: '同步辅导'}],
      selectedType: '',
      myBanJiName: '',
      myTypeName: '',
      showPicker: false,
      showDatePicker: false,
      columns: [
        {
          text: '上海',
          id: 1
        },
        {
          text: '北京',
          id: 2
        }
      ],
      searchClassLists: [],
      searchBatchLists: [],
      searchGradeLists: [],
      searchGradeId: 0, // 年纪id
      batchNumberId: 0, // 批次id
      searchClassId: 0, // 班级id
      searchType: 0, // 类型id
      searchDate: '', // 日期选择
      clickSearchIndex: 0, // 点击搜索的索引值
      selectedDateIndex: 0, // 点击选择日期的索引值
      currentDate: new Date(),
      startDate: '',
      endDate: '',
      page: 1
    }
  },
  mounted () {
    this.setSessionUserInfoFn()
    document.title = this.htmlTitle
    if (this.userIdent !== 'parent') {
      if (this.htmlTitle === '作品上传') {
        this.getUploadLists()
      } else {
        this.getCorrectionLists()
      }
      this.getAllGrade()
      this.getBatchLists()
      this.getOpenIdClassLists()
    } else {
      this.getAllGrade()
      this.getCorrectionReportLists()
    }
  },
  methods: {

    /** 设置下拉刷新. */
    onRefresh () {
      this.showPicker = false
      this.showDatePicker = false
      setTimeout(() => {
        this.batchNumberId = 0
        this.searchClassId = 0
        this.searchType = 0
        this.searchDate = ''
        this.getCorrectionLists()
        this.isLoading = false
      }, 500)
    },

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

    /** 家长获取批改报告列表. */
    getCorrectionReportLists () {
      let params = this.$Qs.stringify({
        grade: this.searchGradeId,
        correctType: this.searchType,
        createTimeQuery: this.searchDate,
        id: JSON.parse(sessionStorage.getItem('userInfo')).id,
        page: this.page,
        limit: this.GLOBAL.LISTS_LIMIT
      })
      this.$toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0
      })
      this.$api.getCorrectionReportListsApi(params).then(res => {
        this.$toast.clear()
        if (res.data.code * 1 === 200) {
          this.contentLists = res.data.data
        }
      })
    },

    /** 设置缓存用户信息. */
    setSessionUserInfoFn () {
      if (!JSON.parse(sessionStorage.getItem('userInfo')).account) {
        this.getUrserInfoData()
      } else {
        this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      }
    },

    /** 获取批次号列表. */
    getBatchLists () {
      let parm = this.$Qs.stringify({
        userId: JSON.parse(sessionStorage.getItem('userInfo')).id
      })
      this.$api.getBatchListsApi(parm).then(res => {
        if (res.data.code * 1 === 200) {
          const d = res.data.data
          let lists = []
          for (let i = 0; i < d.length; i++) {
            let obj = {
              text: d[i].batchNumber,
              id: d[i].id
            }
            lists.push(obj)
          }
          this.searchBatchLists = lists
        }
      })
    },

    /** 获取查询条件班级列表. */
    getOpenIdClassLists () {
      let parm = this.$Qs.stringify({
        openId: localStorage.getItem('oid')
      })
      this.$api.getOpenIdAllClassNameApi(parm).then(res => {
        if (res.data.code * 1 === 200) {
          const d = res.data.data
          let lists = []
          for (let i = 0; i < d.length; i++) {
            let obj = {
              text: d[i].name,
              id: d[i].id
            }
            lists.push(obj)
          }
          this.searchClassLists = lists
        }
      })
    },

    /** 是否显示选择器弹出层. */
    showMoreFn (index) {
      this.clickSearchIndex = index
      if (index === 1) this.columns = this.searchBatchLists
      if (index === 2) this.columns = this.searchClassLists
      if (index === 2 && this.userIdent === 'parent') this.columns = this.searchGradeLists
      if (index === 3) this.columns = [{text: '作文批改', id: 1}, {text: '作文精批', id: 2}, {text: '同步辅导', id: 3}]
      this.showPicker = true
    },

    /** 点击选择日期按钮. */
    selectedDateFn (index) {
      this.showDatePicker = true
      this.selectedDateIndex = index
    },

    /** 点击选择日期确定按钮. */
    confirmSelectedDate (e) {
      const y = e.getFullYear()
      const m = e.getMonth() + 1
      const d = e.getDate()
      const str = y + '-' + m + '-' + d
      console.log(str + '====')
      if (this.selectedDateIndex * 1 === 1) this.startDate = str
      if (this.selectedDateIndex * 1 === 2) this.endDate = str
      this.showDatePicker = false
    },

    /** 确定选择的时间段. */
    confirmDateFn () {
      if (!this.isNullFn(this.startDate, '请选择开始时间')) return false
      if (!this.isNullFn(this.endDate, '请选择结束时间')) return false
      const dataStr = this.startDate + '~' + this.endDate
      const startNum = parseInt(this.startDate.replace(/-/g, ''))
      const endNum = parseInt(this.endDate.replace(/-/g, ''))
      if (startNum > endNum) {
        this.endDate = ''
        this.$toast.fail('结束日期不能再开始日期之前,请重新选择')
        return false
      }
      this.searchDate = dataStr
      this.getCorrectionLists()
      this.showPicker = false
    },

    /** 获取批改列表. */
    getCorrectionLists () {
      let parms = this.$Qs.stringify({
        page: this.pageNum,
        limit: this.GLOBAL.LISTS_LIMIT,
        trainingSchoolId: JSON.parse(sessionStorage.getItem('userInfo')).trainingSchoolId,
        openId: localStorage.getItem('oid'),
        id: this.batchNumberId,
        classId: this.searchClassId,
        correctType: this.searchType,
        createTimeQuery: this.searchDate
      })
      this.$api.getCorrectionListsApi(parms).then((res) => {
        if (res.data.code * 1 === 200) {
          this.contentLists = res.data.data
        }
      }).catch((error) => {
        console.log('网络错误' + error)
      })
    },

    /** 获取上传列表. */
    getUploadLists () {
      let parms = this.$Qs.stringify({
        page: this.pageNum,
        limit: this.GLOBAL.LISTS_LIMIT,
        trainingSchoolId: JSON.parse(sessionStorage.getItem('userInfo')).trainingSchoolId,
        openId: localStorage.getItem('oid'),
        id: this.batchNumberId,
        classId: this.searchClassId,
        correctType: this.searchType,
        createTimeQuery: this.searchDate
      })
      this.$api.getUploadListsApi(parms).then((res) => {
        if (res.data.code * 1 === 200) {
          this.contentLists = res.data.data
        }
      }).catch((error) => {
        console.log('网络错误' + error)
      })
    },

    /** 获取所有年级. */
    getAllGrade () {
      this.$api.getAllGradeApi().then(res => {
        if (res.data.code * 1 === 200) {
          let lists = []
          if (this.userIdent !== 'parent') {
            for (let i = 0; i < res.data.data.length; i++) {
              let obj = {
                value: res.data.data[i].code,
                label: res.data.data[i].name
              }
              lists.push(obj)
            }
            this.optionsGrade = lists
          } else {
            for (let i = 0; i < res.data.data.length; i++) {
              let obj = {
                id: res.data.data[i].code,
                text: res.data.data[i].name
              }
              lists.push(obj)
            }
            this.searchGradeLists = lists
          }
        }
      })
    },

    /** 选择年级改变时更新班级列表. */
    gradeChangeFn (event) {
      this.getConditionClassApi(event)
    },

    /** 条件获取班级列表. */
    getConditionClassApi (gradeId) {
      const parm = this.$Qs.stringify({
        grade: gradeId,
        trainingSchoolId: JSON.parse(sessionStorage.getItem('userInfo')).trainingSchoolId
      })
      this.$api.getConditionClassApi(parm).then((res) => {
        if (res.data.code * 1 === 200) {
          console.log(res)
          let lists = []
          for (let i = 0; i < res.data.data.length; i++) {
            let obj = {
              value: res.data.data[i].id,
              label: res.data.data[i].name
            }
            lists.push(obj)
          }
          this.optionsClass = lists
        }
      })
    },

    addUploadFn () {
      this.isShowAddUpload = !this.isShowAddUpload
    },
    /** 随机字母字符串. */
    randomWord (randomFlag, min, max) {
      let str = ''
      let range = min
      const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
        'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

      if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min// 任意长度
      }
      for (let i = 0; i < range; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1))
        str += arr[pos]
      }
      return str
    },

    /** 跳转到班级作业上传页面. */
    toLinkPage () {
      /** 变量定义. */
      const myDate = new Date()
      const y = myDate.getFullYear()
      const m = myDate.getMonth() + 1
      const d = myDate.getDate()
      const h = myDate.getHours()
      const min = myDate.getMinutes()
      const s = myDate.getSeconds()
      const string = y + this.dateUtil(m) + this.dateUtil(d) + this.dateUtil(h) + this.dateUtil(min) + this.dateUtil(s) + '' + this.randomWord(false, 4)
      console.log(string)
      if (!this.isNullFn(this.selectedClass, '请选择班级')) return false
      if (!this.isNullFn(this.selectedType, '请选择批改类型')) return false

      for (let i = 0; i < this.optionsClass.length; i++) {
        if (this.selectedClass * 1 === this.optionsClass[i].value * 1) {
          this.myBanJiName = this.optionsClass[i].label
        }
      }
      for (let i = 0; i < this.optionsType.length; i++) {
        if (this.selectedType * 1 === this.optionsType[i].value * 1) {
          this.myTypeName = this.optionsType[i].label
        }
      }

      const parms = this.$Qs.stringify({
        grade: this.selectedGrade,
        batchNumber: string,
        trainingSchoolId: JSON.parse(sessionStorage.getItem('userInfo')).trainingSchoolId,
        correctType: this.selectedType,
        createUser: JSON.parse(sessionStorage.getItem('userInfo')).id,
        classId: this.selectedClass
      })

      this.$api.uploadBatchApi(parms).then((res) => {
        console.log(res)
        if (res.data.code * 1 === 200) {
          this.$router.push({
            path: 'teacherUploadStudents',
            query: {
              itemId: res.data.data
            }
          })
        }
      })
    },

    /** 判断是否小于10然后加0 */
    dateUtil (str) {
      if (str < 10) {
        return '0' + str
      } else {
        return str
      }
    },

    /** 选择器选择选择改变时. */
    onPickerChangeFn (picker, value) {
      const clickSearchIndex = this.clickSearchIndex
      if (clickSearchIndex * 1 === 1) this.batchNumberId = value.id
      if (clickSearchIndex * 1 === 2) this.searchClassId = value.id
      if (clickSearchIndex * 1 === 2 && this.userIdent === 'parent') this.searchGradeId = value.id
      if (clickSearchIndex * 1 === 3) this.searchType = value.id
      this.userIdent === 'parent' ? this.getCorrectionReportLists() : this.getCorrectionLists()
      this.showPicker = false
    },

    /** 判断是否为空工具并显示提示内容 */
    isNullFn (value, msg) {
      if (!value) {
        this.$toast({
          message: msg,
          duration: 1000
        })
        return false
      }
      return true
    },

    /** 列表点击跳转详情页面. */
    toDetailsPage (itemId, status) {
      if (this.userIdent !== 'parent' && this.htmlTitle !== '作品上传') {
        this.$router.push({
          path: '/correctionDetails',
          query: {
            'itemId': itemId
          }
        })
      } else if (this.userIdent !== 'parent' && this.htmlTitle === '作品上传') {
        this.$router.push({
          path: '/teacherUploadStudents',
          query: {
            'itemId': itemId
          }
        })
      } else {
        if (status === 0 || status === 1) {
          this.$toast({
            message: status === 0 ? '待批改' : '正在批改中'
          })
        } else {
          this.$router.push({
            path: '/correctionDetailsInfo',
            query: {
              itemId: itemId
            }
          })
        }
      }
    },

    /** 获取用户信息并存储. */
    getUrserInfoData () {
      let parm = this.$Qs.stringify({
        openId: localStorage.getItem('oid')
      })
      this.$api.getUrserInfoApi(parm).then((res) => {
        if (res.data.code * 1 === 200) {
          const userInfo = res.data.data

          this.userInfo = userInfo

          if (userInfo.photoUrl.indexOf('http') === -1) userInfo.photoUrl = this.GLOBAL.BEFORE_IMG_URL + userInfo.photoUrl

          this.userInfoPhotoUrl = userInfo.photoUrl

          sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
        }
      })
    }

    /** end. */
  }
}
</script>

<style type="text/css">
    .teacher-wrapper .inputContent .el-select{
        width: 100%;
        height: 100%;
    }
    .teacher-wrapper .el-input {
        font-size: 0.24rem !important;
        height: 26px !important;
        position: absolute;
        top: -1px;
        left: 0;
        border-radius: 14px;
    }
    .teacher-wrapper .el-input input.el-input__inner {
        height: 100% !important;
        border: 0 !important;
        border-radius: 14px;
        background: transparent;
        width: 100% !important;
        height: 26px !important;
        line-height: 26px !important;
    }
    .teacher-wrapper .el-input__suffix {
        right: 0 !important;
        padding: 0 10px !important;
    }
    .teacher-wrapper .el-input__icon {
        line-height: 26px !important;
    }
    .teacher-wrapper .el-select-dropdown__item {
        font-size: 0.24rem;
    }
    .teacher-wrapper .el-select-dropdown {
        max-height: 4rem;
    }
    .teacher-wrapper .el-select-dropdown__wrap {
        max-height: 4rem;
    }
    .teacher-wrapper .el-select-dropdown__empty {
        font-size: 0.24rem;
    }
</style>

<style scoped lang="less">
    @import "../../style/common";
    body{
        background: #F8FAFC;
    }
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
            height: .8rem;
            background: #fff;
            padding: 0 20px;
            justify-content: space-between;
            position: -webkit-sticky;
            position: sticky;
            top: 0;
            z-index: 2;
            .item {
                width: 23%;
                line-height: .8rem;
                font-size: .24rem;
                .text {
                    text-align: center;
                }

                i {
                    font-size: .24rem;
                }

                .wrap {
                    padding: .1rem .2rem;
                    background: #f8f8f8;
                    border-radius: .2rem;
                }
            }
            .selectOption{
                position: absolute;
                left: 0;
                top: .8rem;
                width: 100%;
                min-height: 40px;
                padding: .1rem 20px;
                background: #fff;
                display: none;
                z-index: revert;
                border-top: 1px solid #eee;
                .item{
                    width: 100%;
                    display: flex;
                    height: .5rem;
                    line-height: .5rem;
                    justify-content: space-between;
                    .leftContent{
                        width: 80%;
                        font-size: .24rem;
                    }
                    .icon{
                        width: 20%;
                        text-align: right;
                    }
                }
            }
        }
    }
    .contentLists{
        padding: 10px 20px;
        background: #F7F9FC;
        .init{
            position: relative;
            margin-bottom: .3rem;
            padding: 6px 6px 6px 20px;
            background: #fff;
            border-radius: 6px;
            &:before{
                position: absolute;
                left: 0;
                top: 0;
                width: 8px;
                height: 100%;
                border-radius: 6px 0 0 6px;
                content: '';
            }
            &.initLeftBg0:before{
                background: #E31414;
            }
            &.initLeftBg1:before{
                background: #2D7CED;
            }
            &.initLeftBg2:before{
                background: #FFC62F;
            }
            .top{
                margin-bottom: .2rem;
                .Batch-number{
                    font-size: .28rem;
                }
                .status0{
                    color: #E31414;
                }
                .status1{
                    color: #2D7CED;
                }
                .status2{
                    color: #FFC62F;
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

    .addUpload{
        position: fixed;
        width: 1.4rem;
        height: 1.4rem;
        transition: all 0.3s;
        background: #ffffff;
        border-radius: 100%;
        text-align: center;
        line-height: 1.4rem;
        box-shadow: 0 0 10px 2px rgba(0,0,0,.2);

        i{
            color: #4276DF;
            font-size: .5rem;
        }
    }

    .modalWrap{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.15);
        z-index: 21;
        .modalContent{
            width: 80%;
            min-height: 5rem;
            position: absolute;
            left: 10%;
            top: 20%;
            background: #fff;
            border-radius: 10px;
            overflow: hidden;
            .bindTitle{
                width: 110px;
                height: 60px;
                text-align: center;
                margin-left: .2rem;
                line-height: 60px;
                font-size: .32rem;
                color: #4276DF;
                position: relative;
                &:after{
                    position: absolute;
                    left: 10%;
                    bottom: 16px;
                    content: "";
                    width: 80%;
                    height: 4px;
                    background: #4276DF;
                    border-radius: 8px;
                }
                span{
                    position: relative;
                    z-index: 2;
                    font-weight: 400;
                }
            }
            .formLists{
                width: 80%;
                min-height: 2rem;
                margin: 20px auto;
                .item{
                    display: flex;
                    height: 30px;
                    line-height: 30px;
                    margin-bottom: .4rem;
                    justify-content: space-between;
                    .label{
                        width: 20%;
                        color: #4276DF;
                        font-size: .28rem;
                        font-weight: 500;
                    }
                    .inputPhone{
                        width: 40%;
                        border-radius: 15px;
                        border: 1px solid #4276DF;
                        padding: 2px 0 2px 0;
                    }
                    .inputContent{
                        width: 100%;
                        border-radius: 15px;
                        border: 1px solid #4276DF;
                        box-sizing: border-box;
                        padding: 2px 0 2px 0;
                        .color_4276DF{
                            position: relative;
                            left: .5rem;
                            top: -.02rem;
                        }
                    }
                    .itemBtn{
                        width: 30%;
                        text-align: center;
                        border: 1px solid #4276DF;
                        border-radius: 20px;
                        box-sizing: border-box;
                        color: #4276DF;
                    }
                    input{
                        position: relative;
                        top: -1px;
                        width: 100%;
                        height: 100%;
                        box-sizing: border-box;
                        padding: 0 .1rem;
                        border-radius: 15px;
                        border: 0;
                    }
                }
            }
            .btn{
                height: 50px;
                width: 100%;
                display: flex;
                text-align: center;
                line-height: 50px;
                color: #fff;
                background: #F4F4F4;
                font-size: .28rem;
                .subBtn{
                    width: 50%;
                    &:first-child{
                        color: #999;
                    }
                    &:last-child{
                        color: #fff;
                        background: #4276DF;
                    }
                }
            }
        }
    }

    .selectDate{
        min-height: 2rem;
        background: #fff;
        .contentDate{
            width: 80%;
            margin: 1rem auto;
        }
    }
</style>
