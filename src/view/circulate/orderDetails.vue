<template>
    <div style="min-height: 100vh;padding-top: 10px">
        <div class="top">
            <div>我购买的商品 :</div>
        </div>

        <div class="content">
            <div
                class="content_lists"
                v-for="(pros, index) in goodsLists"
                :key="index"
                @click="toDetails(pros.id)"
            >
                <div class="shop_img">
                    <img :src="pros.cover" alt=""/>
                </div>
                <div class="shop_content">
                    <p class="title overflow2">
                        <span>{{ pros.name }}</span>
                    </p>
                    <p class="desc">{{ pros.categoryName }}</p>
                    <p class="price">
                        <i class="iconfont icon-moneyrmb"></i
                        >{{ pros.totalPrice }}
                    </p>
                    <div class="num">
                        <span>x{{ pros.quantity }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="type">
            <van-cell-group>
                <van-cell
                    title="下单时间"
                    :value="formatDate(orderInfo.createTime)"
                />
                <van-cell title="购买数量" :value="orderInfo.quantity"/>
                <van-cell title="订单总额" :value="orderInfo.productAmount"/>
                <van-cell title="平台优惠" :value="orderInfo.platformAmount"/>
                <van-cell title="实付金额" :value="orderInfo.orderAmount"/>
            </van-cell-group>
        </div>

        <div class="statusValue">
            <div class="l">{{ orderInfo.statusName }}</div>
            <div class="r" @click="toPay(orderInfo.status)">
                <span v-if="orderInfo.status === 1" class="pay">去支付</span>
                <span v-if="orderInfo.status === 3" class="other">查看物流</span>
                <span v-if="orderInfo.status === 4" class="other">确认收货</span>
            </div>
        </div>

        <div style="height: 1.2rem;"></div>
    </div>
</template>

<script>
/* eslint-disable */

    export default {
        data () {
            return {
                orderId: this.$route.query.orderId,
                goodsLists: [],
                orderInfo: '',
                requestJSON: ''
            }
        },

        mounted () {
            console.log(this.orderId)
            this.getOrderDetails()
        },

        methods: {
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

            /** 获取订单详情. */
            getOrderDetails () {
                let parm = this.$Qs.stringify({
                    orderId: this.orderId
                })
                this.$toast.loading({
                    duration: 0,
                    mask: true,
                    message: '加载中...'
                })
                this.$api.getOrderDetailsApi(parm).then(res => {
                    this.$toast.clear()
                    if (res.data.code * 1 === 200) {
                        let d = res.data.data.listProductInfo
                        let orderInfo = res.data.data.orderInfo
                        d.forEach(e => {
                            e.cover = this.GLOBAL.BEFORE_IMG_URL + e.cover
                        })
                        this.goodsLists = d
                        this.orderInfo = orderInfo
                    }
                })
            },

            /** 跳转商品详情. */
            toDetails (itemid) {
                this.$router.push({
                    path: '/goodsDetails',
                    query: {
                        itemId: itemid
                    }
                })
            },

            /** 去支付. */
            toPay (status) {
                if (status * 1 === 1) {
                    let orderId = this.orderId
                    let pays = this.$Qs.stringify({
                        orderId: orderId,
                        openId: localStorage.getItem('oid')
                    })
                    this.$api
                        .wxPayApi(pays)
                        .then(res => {
                            if (res.data.code * 1 === 200) {
                                let data = JSON.parse(res.data.data)
                                this.payBridgeReady(data)
                            } else {
                                this.$toast.fail(res.message)
                            }
                        })
                        .catch(err => {
                            alert(err)
                        })
                }
            },

            /** 唤起微信钱包. */
            payBridgeReady (requestJSON) {
                let that = this
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest',
                    requestJSON,
                    function (res) {

                        if (res.err_msg == 'get_brand_wcpay_request:ok') {
                            that.$router.push({
                                path: '/myOrderLists'
                            })
                        } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
                            that.$toast.fail('您取消了支付')
                            that.$router.push({
                                path: '/myOrderLists'
                            })
                        } else if (res.err_msg == 'get_brand_wcpay_request:fail') {
                            that.$toast.fail('支付失败')
                        }
                    })
            }
        }
    }
</script>
<style scoped lang="less">
    .top {
        width: 100%;
        background: #fff;
        display: flex;
        box-sizing: border-box;
        padding: 0.1rem 0.3rem 0.3rem;
        justify-content: space-between;
        color: #333;
        border-bottom: 1px solid #ededed;
    }

    .content {
        width: 94%;
        margin: 0 auto;
        background: #fff;
        border-radius: 10px;
        overflow: hidden;
        box-sizing: border-box;
        padding: 0.3rem 0.2rem;

        .content_lists {
            width: 100%;
            display: flex;
            margin-top: 0.3rem;
            box-sizing: border-box;
            border-radius: 0.1rem;
            overflow: hidden;
            padding: 0.2rem 0;
            box-shadow: 1px 0 5px 1px rgba(66, 118, 223, 0.1);

            .shop_img {
                width: 30%;
                text-align: center;
                height: 1.8rem;

                img {
                    width: 90%;
                    border-radius: 0.1rem;
                    height: 100%;
                }
            }

            .shop_content {
                width: 70%;
                position: relative;

                .title {
                    font-size: 0.3rem;
                    color: #333;
                    margin-top: 0.1rem;
                }

                .desc {
                    font-size: 0.24rem;
                    color: #999;
                }

                .price {
                    margin-top: 0.15rem;
                    font-size: 0.32rem;
                    color: #e13d13;

                    i {
                        font-size: 0.3rem;
                    }
                }

                .num {
                    position: absolute;
                    right: 6px;
                    top: 0.8rem;
                    color: #e13d13;
                    background: #fff;
                }
            }
        }

        .type {
            margin-top: 0.3rem;
        }
    }

    .statusValue {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1.2rem;
        background: #fff;
        display: flex;
        box-sizing: border-box;
        padding: 0 0.3rem;
        line-height: 1.2rem;
        box-shadow: 0 -1px 6px 1px rgba(241, 241, 241, 1);
        justify-content: space-between;
        color: #999;

        span {
            border-radius: 0.4rem;
            padding: 0.16rem 0.6rem;

            &.pay {
                background: #e13d13;
                color: #fff;
            }

            &.other {
                background: #fff;
                color: #666;
                box-shadow: 0 0 4px 1px rgba(241, 241, 241, 1);
            }
        }
    }
</style>
