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

            <div class="content_lists" v-for="(pros,index) in goodsLists" :key="index"
                 @click="toDetails(pros.productId)">
                <div class="shop_img">
                    <img :src="pros.cover" alt="">
                </div>
                <div class="shop_content">
                    <p class="title overflow2"><span>{{pros.productName}}</span></p>
                    <p class="desc">{{pros.categoryName}}</p>
                    <p class="price"><i class="iconfont icon-moneyrmb">:</i>{{pros.salePrice}}</p>
                    <div class="num">
                        <span>x{{pros.quantity}}</span>
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

        <van-submit-bar
            button-type="info"
            :price="allPrideFn"
            :button-text="submitBarText"
            @submit="onSubmit">
        </van-submit-bar>
        <div style="height: 60px"></div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      userIdentity: localStorage.getItem('identity') * 1,
      allPrice: sessionStorage.getItem('allPrice'),
      allCount: sessionStorage.getItem('allCount'),
      message: '',
      goodsLists: JSON.parse(sessionStorage.getItem('submitOrderLists'))
    }
  },

  computed: {
    submitBarText () {
      return '提交订单' + (this.allCount ? '(' + this.allCount + ')' : '')
    },
    allPrideFn () {
      return sessionStorage.getItem('allPrice') * 1
    }
  },

  mounted () {
    this.importWeixinJSSDK()
  },

  methods: {

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
<style scoped lang="less">

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
                    top: .8rem;
                    color: #e13d13;
                    background: #fff;
                }
            }
        }
    }

</style>
