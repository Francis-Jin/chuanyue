<template>
    <div class="main">

        <div v-if="isWhatUpload === 3" class="topImg">
            <img src="../../assets/images/tbfd_img.png" alt="">
        </div>

        <div v-if="isWhatUpload === 3" class="topModel">
            <div class="example" style="font-size: 12px;">
                <span>第一步：选择学员</span>
            </div>
            <div class="example" style="font-size: 12px;">
                <span>第二步：选择上传方式，试卷上有二维码的通过“扫一扫”上传，试卷上没有二维码的通过购买次数上传。</span>
            </div>
            <div class="example" style="font-size: 12px;">
                <span>第三步：点击立即提交按钮</span>
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

        <div v-if="isWhatUpload === 3" @click="clickShowUploadTypePickerFn" class="topModel selectedStudent" style="display: flex;justify-content: space-between;">
            <div class="example" style="padding: 10px 10px;">
                <span>{{tpUploadTextValue}}</span>
            </div>
            <div class="icon">
                <van-icon name="arrow" size=".28rem" color="#999"/>
            </div>
        </div>

        <!-- v-if="isWhatUpload != 3" -->
        <div v-if="isWhatUpload != 3 || ( isWhatUpload ==3 && tbUploadType == 1 )" class="topModel selectedStudent" style="padding: 20px;">
            <div class="example" style="padding-top:10px;">
                <span>您的
                    <span v-if="isWhatUpload === 1" style="color: #4276DF">作文批改 </span>
                    <span v-if="isWhatUpload === 2" style="color: #4276DF">作文精批 </span>
                    <span v-if="isWhatUpload === 3" style="color: #4276DF">同步辅导 </span>剩余次数为
                </span>
                <span class="num"><span style="color: #4276DF">{{surplusNum}}</span></span>
                <span v-if="userIdentity != 1 && surplusNum === 0 && isShowBuy">，请先购买</span>。
            </div>
            <div v-if="userIdentity != 1 && surplusNum === 0 && isShowBuy" class="goBuy">
                <span @click="goBuy">去购买</span>
            </div>
        </div>

        <div v-if="isWhatUpload === 3 && !isCanUploadType && tbUploadType == 2" class="scanWrap" @click="scanQRCodeFn">
            <span>扫一扫</span>
        </div>

        <div class="bottomModel" v-if="(surplusNum != 0 && isCanUploadType) || (isWhatUpload === 3 && isCanUploadType) || (isWhatUpload == 3 && tbUploadType == 1 && surplusNum != 0)">
        <!--<div class="bottomModel">-->

            <!--<div class="bTitle">-->
            <!--<span>温馨提示</span>-->
            <!--</div>-->

            <div class="tipsContent">
                <span>请将写好的作文拍照上传，照片要求文字清晰可见，否则会影响批改。</span>
            </div>

            <div class="uploadImgWrap">
                <!--微信jsdk版上传-->

                <!--<div class="td clearfix">-->
                <!--<p v-if="fileList.length > 1" class="font_26 color_999 margin_bottom_20">可拖动图片进行排序</p>-->
                <!--<draggable v-model="fileList">-->
                <!--<div class="uploadImgItem" v-for="(element,index) in fileList" :key="index">-->
                <!--<img :src="element.url" alt="" @click="previewImageFn(element.url)">-->
                <!--<div class="deleteImg" @click="deleteImgFn(index,element.sort)">-->
                <!--<i class="iconfont icon-delete"></i>-->
                <!--</div>-->
                <!--</div>-->
                <!--</draggable>-->
                <!--<div v-if="fileList.length < 6" class="uploadStyle" @click="selectedImgFn">-->
                <!--<span><i class="iconfont icon-add1"></i></span>-->
                <!--</div>-->
                <!--</div>-->

                <!--原生H5上传-->
                <div class="td clearfix">
                    <p v-if="fileList.length > 1" class="font_26 color_999 margin_bottom_20">可拖动图片进行排序</p>
                    <draggable v-model="fileList">
                        <div class="uploadImgItem" v-for="(element,index) in fileList" :key="index">
                            <img :src="element.content">
                        </div>
                    </draggable>
                </div>
                <div class="uploadBtn">
                    <p v-if="fileList.length > 0" class="font_14 color_999 margin_bottom_20">图片上传缩略图，可点击放大查看或删除</p>
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

        <!--选择照片或拍照上拉弹框-->
        <!--<div>-->
        <!--<van-action-sheet-->
        <!--v-model="isShowSelectedImgBtn"-->
        <!--:actions="actions"-->
        <!--cancel-text="取消"-->
        <!--@select="isShowSelectedImgBtn = false"-->
        <!--@cancel="onCancel"-->
        <!--/>-->
        <!--</div>-->
        <div style="height: 60px"></div>

        <!--上传方式选择-->
        <van-popup v-model="showUploadTypePicker" position="bottom">
            <van-picker
                show-toolbar
                title="选择上传方式"
                :columns="uploadColumns"
                @cancel="showUploadTypePicker=false"
                @confirm="onConfirmUploadType"
            />
        </van-popup>
    </div>
</template>

<script>

import Banner from '../../components/banner'
import draggable from 'vuedraggable'
// import wx from 'weixin-js-sdk'
/* eslint-disable */
    import {Dialog} from 'vant'

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
                tpUploadTextValue: '请选择上传方式',
                uploadColumns: [
                    {
                        id: 1,
                        text: '使用剩余次数'
                    },
                    {
                        id: 2,
                        text: '使用试卷二维码'
                    }
                ],
                studentName: '',
                isShowAddBtn: false,
                pageUrl: '',
                studentId: '',
                userIdentity: localStorage.getItem('identity') * 1,
                isShowSuccessToast: false,
                fileList: [],
                showUploadTypePicker: false,
                tbUploadType: 0, //同步辅导上传方式，1用次数上传，2扫描二维码上传。
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
                selectedStuItem: null,
                serverId: [],
                sortValue: 1,
                serverIdSort: 0,
                upLists: []
            }
        },
        mounted () {
            if (JSON.parse(sessionStorage.getItem('selectedStuItem'))) {
                this.studentName = JSON.parse(sessionStorage.getItem('selectedStuItem')).name
                this.selectedStuItem = JSON.parse(sessionStorage.getItem('selectedStuItem'))
                this.studentId = this.selectedStuItem.id
                this.trainingSchoolId = this.selectedStuItem.trainingSchoolId
                this.classId = this.selectedStuItem.classId
                this.grade = this.selectedStuItem.grade
            }
            if (this.isWhatUpload === 3) {
                // if (!localStorage.getItem('isCanUpload')) {
                //     // this.alertSyncFn()
                // }
            } else {
                this.isCanUploadType = true
                this.tbUploadType = 1
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

            /** 去购买页面. */
            goBuy () {
                this.$router.push({
                    path: '/preferentialZone'
                })
            },

            /** 点击显示上传方式选择弹窗. */
            clickShowUploadTypePickerFn(){
                this.showUploadTypePicker = true
            },

            /** 确认选择的上传方式. */
            onConfirmUploadType(e){
                let type = e.id
                this.tbUploadType = type
                this.tpUploadTextValue = e.text
                this.showUploadTypePicker = false
            },

            /** 删除图片. */
            deleteImgFn (index, sort) {
                this.serverId.forEach((item, i) => {
                    if (item.sort === sort) {
                        this.serverId.splice(i, 1)
                    }
                })
                this.fileList.splice(index, 1)
            },

            /** 选择图片. */
            selectedImgFn () {
                let that = this
                wx.chooseImage({
                    count: 6 - that.fileList.length, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        const localIds = res.localIds  // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                        let obj = {}
                        localIds.forEach(item => {
                            obj = {
                                sort: that.sortValue++,
                                url: item
                            }
                            that.fileList.push(obj)
                        })

                        that.syncUpload(localIds)
                    }
                })
            },

            /** shift 删除数组并返回数组第一个元素. */
            /** pop 删除数组并返回数组第一个元素. */

            /** 上传图片. */
            syncUpload (localIds) {
                let that = this
                that.serverIdSort++
                const localId = localIds.shift()
                wx.uploadImage({
                    localId: localId.toString(),
                    isShowProgressTips: 1,
                    success: function (res) {
                        // 返回图片的服务器端ID
                        that.serverId.push({
                            sort: that.serverIdSort,
                            serverId: res.serverId
                        })
                        //其他对serverId做处理的代码
                        if (localIds.length > 0) {
                            setTimeout(function () {
                                that.syncUpload(localIds)
                            }, 100)
                        }
                    }
                })
            },

            /** 图片预览. */
            previewImageFn (url) {
                let arr = []
                this.fileList.forEach(item => {
                    arr.push(item.url)
                })
                wx.previewImage({
                    current: url, // 当前显示图片的http链接
                    urls: arr// 需要预览的图片http链接列表
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
                            jsApiList: [
                                'scanQRCode',
                                'chooseImage',
                                'previewImage',
                                'uploadImage'
                            ]
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
                let that = this
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

                if (this.isWhatUpload === 3) {
                    Dialog.confirm({
                        title: '提示',
                        message: '点击提交前请核对本次上传照片数量与真实试卷页数是否一致。',
                        showCancelButton: true
                    }).then(function () {
                        that.$toast.loading({
                            message: '正在提交...',
                            mask: true,
                            duration: 0
                        })
                        that.$api.uploadFile(parm).then(res => {
                            let data = res.data
                            let successLists = data.filter(item => item.code * 1 === 200)
                            let upLists = []
                            successLists.forEach((item,index) => {
                                upLists.push({
                                    photo: item.data,
                                    sort: index + 1
                                })
                            })
                            that.successUploadFn(upLists)
                        })
                    })
                } else {
                    that.$toast.loading({
                        message: '正在提交...',
                        mask: true,
                        duration: 0
                    })
                    that.$api.uploadFile(parm).then(res => {
                        let data = res.data
                        let successLists = data.filter(item => item.code * 1 === 200)
                        let upLists = []
                        successLists.forEach((item,index) => {
                            upLists.push({
                                photo: item.data,
                                sort: index + 1
                            })
                        })
                        that.successUploadFn(upLists)
                    })
                }

            },

            /** 提交上传函数. */
            successUploadFn(upLists){
                let that = this
                let params
                if (that.userIdentity !== 1) {
                    params = that.$Qs.stringify({
                        uploadBatchId: 0,
                        trainingSchoolId: that.trainingSchoolId,
                        classId: that.classId,
                        grade: that.grade,
                        studentId: that.studentId,
                        correctType: that.isWhatUpload,
                        photoStr: JSON.stringify(upLists),
                        createUser: JSON.parse(sessionStorage.getItem('userInfo')).id,
                        paperId: that.paperId,
                        uploadType: that.tbUploadType,
                        paperNumber: that.paperNumber,
                        paperIdentifier: that.paperIdentifier

                    })
                } else {
                    params = that.$Qs.stringify({
                        uploadBatchId: that.$route.query.batchId,
                        trainingSchoolId: that.$route.query.trainingSchoolId,
                        classId: that.$route.query.classId,
                        grade: that.$route.query.gradeId,
                        studentId: that.$route.query.studentsId,
                        correctType: that.isWhatUpload,
                        photoStr: JSON.stringify(upLists),
                        createUser: JSON.parse(sessionStorage.getItem('userInfo')).id,
                        paperId: that.paperId,
                        uploadType: that.tbUploadType,
                        paperNumber: that.paperNumber,
                        paperIdentifier: that.paperIdentifier
                    })
                }

                that.$api.additionalWorksApi(params).then(res => {
                    that.$toast.clear()
                    if (res.data.code * 1 === 200) {
                        that.isShowSuccessToast = true
                        setTimeout(() => {
                            window.history.go(-1)
                        }, 1000)
                    }
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

    .uploadStyle {
        display: inline-block;
        width: 2rem;
        height: 2rem;
        float: left;
        text-align: center;
        line-height: 2rem;
        border: 1px dashed #cdcdcd;

        i {
            font-size: 1rem;
            color: #cdcdcd;
        }
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
                margin-right: .2rem;
                margin-bottom: .2rem;
                position: relative;

                .deleteImg {
                    position: absolute;
                    right: -5px;
                    top: -5px;
                    width: 30px;
                    height: 30px;
                    text-align: center;
                    line-height: 30px;
                    border-radius: 100%;
                    background: rgba(0, 0, 0, .8);

                    i {
                        color: #fff;
                    }
                }

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
