<template>
    <div>
        <div class="big_box_content">
            <div class="main relative">
                <div class="topImg">
                    <img src="../../assets/images/banner.png" alt=""/>
                </div>
                <div class="userWrap">
                    <div class="editHeadPhoto" @click="selectedImgFn">
                        <!--<van-uploader-->
                            <!--accept="image/png, image/jpeg,image/jpg"-->
                            <!--:after-read="afterRead"-->
                        <!--/>-->
                    </div>
                    <div class="userIcon">
                        <img :src="userInfoPhotoUrl" alt=""/>
                    </div>
                    <div class="userName">
                        <span>{{ userInfo.name ? userInfo.name : userInfo.nickname }}</span>
                    </div>
                </div>
                <div v-if="isTrue" class="contentLists">
                    <div class="item padding_top_bottom_10px">
                        <van-cell-group :border="false">
                            <!--<van-cell/>-->
                            <!--<van-cell-->
                            <!--:border="false"-->
                            <!--title="传阅学号"-->
                            <!--:icon="require('../../assets/icon/my_cyxh.png')"-->
                            <!--:value="userInfo.platformStudentNumber"-->
                            <!--/>-->
                            <!--<van-cell-->
                            <!--:border="false"-->
                            <!--title="积分"-->
                            <!--:icon="require('../../assets/icon/my_jf.png')"-->
                            <!--&gt;-->
                            <!--<span style="color: #2e7ded !important;">{{integralValue}}</span>-->
                            <!--<span class="dh"-->
                            <!--&gt;兑换 <i class="iconfont icon-right"></i-->
                            <!--&gt;</span>-->
                            <!--</van-cell>-->

                            <van-cell
                                title="个人资料"
                                :icon="require('../../assets/icon/my_grzlxg.png')"
                                is-link
                                @click="toPageFn('/personalData')"
                            />
                            <van-cell
                                v-if="userIdentity != 1"
                                title="学员管理"
                                :icon="require('../../assets/icon/my_jz_bdxx.png')"
                                is-link
                                @click="toPageFn('/myChildsLists')"
                            />
                            <van-cell
                                v-if="userIdentity === 1"
                                title="培训机构"
                                :icon="require('../../assets/icon/my_jgmc.png')"
                                :value="userInfo.trainingSchoolName"
                                is-link
                                @click="toPageFn('/institutionalDetails')"
                            />
                        </van-cell-group>
                    </div>

                    <div class="item padding_top_bottom_10px"
                         v-if="userIdentity != 1">
                        <van-cell-group :border="false">
                            <!--<van-cell :border="false"/>-->
                            <van-cell
                                title="作文批改结果查询"
                                :icon="require('../../assets/icon/my_zwpg.png')"
                                is-link
                                @click="toPageFn('/resultSearchPage?title=作文批改结果列表&category=1')"
                            />
                            <van-cell
                                title="作文精批结果查询"
                                :icon="require('../../assets/icon/my_zwjp.png')"
                                is-link
                                @click="toPageFn('/resultSearchPage?title=作文精批结果列表&category=2')"
                            />
                            <van-cell
                                title="同步辅导结果查询"
                                :icon="require('../../assets/icon/my_tbfd.png')"
                                is-link
                                @click="toPageFn('/resultSearchPage?title=同步辅导结果列表&category=3')"
                            />
                            <!--<van-cell-->
                            <!--title="测评结果查询"-->
                            <!--icon="completed"-->
                            <!--is-link-->
                            <!--@click="toPageFn('/resultSearchPage?title=测评结果列表&category=0')"-->
                            <!--/>-->
                        </van-cell-group>
                    </div>
                    <div
                        class="item padding_top_bottom_10px">
                        <van-cell-group :border="false">
                            <van-cell
                                title="服务查询"
                                :icon="require('../../assets/icon/my_gmcx.png')"
                                is-link
                                @click="toPageFn('/remainingResult')"
                            />
                            <van-cell
                                v-if="userIdentity != 1"
                                title="我的订单"
                                icon="shop-collect-o"
                                is-link
                                @click="toMyOrderLists"/>
                            <van-cell
                                v-if="userIdentity != 1"
                                title="购物车"
                                icon="shopping-cart-o"
                                is-link
                                @click="toPageFn('/myCart')"/>
                        </van-cell-group>
                    </div>
                    <div class="item padding_top_bottom_10px" v-if="userIdentity == 0">
                        <van-cell-group :border="false">
                            <!--<van-cell/>-->
                            <van-cell title="教师认证入口"
                                      :icon="require('../../assets/icon/my_sfyz.png')"
                                      is-link
                                      @click="verificationAuthor"
                            />
                        </van-cell-group>
                    </div>
                    <div class="item padding_top_bottom_10px">
                        <van-cell-group :border="false">
                            <van-cell
                                title="客服电话"
                                :icon="require('../../assets/icon/my_kf.png')">
                                <a :href="'tel:' + kfTel" style="color: #666;padding-top: .4rem;box-sizing: border-box">{{kfTel}}</a>
                            </van-cell>
                            <van-cell
                                v-if="weixinVal"
                                title="客服微信"
                                icon="chat-o"
                                :value="weixinVal">
                            </van-cell>
                            <van-cell
                                v-if="qqVal"
                                title="客服QQ"
                                :icon="require('../../assets/icon/qq.png')"
                                :value="qqVal">
                            </van-cell>
                        </van-cell-group>
                    </div>
                </div>
            </div>
        </div>
        <FooterBar :curIndex="2"></FooterBar>
    </div>
</template>

<script>
/* eslint-disable */
    import FooterBar from '../../components/footerBar'

    export default {
        components: {
            FooterBar
        },
        data () {
            return {
                selectedImgHeader: '',
                integralValue: 0, // 积分
                userIdentity: 0,
                userInfo: '',
                isTrue: false,
                kfTel: '',
                qqVal: '',
                serverId: [],
                weixinVal: '',
                userInfoPhotoUrl: ''
            }
        },
        mounted () {
            if (!this.$route.query.clear) {
                localStorage.clear()
            }
            if (localStorage.getItem('oid') === 'undefined' || !localStorage.getItem('oid')) {
                localStorage.setItem('oid', this.$route.query.OID)
            }
            this.getUrserInfoData()
            this.getSystemMessage()
            this.jsdkFn()
        },
        methods: {
            /** 获取客服电话. */
            getSystemMessage () {
                this.$api.getSystemMessageApi().then(res => {
                    console.log(res)
                    if (res.data.code * 1 === 200) {
                        this.kfTel = res.data.data.platformPhone
                        this.qqVal = res.data.data.qq
                        this.weixinVal = res.data.data.weixin
                    }
                })
            },

            /** 选择图片或拍照. */
            selectedImgFn(){
                let that = this
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        const localIds = res.localIds  // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                        that.selectedImgHeader = localIds
                        alert(that.selectedImgHeader)
                        that.syncUpload(localIds)
                    }
                });
            },

            /** 上传图片. */
            syncUpload(localIds) {
                let that = this
                var localId = localIds.pop();
                wx.uploadImage({
                    localId: localId.toString(),
                    isShowProgressTips: 1,
                    success: function (res) {
                        // 返回图片的服务器端ID
                        const serverId = res.serverId
                        let parm = that.$Qs.stringify({
                            openId: localStorage.getItem('oid'),
                            photoUrl: serverId
                        })

                        that.$api.upDateHeadPortraitApi(parm).then(res => {
                            if (res.data.code * 1 === 200) {
                                that.getUrserInfoData()
                            }
                        })
                    }
                });
            },

            /** 修改用户头像. */
            afterRead (e) {
                // 此时可以自行将文件上传至服务器
                let parm = new FormData()

                parm.append('file', e.file)

                parm.append('folder', 'app_user_info')

                this.$api.uploadFile(parm).then(res => {
                    let str = res.data[0].data

                    let parm = this.$Qs.stringify({
                        openId: localStorage.getItem('oid'),
                        photoUrl: str
                    })

                    this.$api.upDateHeadPortraitApi(parm).then(res => {
                        if (res.data.code * 1 === 200) {
                            this.getUrserInfoData()
                        }
                    })
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

            /** 跳转页面. */
            toPageFn (path) {
                this.$router.push({
                    path: path
                })
            },

            /** 跳转选择身份. */
            verificationAuthor () {
                // this.$router.push({
                //   path: '/author'
                // })
                this.$router.push({
                    path: 'bindUser',
                    query: {
                        identity: 1
                    }
                })
            },

            /** 判断用户是否认证. */
            getAuthenticationStatus (id) {
                let parm = this.$Qs.stringify({
                    userId: id
                })
                this.$api.getAuthenticationStatusApi(parm).then(res => {
                    if (res.data.code * 1 === 200) {
                        let code = res.data.data * 1
                        this.isTrue = true
                        if (code === 6) {
                            this.userIdentity = 1
                            localStorage.setItem('identity', '1')
                        } else if (code === 7) {
                            this.userIdentity = 2
                            localStorage.setItem('identity', '2')
                        } else {
                            this.userIdentity = 3
                            localStorage.setItem('identity', '3')
                        }
                    } else {
                        this.isTrue = false
                        localStorage.setItem('identity', '')
                    }
                })
            },

            /** 获取用户信息并存储. */
            getUrserInfoData () {
                let parm = this.$Qs.stringify({
                    openId: localStorage.getItem('oid')
                })
                this.$api.getUrserInfoApi(parm).then((res) => {
                    if (res.data.code * 1 === 200) {
                        const userInfo = res.data.data

                        if (userInfo.roleIdStr === '6') {
                            this.userIdentity = 1
                            console.log('教师已认证')
                            localStorage.setItem('identity', '1')
                        } else if (userInfo.roleIdStr === '7') {
                            this.userIdentity = 2
                            console.log('家长已认证')
                            localStorage.setItem('identity', '2')
                        } else if (userInfo.roleIdStr === '8') {
                            if (userInfo.phone) {
                                console.log('已认证认证')
                                this.userIdentity = 3
                                localStorage.setItem('identity', '3')
                            } else {
                                console.log('未认证')
                                this.userIdentity = 0
                                localStorage.setItem('identity', '')
                            }
                        } else {
                            alert('该账户未查询到角色，请联系管理员')
                        }

                        this.isTrue = true

                        this.userInfo = userInfo

                        if (userInfo.photoUrl.indexOf('http') === -1) userInfo.photoUrl = this.GLOBAL.BEFORE_IMG_URL + userInfo.photoUrl

                        this.userInfoPhotoUrl = userInfo.photoUrl

                        sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
                    }
                })
            },

            /** 跳转到我的地址管理. */
            toMyAddress () {
                console.log(12321321)
                this.$router.push({
                    path: '/myAddress'
                })
            },

            /** 跳转到我的订单列表. */
            toMyOrderLists () {
                this.$router.push({
                    path: '/myOrderLists'
                })
            }

            /** end. */
        }
    }
</script>
<style type="text/css">
    .van-cell {
        padding: 8px 16px !important;
    }

    .van-cell__title,
    .van-cell__value {
        text-indent: 0.2rem !important;
        color: #666 !important;
    }

    .van-cell__value span {
        color: #a3a3a3 !important;
    }

    .van-icon.van-cell__left-icon {
        color: #2e7ded;
        font-size: 0.32rem;
        font-weight: 900;
    }

    .editHeadPhoto .van-uploader__upload {
        width: 100% !important;
        height: 100% !important;
        background: transparent !important;
        margin: 0;
        padding: 0;
        border: 0 !important;
    }

    .editHeadPhoto .van-uploader,
    .editHeadPhoto .van-uploader__wrapper,
    .editHeadPhoto .van-uploader__upload {
        width: 100%;
        height: 100%;
        background: transparent;
        margin: 0;
        padding: 0;
        border: 0 !important;
    }

    .van-uploader__upload i {
        display: none;
    }
</style>
<style scoped lang="less">
    .topImg {
        width: 100%;
        text-align: center;
        font-size: 0;
        box-shadow: 0 6px 10px rgba(45, 146, 239, 0.15);

        img {
            max-width: 100%;
            vertical-align: middle;
        }
    }

    .main {
        width: 100%;
        min-height: 100vh;
        background: #f5f5f5;
        padding-bottom: .1rem;
    }

    .userWrap {
        position: relative;
        width: 100%;
        background: #fff;
        height: 1.8rem;

        .editHeadPhoto {
            position: absolute;
            left: 0;
            top: -.8rem;
            z-index: 10;
            width: 100%;
            height: 100%;
        }

        .userIcon {
            position: relative;
            top: -.8rem;
            width: 1.6rem;
            height: 1.6rem;
            border-radius: 100%;
            margin: 0 auto;
            box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.2);

            img {
                width: 100%;
                height: 100%;
                border-radius: 100%;
            }
        }

        .userName {
            position: relative;
            top: -.8rem;
            text-align: center;
            color: #4276df;
            margin-top: 0.2rem;
        }
    }

    .contentLists {
        position: relative;
        margin-top: .2rem;

        .item {
            width: 94%;
            margin: 0 auto .2rem;
            background: #fff;

            .dh {
                border: 1px solid #4276df;
                color: #4276df !important;
                padding: 2px 6px;
                font-size: 0.24rem;
                border-radius: 18px;

                .iconfont {
                    font-size: 0.2rem;
                }
            }
        }
    }
</style>
