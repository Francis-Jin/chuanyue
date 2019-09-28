<template>
    <div class="bindMain">
        <div class="background_white"></div>
        <div class="content">
            <div class="bindTitle">
                <span>教师认证</span>
            </div>
            <div class="formLists">
                <div class="item">
                    <div class="label">
                        <span>手机号</span>
                    </div>
                    <div class="inputContent">
                        <input
                            type="number"
                            v-model="phone"
                            @blur="inputBlurFn('phone')"
                        />
                    </div>
                </div>
                <div v-if="userIdentity === 2" class="item">
                    <div class="label">
                        <span>学员姓名</span>
                    </div>
                    <div class="inputContent">
                        <input
                            type="text"
                            v-model="name"
                            @blur="inputBlurFn('name')"
                        />
                    </div>
                </div>
                <div v-if="userIdentity === 2" class="item">
                    <div class="label">
                        <span>机构学号</span>
                    </div>
                    <div class="inputContent">
                        <input
                            type="text"
                            placeholder=""
                            v-model="studentId"
                            @blur="inputBlurFn"
                        />
                    </div>
                </div>
                <div v-if="userIdentity === 1"
                    class="item">
                    <div class="label">
                        <span>机构名称</span>
                    </div>
                    <div class="inputContent">
                        <template>
                            <!--filterable 是否可以搜索-->
                            <el-select
                                v-model="selectedValue"
                                placeholder="请选择机构名称"
                                @blur="inputBlurFn"
                            >
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </template>
                    </div>
                </div>
                <div class="item">
                    <div class="label">
                        <span>验证码</span>
                    </div>
                    <div class="inputPhone">
                        <input
                            v-model="code"
                            type="number"
                            @blur="inputBlurFn('code')"
                        />
                    </div>
                    <div class="itemBtn">
                        <span v-show="show" @click="getCode">获取验证码</span>
                        <span v-show="!show" class="count" style="color: #999">{{count}} s</span>
                    </div>
                </div>
            </div>
            <div class="btn" @click="confirmUserFn">
                <span>认证</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    identity: Number
  },
  data () {
    return {
      show: true,
      count: '',
      timer: null,

      userIdentity: this.identity * 1,
      options: [],
      selectedValue: '', // 选择机构时的id
      code: '', // 输入验证码
      studentId: '',
      phone: '', // 输入手机号
      name: '' // 输入学生姓名
    }
  },
  mounted () {
    console.log(this.userIdentity)
    this.getMechanismLists()
  },
  methods: {

    /** 点击获取验证码时. */
    getCode () {
      if (!this.phone) {
        this.$toast({
          duration: 1000,
          message: '请输入手机号'
        })
        return false
      }
      const TIME_COUNT = 60

      if (!this.timer) {
        this.count = TIME_COUNT

        this.show = false

        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            if (this.count === 60) {
              this.sendSmsCode()
            }
            this.count--
          } else {
            this.show = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    },

    /** 调接口获取短信验证码. */
    sendSmsCode () {
      let parms = this.$Qs.stringify({
        phone: this.phone,
        type: this.userIdentity
      })
      this.$api.sendSmsCode(parms).then(res => {

      })
    },

    /** input框失去焦点事件. */
    inputBlurFn (thisTypeName) {
      document.body.scrollTop = 0
      if (thisTypeName === 'phone') {
        const rep = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
        if (!rep.test(this.phone)) {
          this.phone = ''
          this.$toast({
            message: '请输入正确号码',
            duration: 1000
          })
        }
      }
    },

    /** 获取机构列表. */
    getMechanismLists () {
      this.$api
        .getMechanismLists()
        .then(res => {
          if (res.data.code * 1 === 200) {
            let lists = []
            for (let i = 0; i < res.data.data.length; i++) {
              let obj = {
                value: res.data.data[i].id,
                label: res.data.data[i].name
              }
              lists.push(obj)
            }
            console.log(lists)
            this.options = lists
          }
        })
        .catch(error => {
          console.log('网络错误' + error)
        })
    },

    /** 获取验证码. */
    getPhoneCode () {},

    /** 教师认证. */
    teacherLogin (parms) {
      this.$api
        .teacherLogin(parms)
        .then(res => {
          if (res.data.code * 1 === 200) {
            if (localStorage.getItem('isBackTwo') === 'true') {
              this.$router.go(-2)
            } else {
              this.$router.push({
                path: 'circulateIndex?clear=true'
              })
              localStorage.setItem('identity', this.userIdentity)
              this.getUrserInfo()
            }
          } else {
            this.$toast.fail({
              message: res.data.message,
              duration: 1000
            })
          }
        })
        .catch(error => {
          console.log('网络错误' + error)
        })
    },

    /** 家长认证. */
    parentLogin (parms) {
      this.$api
        .parentLogin(parms)
        .then(res => {
          if (res.data.code * 1 === 200) {
            if (localStorage.getItem('isBackTwo') === 'true') {
              this.$router.go(-2)
            } else {
              this.$router.push({
                path: 'circulateIndex?clear=true'
              })
              localStorage.setItem('identity', this.userIdentity)
              this.getUrserInfo()
            }
          } else {
            this.$toast.fail({
              message: res.data.message,
              duration: 1000
            })
          }
        })
        .catch(error => {
          console.log('网络错误' + error)
        })
    },

    /** 普通用户认证. */
    userLogin (parms) {
      this.$api
        .userLogin(parms)
        .then(res => {
          if (res.data.code * 1 === 200) {
            if (localStorage.getItem('isBackTwo') === 'true') {
              this.$router.go(-2)
            } else {
              this.$router.push({
                path: 'circulateIndex?clear=true'
              })
              localStorage.setItem('identity', this.userIdentity)
              this.getUrserInfo()
            }
          } else {
            this.$toast.fail({
              message: res.data.message,
              duration: 1000
            })
          }
        })
        .catch(error => {
          console.log('网络错误' + error)
        })
    },

    /** 点击认证按钮提交认证. */
    confirmUserFn () {
      /** userIdentity   1教师、2家长、3普通用户. */
      let userIdentity = this.userIdentity

      if (!this.isNullFn(this.phone, '手机号不能为空')) return false
      if (userIdentity === 2) {
        if (!this.isNullFn(this.name, '请输入学生姓名')) return false
        if (!this.isNullFn(this.studentId, '请输入机构学号')) return false
      }
      if (userIdentity === 1) {
        if (!this.isNullFn(this.selectedValue, '请选择机构')) { return false }
      }
      if (!this.isNullFn(this.code, '验证码不能为空')) return false

      if (userIdentity === 1) {
        let parms = this.$Qs.stringify({
          phone: this.phone,
          trainingSchoolId: this.selectedValue,
          openId: localStorage.getItem('oid'),
          code: this.code
        })
        this.teacherLogin(parms)
      } else if (userIdentity === 2) {
        let parms = this.$Qs.stringify({
          name: this.name,
          schoolStudentNumber: this.studentId,
          parentPhone: this.phone,
          openId: localStorage.getItem('oid'),
          code: this.code
        })
        this.parentLogin(parms)
      } else {
        let parms = this.$Qs.stringify({
          phone: this.phone,
          openId: localStorage.getItem('oid')
          // code: this.code
        })
        this.userLogin(parms)
      }
    },
    /** 获取用户信息并存储. */
    getUrserInfo () {
      let parm = this.$Qs.stringify({
        openId: localStorage.getItem('oid')
      })
      this.$api.getUrserInfoApi(parm).then(res => {
        if (res.data.code * 1 === 200) {
          const userInfo = res.data.data

          this.userInfo = userInfo

          if (userInfo.photoUrl.indexOf('http') === -1) {
            userInfo.photoUrl =
                            this.GLOBAL.BEFORE_IMG_URL + userInfo.photoUrl
          }

          this.userInfoPhotoUrl = userInfo.photoUrl

          sessionStorage.setItem(
            'userInfo',
            JSON.stringify(userInfo)
          )
        }
      })
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
    }
  }
}
</script>
<style type="text/css">
.inputContent .el-select {
    width: 100%;
    height: 100%;
}
.el-input {
    font-size: 0.24rem !important;
    height: 26px !important;
    position: absolute;
    top: -1px;
    left: 0;
    border-radius: 14px;
}
.el-input input.el-input__inner {
    height: 100% !important;
    border: 0 !important;
    border-radius: 14px;
    background: transparent;
    width: 100% !important;
    height: 26px !important;
    line-height: 26px !important;
}
.el-input__suffix {
    right: 0 !important;
    padding: 0 10px !important;
}
.el-input__icon {
    line-height: 26px !important;
}
.el-select-dropdown__item {
    font-size: 0.24rem;
}
.el-select-dropdown {
    max-height: 4rem;
}
.el-select-dropdown__wrap {
    max-height: 4rem;
}
.el-select-dropdown__empty {
    font-size: 0.24rem;
}
</style>

<style scoped lang="less">
    .background_white{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255,255,255,.5);
    }
.bindMain {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    background: url("../assets/images/bindgb.png");
    overflow: hidden;
    .content {
        width: 86%;
        min-height: 5rem;
        position: absolute;
        left: 7%;
        top: 20%;
        z-index: 2;
        background: #fff;
        .bindTitle {
            width: 80px;
            height: 60px;
            margin-left: 0.5rem;
            line-height: 60px;
            font-size: 0.32rem;
            color: #4276df;
            position: relative;
            &:after {
                position: absolute;
                left: 2%;
                bottom: 14px;
                content: "";
                width: 64%;
                height: 4px;
                background: #4276df;
                border-radius: 4px;
            }
            span {
                position: relative;
                z-index: 2;
                font-weight: 600;
            }
        }
        .formLists {
            width: 90%;
            min-height: 2rem;
            margin: 20px auto;
            .item {
                display: flex;
                height: 30px;
                line-height: 30px;
                margin-bottom: 0.4rem;
                justify-content: space-between;
                .label {
                    width: 25%;
                    color: #4276df;
                    font-size: 0.28rem;
                    font-weight: 500;
                }
                .inputPhone {
                    width: 35%;
                    border-radius: 15px;
                    border: 1px solid #4276df;
                    padding: 2px 0 2px 0;
                }
                .inputContent {
                    width: 70%;
                    border-radius: 15px;
                    border: 1px solid #4276df;
                    box-sizing: border-box;
                    padding: 2px 0 2px 0;
                    position: relative;
                }
                .itemBtn {
                    width: 30%;
                    text-align: center;
                    border: 1px solid #4276df;
                    border-radius: 20px;
                    box-sizing: border-box;
                    color: #4276df;
                    font-size: 0.24rem;
                }
                input {
                    position: relative;
                    top: -1px;
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                    padding: 0 0.1rem;
                    border-radius: 15px;
                    border: 0;
                }
            }
        }
        .btn {
            height: 50px;
            width: 100%;
            text-align: center;
            line-height: 50px;
            background: #4276df;
            color: #fff;
            font-size: 0.28rem;
            border-radius: 0 0 10px 10px;
        }
    }
}
</style>
