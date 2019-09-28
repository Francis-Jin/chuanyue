<template>
    <div class="bindMain">
        <!--<div class="selcted">-->
            <!--<div class="tipsSelected">-->
                <!--<span>如果您的孩子在培训机构学习，请勾选机构学员。</span>-->
            <!--</div>-->
            <!--<van-radio-group v-model="radio" @change="selectedStuTypeFn">-->
                <!--<div class="wrap">-->
                    <!--<div class="item">-->
                        <!--<van-radio name="1" checked-color="#4276df">非机构学员</van-radio>-->
                    <!--</div>-->
                    <!--<div class="item">-->
                        <!--<van-radio name="2" checked-color="#4276df">机构学员</van-radio>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</van-radio-group>-->
        <!--</div>-->
        <div class="add_wrap">
            <div class="example">
                <h4>提示</h4>
                <span>如果您的孩子在以下培训机构学习，学员类别请选择机构学员。</span>
                <div class="" style="margin-top: 10px;">
                    <div v-for="item in schools" :key="item.value"><span>- {{item.label}}</span></div>
                </div>
            </div>
            <div class="content">
                <div class="bindTitle">
                    <span>添加学员</span>
                </div>
                <div class="formLists">
                    <div class="item">
                        <div class="label">
                            <span>学员类别</span>
                        </div>
                        <div class="wrap">

                        <van-radio-group v-model="radio" @change="selectedStuTypeFn">
                                <div class="init">
                                    <van-radio name="1" checked-color="#4276df"><span style="font-size: .24rem">非机构学员</span></van-radio>
                                </div>
                                <div class="init">
                                    <van-radio name="2" checked-color="#4276df"><span style="font-size: .24rem">机构学员</span></van-radio>
                                </div>
                        </van-radio-group>
                        </div>

                    </div>

                    <div v-if="bind == 'true'" class="item">
                        <div class="label">
                            <span>手机号</span>
                        </div>
                        <div class="inputContent">
                            <input
                                type="number"
                                placeholder="家长的手机号"
                                v-model="phone"
                                @blur="inputBlurFn('phone')"
                            />
                        </div>
                    </div>

                    <div class="item">
                        <div class="label">
                            <span>学员姓名</span>
                        </div>
                        <div class="inputContent">
                            <input
                                type="text"
                                placeholder="您孩子的姓名"
                                v-model="name"
                                @blur="inputBlurFn('name')"
                            />
                        </div>
                    </div>

                    <div v-if="bind == 'true'" class="item">
                        <div class="label">
                            <span>机构学号</span>
                        </div>
                        <div class="inputContent">
                            <input
                                type="text"
                                placeholder="在培训机构的学号"
                                v-model="studentId"
                                @blur="inputBlurFn"
                            />
                        </div>
                    </div>

                    <div v-if="bind == 'false'" class="item">
                        <div class="label">
                            <span>性别</span>
                        </div>
                        <div class="inputContent">
                            <template>
                                <el-select
                                    v-model="sexValue"
                                    placeholder="选择性别"
                                    @blur="inputBlurFn">
                                    <el-option
                                        v-for="item in sexOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </template>
                        </div>
                    </div>
                    <div v-if="bind == 'false'" class="item">
                        <div class="label">
                            <span>年级</span>
                        </div>
                        <div class="inputContent">
                            <template>
                                <el-select
                                    v-model="selectedValue"
                                    placeholder="所在年级"
                                    @blur="inputBlurFn">
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
                    <div v-if="bind == 'true_not'" class="item">
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
                    <span v-if="bind == 'false'">添加</span>
                    <span v-if="bind == 'true'">绑定</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
    export default {
        data () {
            return {
                show: true,
                count: '',
                timer: null,
                radio: '1',
                userIdentity: localStorage.getItem('identity') * 1,
                bind: 'false',
                listsAdd: this.$route.query.listsAdd,
                options: [],
                schools: [],
                sexOptions: [{
                    value: 1,
                    label: '男'
                }, {
                    value: 2,
                    label: '女'
                }],
                sexValue: 1,
                selectedValue: '', // 选择机构时的id
                code: '', // 输入验证码
                phone: '', // 输入手机号
                name: '', // 输入学生姓名
                sex: '',
                grade: '',
                studentId: '' // 孩子的机构学号
            }
        },
        mounted () {
            this.bind === 'true' ? document.title = '绑定学员' : document.title = '添加学员'
            this.getAllGrade()
            this.getMechanismLists()
        },
        methods: {

            /** 单选改变时. */
            selectedStuTypeFn (e) {
                e === '1' ? this.bind = 'false' : this.bind = 'true'
            },

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
                            this.schools = lists
                        }
                    })
                    .catch(error => {
                        console.log('网络错误' + error)
                    })
            },

            /** 获取所有年级. */
            getAllGrade () {
                this.$api.getAllGradeApi().then(res => {
                    if (res.data.code * 1 === 200) {
                        let lists = []
                        for (let i = 0; i < res.data.data.length; i++) {
                            let obj = {
                                value: res.data.data[i].code,
                                label: res.data.data[i].name
                            }
                            lists.push(obj)
                        }
                        this.options = lists
                    }
                })
            },

            /** 获取验证码. */
            getPhoneCode () {
            },

            /** 点击添加. */
            confirmUserFn () {
                if (this.bind === 'true') {
                    if (!this.isNullFn(this.phone, '手机号不能为空')) return false
                    if (!this.isNullFn(this.name, '请输入学员姓名')) return false
                    if (!this.isNullFn(this.studentId, '请输入您孩子的机构学号')) return false
                    // if (!this.isNullFn(this.code, '验证码不能为空')) return false
                    let parms = this.$Qs.stringify({
                        name: this.name,
                        schoolStudentNumber: this.studentId,
                        parentPhone: this.phone,
                        openId: localStorage.getItem('oid'),
                        userId: JSON.parse(sessionStorage.getItem('userInfo')).id
                        // code: this.code
                    })
                    this.$api.parentAddChildrenApi(parms).then(res => {
                        if (res.data.code * 1 === 200) {
                            this.$router.go(-1)
                        } else {
                            this.$toast.fail(res.data.message)
                        }
                    })
                } else {
                    if (!this.isNullFn(this.name, '请输入学员姓名')) return false
                    if (!this.isNullFn(this.selectedValue, '请选择年级')) return false
                    let parms = this.$Qs.stringify({
                        name: this.name,
                        sex: this.sexValue,
                        grade: this.selectedValue,
                        userId: JSON.parse(sessionStorage.getItem('userInfo')).id
                    })
                    this.$api.ordinaryParentAddChildrenApi(parms).then(res => {
                        if (res.data.code * 1 === 200) {
                            this.$router.go(-1)
                        } else {
                            this.$toast.fail(res.data.message)
                        }
                    })
                }
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
    input::-webkit-input-placeholder{
        color:#cdcdcd;
        font-size: .3rem;
    }
    input::-moz-placeholder{   /* Mozilla Firefox 19+ */
        color:#cdcdcd;
        font-size: .3rem;
    }
    input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
        color:#cdcdcd;
        font-size: .3rem;
    }
    input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
        color:#cdcdcd;
        font-size: .3rem;
    }
    .inputContent .el-select {
        width: 100%;
        height: 100%;
    }

    .inputContent .el-input {
        font-size: 0.24rem !important;
        height: 26px !important;
        position: absolute;
        top: -1px;
        left: 0;
        border-radius: 14px;
    }

    .inputContent .el-input input.el-input__inner {
        height: 100% !important;
        border: 0 !important;
        border-radius: 14px;
        background: transparent;
        width: 100% !important;
        height: 26px !important;
        line-height: 26px !important;
    }

    .inputContent .el-input__suffix {
        right: 0 !important;
        padding: 0 10px !important;
    }

    .inputContent .el-input__icon {
        line-height: 26px !important;
    }

    .el-select-dropdown__item {
        font-size: 0.24rem;
    }

    .el-select-dropdown {
        max-height: 3.6rem;
        overflow: auto !important;
    }

    /* .el-select-dropdown__wrap {
        max-height: 3.6rem;
        overflow: auto !important;
    }*/
    .el-select-dropdown__empty {
        font-size: 0.24rem;
    }
</style>

<style scoped lang="less">
    .selcted {
        padding: 30px 20px 0;
        box-sizing: border-box;
    }

    .wrap {
        width: 70%;
        box-sizing: border-box;
        padding-top: .1rem;
        .init{
            float: left;
            &:first-child{
                margin-right: 10px;
            }
        }
    }

    .bindMain {
        /*position: fixed;*/
        /*left: 0;*/
        /*top: 0;*/
        width: 100%;
        min-height: 100vh;
        background: #f5f5f5;
        overflow: hidden;

        .example {
            width: 86%;
            margin: .3rem auto;

            p {
                margin-top: .1rem;
                font-size: .3rem;
            }
        }

        .content {
            width: 86%;
            min-height: 5rem;
            margin: 0 auto;
            border-radius: 10px;
            overflow: hidden;
            background: #fff;

            .bindTitle {
                width: 80px;
                height: 60px;
                /*text-align: center;*/
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
                    border-radius: 8px;
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
                        padding: 0 0.3rem;
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
