<template>
    <div style="min-height: 100vh;background: #f5f5f5;padding-top: 10px">

        <!--<div class="myAddress">-->
        <!--<div class="address_icon">-->
        <!--<i class="iconfont icon-address"></i>-->
        <!--</div>-->
        <!--<div class="address_details">-->
        <!--<p class="name_tel"><span class="name">李白</span><span class="tel">18300000000</span></p>-->
        <!--<p class="overflow2">贵州省贵阳市观赏湖区今麦社区贵州省贵阳市观赏湖区今麦社区</p>-->
        <!--</div>-->
        <!--</div>-->

        <div class="content">
            <div class="content_top_text">
                <i class="iconfont icon-fuwenben"></i>
                <span>购物清单</span>
            </div>
            <div class="content_lists" v-for="(pros,index) in goodsLists" :key="index">
                <div class="shop_img" @click="toDetails(pros.productId)">
                    <img :src="pros.cover" alt="">
                </div>
                <div class="shop_content">
                    <p class="title overflow2"><span>{{pros.productName}}</span></p>
                    <p class="desc">{{pros.categoryName}}</p>
                    <p class="price"><i class="iconfont icon-moneyrmb">:</i>{{pros.salePrice}}</p>
                    <div class="num">
                        <span>x{{pros.quantity}}</span>
                    </div>
                    <div class="updateQuantity">
                        <van-stepper
                            v-model="pros.quantity"
                            integer
                            input-width="40px"
                            button-size="26px"
                            @change="stepperChangeFn(pros, $event)"
                        />
                    </div>
                </div>
            </div>

            <div class="message margin_top_30" style="padding: .3rem 0;">
                <van-cell-group>
                    <van-field
                        v-model="message"
                        label="给商家留言"
                        type="textarea"
                        placeholder="请输入留言"
                        rows="1"
                        autosize
                    />
                </van-cell-group>
            </div>
        </div>

        <div class="footer_btn">
            <van-submit-bar
                button-type="info"
                :price="allPrice"
                :button-text="submitBarText"
                @submit="onSubmit"
            >
            </van-submit-bar>
            <div class="buy_num">
                <span>共</span>
                <span>{{this.allCount}}</span>
                <span>件商品</span>
            </div>
        </div>
        <div style="height: 60px"></div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      userIdentity: localStorage.getItem('identity') * 1,
      allPrice: sessionStorage.getItem('allPrice') * 1,
      allCount: sessionStorage.getItem('allCount'),
      message: '',
      goodsLists: JSON.parse(sessionStorage.getItem('submitOrderLists'))
    }
  },

  computed: {
    submitBarText () {
      return '提交订单'
    }
  },

  mounted () {
    this.importWeixinJSSDK()
  },

  methods: {

    /** 数量改变时. */
    stepperChangeFn (item, e) {
      let parms = this.$Qs.stringify({
        productId: item.productId,
        quantity: e
      })
      this.$api.updateCartGoodsQuantityApi(parms).then(res => {
        if (res.data.code * 1 === 200) {
          this.totalPeice()
        }
      })
    },

    /** 计算总价. */
    totalPeice () {
      // 每次调用此方法，将初始值为0，遍历价格并累加
      this.allPrice = 0
      this.goodsLists.forEach(item => {
        this.allPrice += item.salePrice * item.quantity * 100
      })
    },

    /** JSSDK. */
    importWeixinJSSDK () {
      // this.$api.getJsSingle().then(res => {

      // })
      // this.weixinShare()
    },

    /** 查看商品详情. */
    toDetails (itemid) {
      this.$router.push({
        path: '/goodsDetails',
        query: {
          itemId: itemid
        }
      })
    },

    /* eslint-disable */

            /** 提交订单. */
            onSubmit () {
                let idAndNums = []
                this.goodsLists.forEach(e => {
                    idAndNums.push({
                        productId: e.productId,
                        quantity: e.quantity
                    })
                })
                this.$toast.loading({
                    message: '提交中...',
                    mask: true,
                    duration: 0
                })
                let params = this.$Qs.stringify({
                    userId: JSON.parse(sessionStorage.getItem('userInfo')).id,
                    openId: localStorage.getItem('oid'),
                    productIdAndQuantity: JSON.stringify(idAndNums),
                    message: this.message,
                    receiver: '收货人姓名',
                    phone: '收货人电话',
                    province: '省份',
                    city: '市',
                    county: '县',
                    address: '详细地址'
                })
                this.$api.submitOrderApi(params).then(res => {
                    this.$toast.clear()
                    if (res.data.code * 1 === 200) {
                        this.toPay(res.data.message)
                    }
                })
            },

            /** 去支付. */
            toPay (orderId) {
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

<style type="text/css">
    .footer_btn .van-submit-bar__text{
        position: relative;
        top: -10px;
    }
    .footer_btn{
        position: fixed;
        left: 0;
        bottom: 0;
    }

    .buy_num{
        position: fixed;
        right: 34%;
        bottom:4px;
        width: 30%;
        height: 20px;
        text-align: right;
        line-height: 20px;
        font-size: .24rem;
        color: #999;
        z-index: 100;
    }
</style>
<style scoped lang="less">
    .content_top_text{
        height: 50px;
        line-height: 50px;
        color: #999;
        position: relative;
        &::after{
            content: "";
            display: block;
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            border-top: 1px solid #cdcdcd;
            transform: scaleY(.3);
        }
        i{
            font-size: 16px;
            position: relative;
            top: 2px;
            margin-right: 10px;
            color: #999;
        }
    }
    .myAddress {
        position: relative;
        width: 94%;
        background: #fff;
        border-radius: 10px;
        overflow: hidden;
        margin: 0 auto;
        height: 1.8rem;
        display: flex;

        .address_icon {
            width: 20%;
            text-align: center;
            line-height: 1.6rem;

            i {
                font-size: .8rem;
                color: #4276DF;
            }
        }

        .address_details {
            width: 70%;

            p.name_tel {
                margin-top: .2rem;

                .name {
                    font-size: .32rem;
                    margin-right: .4rem;
                    color: #333;
                }

                .tel {
                    font-size: .32rem;
                    color: #333;
                }
            }

            p.overflow2 {
                margin-top: .1rem;
                font-size: .26rem;
                color: #666;
            }
        }
    }

    .content {
        width: 94%;
        margin: .3rem auto;
        background: #fff;
        border-radius: 10px;
        overflow: hidden;
        box-sizing: border-box;
        padding: 0 .2rem;

        .content_lists {
            width: 100%;
            display: flex;
            margin-top: .3rem;
            box-sizing: border-box;
            border-radius: .1rem;
            overflow: hidden;
            padding: .2rem 0;
            box-shadow: 1px 0 5px 1px rgba(66, 118, 223, .1);

            .shop_img {
                width: 30%;
                text-align: center;
                height: 1.8rem;

                img {
                    width: 90%;
                    border-radius: .1rem;
                    height: 100%;
                }
            }

            .shop_content {
                width: 70%;
                position: relative;

                .title {
                    font-size: .3rem;
                    color: #333;
                    margin-top: .1rem;
                }

                .desc {
                    font-size: .24rem;
                    color: #999;
                }

                .price {
                    margin-top: .15rem;
                    font-size: .26rem;
                    color: #e13d13;

                    i {
                        font-size: .26rem;
                        margin-right: .2rem;
                    }
                }

                .num {
                    position: absolute;
                    right: 6px;
                    top: .5rem;
                    color: #e13d13;
                    background: #fff;
                }
                .updateQuantity {
                    position: absolute;
                    right: 6px;
                    bottom: 4px;
                    min-width: 30px;
                    height: 26px;
                }
            }
        }
    }

</style>
