<template>
    <div class="main">

        <div v-if="isWhatUpload === 3" class="topImg">
            <img src="../../assets/images/tbfd_img.png" alt="">
        </div>

        <div v-if="isWhatUpload === 3" class="topModel">

            <div class="example">
                <span>请先选择学员，再扫描同步辅导试卷右上方的二维码。</span>
            </div>
        </div>

        <div v-if="isWhatUpload != 3" class="topModel">
            <div class="example">
                <span>您的
                    <span v-if="isWhatUpload === 1" style="color: #4276DF">作文批改 </span>
                    <span v-if="isWhatUpload === 2" style="color: #4276DF">作文精批 </span>剩余次数为
                </span>
                <span class="num"><span style="color: #4276DF">{{surplusNum}}</span></span>
                <span v-if="userIdentity != 1 && surplusNum === 0 && isShowBuy">，请先购买</span>。
            </div>
            <div v-if="userIdentity != 1 && surplusNum === 0 && isShowBuy" class="goBuy">
                <span @click="goBuy">去购买</span>
            </div>
        </div>

        <div v-if="(userIdentity != 1 && surplusNum !== 0 && isShowSelectedStu) || isWhatUpload === 3"
             class="selectedStudent">
            <div class="l" @click="showPickerFn">
                <van-cell-group :border="false">
                    <van-field :border="false" v-model="studentName" disabled="disabled" placeholder="请选择学员"/>
                </van-cell-group>
                <div class="icon">
                    <van-icon name="arrow" size=".28rem" color="#999"/>
                </div>
            </div>
        </div>

        <div v-if="isWhatUpload === 3 && !isCanUploadType" class="scanWrap" @click="scanQRCodeFn">
            <span>扫一扫</span>
        </div>

        <div class="bottomModel" v-if="(surplusNum != 0 && isCanUploadType) || (isWhatUpload === 3 && isCanUploadType)">

            <!--<div class="bTitle">-->
                <!--<span>温馨提示</span>-->
            <!--</div>-->

            <div class="tipsContent">
                <span>请将写好的作文拍照上传，照片要求文字清晰可见，否则会影响批改。</span>
            </div>

            <div class="uploadImgWrap">
                <div class="td clearfix">
                    <p v-if="fileList.length > 1" class="font_26 color_999 margin_bottom_20">请在此区域拖动图片进行排序</p>
                    <draggable v-model="fileList">
                        <div class="uploadImgItem" v-for="element in fileList" :key="element.id">
                            <img :src="element.content" alt="">
                        </div>
                    </draggable>
                </div>
                <div class="uploadBtn">
                    <p v-if="fileList.length > 0" class="font_26 color_999 margin_bottom_20">图片上传缩略图，可点击放大查看或删除</p>
                    <van-uploader :after-read="afterRead" v-model="fileList" multiple :max-count="6"/>
                </div>
            </div>

            <div class="submitFile" @click="submitFile">
                <span>立即提交</span>
            </div>

        </div>

        <div v-show="isShowSuccessToast" class="successToast">
            <div class="tips">
                <div class="img">
                    <img src="../../assets/icon/successicon.png" alt="">
                </div>
                <div class="text">
                    <span>提交成功</span>
                </div>
            </div>
        </div>
        <div style="height: 60px"></div>
    </div>
</template>

<script>

import Banner from '../../components/banner'
import draggable from 'vuedraggable'
// import wx from 'weixin-js-sdk'
/* eslint-disable */

    export default {
        components: {
            Banner,
            draggable
        },
        data () {
            return {
                value: '',
                showPicker: false,
                columns: [],
                studentName: '',
                isShowAddBtn: false,
                pageUrl: '',
                studentId: '',
                userIdentity: localStorage.getItem('identity') * 1,
                isShowSuccessToast: false,
                fileList: [],
                scanResult: '', //扫描二维码结果
                isCanUploadType: false, //是否显示上传提交
                isShowBuy: false, //是否立即购买
                surplusNum: '', // 默认剩余上传次数
                isWhatUpload: this.$route.query.isWhat * 1,
                uploadSuccessLists: [], // 上传成功后存储的集合
                paperId: 0,
                paperNumber: 0,
                paperIdentifier: 0,
                isShowSelectedStu: false,
                selectedStuItem: null
            }
        },
        mounted () {
            console.log(JSON.parse(sessionStorage.getItem('selectedStuItem')))
            if (JSON.parse(sessionStorage.getItem('selectedStuItem'))) {
                this.studentName = JSON.parse(sessionStorage.getItem('selectedStuItem')).name
                this.selectedStuItem = JSON.parse(sessionStorage.getItem('selectedStuItem'))
                this.studentId = this.selectedStuItem.id
                this.trainingSchoolId = this.selectedStuItem.trainingSchoolId
                this.classId = this.selectedStuItem.classId
                this.grade = this.selectedStuItem.grade
            }
            if (this.isWhatUpload === 3) {
                if (!localStorage.getItem('isCanUpload')) {
                    // this.alertSyncFn()
                }
            } else {
                this.isCanUploadType = true
            }

            if (this.isWhatUpload === 1) {
                document.title = '作文批改上传'
            } else if (this.isWhatUpload === 2) {
                document.title = '作文精批上传'
            } else {
                document.title = '同步辅导上传'
            }
            if (this.userIdentity !== 1) {
                this.getChildresDetails()
            }

            this.getSurplusNum()

            this.jsdkFn()

        },
        methods: {

            goBuy () {
                this.$router.push({
                    path: '/preferentialZone'
                })
            },

            /** 同步辅导弹出提示. */
            alertSyncFn () {
                this.$dialog.confirm({
                    title: '同步辅导试卷审核',
                    message: '扫一扫试卷上方二维码，识别该试卷是否可上传',
                    cancelButtonText: '返回',
                    cancelButtonColor: '#999',
                    confirmButtonText: '知道了',
                }).then(() => {
                    localStorage.setItem('isCanUpload', 1)
                }).catch(() => {
                    this.$router.go(-1)
                })
            },

            /** 扫一扫二维码判断试卷有效性. */
            scanQRCodeFn () {
                let that = this
                wx.scanQRCode({
                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    desc: 'scanQRCode desc',
                    success: function (res) {
                        let parms = that.$Qs.stringify({
                            qrCodeContent: res.resultStr
                        })
                        that.$api.countSchoolworkInfoExistApi(parms).then(res => {
                            if (res.data.code * 1 === 200) {
                                that.$dialog.alert({
                                    message: '该二维码可用',
                                    confirmButtonColor: '#4276DF'
                                })
                                that.isCanUploadType = true
                                that.paperId = res.data.data.paperId
                                that.paperNumber = res.data.data.paperNumber
                                that.paperIdentifier = res.data.data.paperIdentifier
                            } else {
                                that.isCanUploadType = false
                                that.$dialog.alert({
                                    message: res.data.message,
                                    confirmButtonColor: '#666'
                                })
                            }
                        })
                    }
                })
            },

            /** 注册微信JSSDK. */
            jsdkFn () {
                let url = window.location.href.split('#')[0]
                let parm = this.$Qs.stringify({
                    url: url
                })
                this.$api.getJsSingle(parm).then(res => {
                    if (res.data.code * 1 === 200) {
                        let data = res.data.data
                        wx.config({
                            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            debug: false,
                            // 必填，公众号的唯一标识
                            appId: data.appid,
                            // 必填，生成签名的时间戳
                            timestamp: data.timestamp,
                            // 必填，生成签名的随机串
                            nonceStr: data.nonceStr,
                            // 必填，签名
                            signature: data.signature,
                            // 必填，需要使用的JS接口列表，所有JS接口列表
                            jsApiList: ['scanQRCode']
                        })
                        wx.ready(function () {

                        })
                        wx.error(function (res) {
                            // alert(JSON.stringify(res))
                        })
                    }
                })
            },

            afterRead (file) {
            },

            /** 家长获取学生详情. */
            getChildresDetails () {
                let parm = this.$Qs.stringify({
                    userId: JSON.parse(sessionStorage.getItem('userInfo')).id
                })
                this.$api.parentGetChildrenDetailsApi(parm).then(res => {
                    if (res.data.code * 1 === 200) {
                        let lists = res.data.data
                        let columns = []
                        lists.forEach(e => {
                            columns.push({
                                text: e.name,
                                id: e.id,
                                grade: e.grade,
                                classId: e.classId,
                                trainingSchoolId: e.trainingSchoolId
                            })
                        })
                        this.columns = columns
                    }
                })
            },

            /** 跳转学生列表选择学生. */
            showPickerFn () {
                this.$router.push({
                    path: '/myChildsLists',
                    query: {
                        'uploadSelectedStu': true
                    }
                })
            },

            /** 获取上传次数. */
            getSurplusNum () {
                let parms = this.$Qs.stringify({
                    type: this.isWhatUpload,
                    userId: JSON.parse(sessionStorage.getItem('userInfo')).id,
                    trainingSchoolId: JSON.parse(sessionStorage.getItem('userInfo')).trainingSchoolId
                })
                this.$api.getSurplusNumApi(parms).then(res => {
                    if (res.data.code * 1 === 200) {
                        this.surplusNum = res.data.data
                        this.isShowSelectedStu = true
                        if (res.data.data === 0) {
                            this.isShowBuy = true
                        } else {
                            this.isShowBuy = false
                        }
                    }
                })
            },

            /** 点击提交按钮. */
            submitFile () {

                if (this.userIdentity !== 1 && this.studentId === '') {
                    this.$toast('请选择学生')
                    return false
                }

                if (this.surplusNum * 1 === 0 && this.isWhatUpload !== 3) {
                    this.$toast.fail('已没有上传次数，请先购买！')
                    return false
                }

                let imgLists = this.fileList
                if (imgLists.length === 0) {
                    this.$toast.fail('请上传图片')
                    return false
                }
                let parm = new FormData()

                if (imgLists && imgLists.length) { // 判断是否是多图上传 多图则循环添加进去
                    imgLists.forEach(item => {
                        parm.append('file', item.file)// 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
                    })
                }

                parm.append('folder', 'app_schoolwork_info')

                this.$toast.loading({
                    message: '正在提交...',
                    mask: true,
                    duration: 0
                })

                this.$api.uploadFile(parm).then(res => {
                    let data = res.data
                    let successLists = data.filter(item => item.code * 1 === 200)
                    let upLists = []

                    successLists.forEach((item, index) => {
                        upLists.push({
                            photo: item.data,
                            sort: index + 1
                        })
                    })

                    let params
                    if (this.userIdentity !== 1) {
                        params = this.$Qs.stringify({
                            uploadBatchId: 0,
                            trainingSchoolId: this.trainingSchoolId,
                            classId: this.classId,
                            grade: this.grade,
                            studentId: this.studentId,
                            correctType: this.$route.query.isWhat,
                            photoStr: JSON.stringify(upLists),
                            createUser: JSON.parse(sessionStorage.getItem('userInfo')).id,
                            paperId: this.paperId,
                            paperNumber: this.paperNumber,
                            paperIdentifier: this.paperIdentifier

                        })
                    } else {
                        params = this.$Qs.stringify({
                            uploadBatchId: this.$route.query.batchId,
                            trainingSchoolId: this.$route.query.trainingSchoolId,
                            classId: this.$route.query.classId,
                            grade: this.$route.query.gradeId,
                            studentId: this.$route.query.studentsId,
                            correctType: this.$route.query.isWhat,
                            photoStr: JSON.stringify(upLists),
                            createUser: JSON.parse(sessionStorage.getItem('userInfo')).id,
                            paperId: this.paperId,
                            paperNumber: this.paperNumber,
                            paperIdentifier: this.paperIdentifier
                        })
                    }

                    this.$api.additionalWorksApi(params).then(res => {
                        this.$toast.clear()
                        if (res.data.code * 1 === 200) {
                            this.isShowSuccessToast = true
                            setTimeout(() => {
                                window.history.go(-1)
                            }, 1000)
                        }
                    })
                })
            }
        }
    }
</script>
<style>
    .uploadBtn .van-uploader__upload i {
        display: block;
    }

    .uploadBtn .van-uploader__upload {
        border: 1px dashed #e5e5e5 !important;
    }
</style>

<style scoped lang="less">
    * {
        touch-action: pan-y;
    }

    .topImg {
        width: 100%;
        font-size: 0;

        img {
            max-width: 100%;
        }
    }

    .topModel {
        width: 100%;
        box-sizing: border-box;
        padding: 20px;

        .title {
            height: 70px;
            line-height: 70px;
            text-align: center;
            color: #333;
            font-size: .32rem;
        }

        .example {
            color: #666666;

            .num {
                color: #4276DF;
            }
        }

        .goBuy {
            height: 70px;
            line-height: 70px;
            text-align: center;

            span {
                border: 1px solid #4276DF;
                padding: 10px 26px;
                border-radius: 18px;
                color: #4276DF;
            }
        }
    }

    .scanWrap {
        text-align: center;
        line-height: 1rem;
        padding-top: 30px;
        position: relative;

        &::before {
            display: block;
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 10px;
            background: #f5f5f5;
        }

        span {
            padding: .26rem 1rem;
            color: #fff;
            letter-spacing: .1rem;
            background: #409eff;
            border-radius: .1rem;
        }
    }

    .bottomModel {
        width: 100%;
        padding: 20px 20px 0;
        position: relative;

        &::before {
            display: block;
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 10px;
            background: #f5f5f5;
        }

        .bTitle {
            height: 30px;
            line-height: 30px;
            text-align: center;
            font-size: .28rem;
            color: #B0B0B0;
        }

        .tipsContent {
            font-size: .24rem;
            color: #B0B0B0;
            /*text-indent: .48rem;*/
        }

        .uploadImgWrap {
            margin-top: 20px;
            min-height: 60px;
            width: 100%;

            .uploadImgItem {
                width: 2rem;
                height: 2rem;
                float: left;
                margin-right: .3rem;
                margin-bottom: .3rem;

                &:nth-child(3n) {
                    margin-right: 0;
                }

                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }

    .submitFile {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 50px;
        font-size: .32rem;
        line-height: 50px;
        text-align: center;
        background: #2d7ced;
        color: white;
    }

    .successToast {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100vh;
        z-index: 9999;
        background: rgba(0, 0, 0, .3);

        .tips {
            width: 240px;
            height: 120px;
            background: #fff;
            border-radius: 10px;
            text-align: center;
            position: absolute;
            left: 50%;
            margin-left: -120px;
            top: 50%;
            margin-top: -60px;

            .img {
                font-size: 0;
                padding: 16px 0 10px;
            }

            .text {
                color: #4276DF;
            }
        }
    }

    .selectedStudent {
        padding: 20px 10px 10px;
        position: relative;

        &::before {
            display: block;
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 10px;
            background: #f5f5f5;
        }

        .name {
            /*margin-left: .2rem;*/
            color: #333;

            &.active {
                color: #666;
            }
        }

        .icon {
            position: absolute;
            right: 10%;
            top: 32px;
        }

    }
</style>
