<template>
    <div>
        <div class="main">
            <van-swipe class="goods-swipe" :autoplay="3000" style="height: 5rem">
                <van-swipe-item v-for="(thumb,index) in photoList" :key="index">
                    <img style="height: 100%;" :src="imgUrl + thumb.photo" >
                </van-swipe-item>
            </van-swipe>

            <div class="shopName">
                <span>{{packageInfo.name}}</span>
            </div>

            <van-collapse v-model="activeNames">

                <van-collapse-item name="1">

                    <div slot="title">
                        <p>套餐商品</p>
                    </div>

                    <div class="contentLists">
                        <div class="item" v-for="(item,index) in subGoodsLists" :key="index" @click="toDetails(item.id)">
                            <div class="l">
                                <img :src="imgUrl + item.cover" alt="">
                            </div>
                            <div class="r">
                                <p>{{item.name}}</p>
                                <p><i class="iconfont"></i>{{item.salePrice}}</p>
                            </div>
                        </div>
                    </div>
                </van-collapse-item>
            </van-collapse>

            <van-cell-group>
                <van-cell>
                    <van-col span="14">
                        <div class="goods-price">
                            <span class="price" style="color: #e13d13 "><i class="iconfont icon-moneyrmb"></i>{{ formDataPrice(packageInfo.salePrice) }}</span>
                            <span class="del"><s> <i class="iconfont icon-moneyrmb"></i> {{formDataPrice(packageInfo.marketPrice)}} </s></span>
                        </div>
                    </van-col>
                    <van-col span="10" style="text-align: right">类型：{{ packageInfo.categoryName }}</van-col>
                </van-cell>

                <!--<div class="type">-->
                    <!--<ul>-->
                        <!--<li v-for="(item,index) in goods.productAttrList" :key="index">-->
                            <!--<div class="item"><span>{{item.attrName}}</span></div>-->
                            <!--<div class="item"><span>{{item.attrValue}}</span></div>-->
                        <!--</li>-->
                    <!--</ul>-->
                <!--</div>-->

                <van-cell>
                    <van-col span="14">购买数量</van-col>
                    <van-col span="10" class="text_right">
                        <van-stepper
                            v-model="quantityValue"
                            integer
                            input-width="30px"
                            button-size="26px"
                        />
                    </van-col>
                </van-cell>
                <van-cell>
                    <div class="margin_bottom_20">
                        <span>简介</span>
                    </div>
                    <div class="details" v-html="packageInfo.intro"></div>
                </van-cell>
            </van-cell-group>

            <van-goods-action style="padding-left: .5rem">
                <van-goods-action-icon style="margin-right:.4rem" :info="allQuantity==0?'':allQuantity" icon="cart-o" @click="onClickCart">
                    购物车
                </van-goods-action-icon>
                <van-goods-action-button type="primary" @click="addCart">
                    加入购物车
                </van-goods-action-button>
                <van-goods-action-button type="info" @click="goBuyFn">
                    立即购买
                </van-goods-action-button>
            </van-goods-action>

        </div>
        <div style="height: 2rem;"></div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      imgUrl: this.GLOBAL.BEFORE_IMG_URL,
      activeNames: [''],
      itemId: this.$route.query.itemId,
      packageInfo: '',
      photoList: [],
      allQuantity: '',
      subGoodsLists: [],
      quantityValue: 1,
      allPrice: 0
    }
  },

  mounted () {
    this.getPackageDetails()
  },

  methods: {

    /** 返回两位小数价格. */
    formDataPrice (price) {
      return price
      // return price.toFixed(2)
    },

    /** 获取套餐详情. */
    getPackageDetails () {
      let parm = this.$Qs.stringify({
        productId: this.itemId
      })
      this.$toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0
      })
      this.$api.getPackageDetailsApi(parm).then(res => {
        this.$toast.clear()
        if (res.data.code * 1 === 200) {
          this.packageInfo = res.data.data.productInfoVo
          this.photoList = res.data.data.productInfoVo.productPhotoList
          this.subGoodsLists = res.data.data.productInfoVoList
          this.getCartShopAllQuantity()
        }
      })
    },

    /** 点击购物车. */
    onClickCart () {
      this.$router.push({
        path: '/myCart'
      })
    },

    /** 点击加入购物车. */
    addCart () {
      const userId = JSON.parse(sessionStorage.getItem('userInfo')).id
      console.log(JSON.parse(sessionStorage.getItem('userInfo')))
      let parm = this.$Qs.stringify({
        productId: this.itemId,
        quantity: this.quantityValue,
        createUser: userId
      })
      this.$api.addCartApi(parm).then(res => {
        if (res.data.code * 1 === 200) {
          this.$toast({
            message: res.data.message,
            duration: 300
          })
          this.getCartShopAllQuantity()
        } else {
          this.$toast.fail(res.data.message)
        }
      })
    },

    /** 获取购物车列表数据，计算加入总数量. */
    getCartShopAllQuantity () {
      let parms = this.$Qs.stringify({
        userId: JSON.parse(sessionStorage.getItem('userInfo')).id
      })
      this.$api.getCartShopAllQuantityApi(parms).then(res => {
        if (res.data.code * 1 === 200) {
          this.allQuantity = res.data.data
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

    /** 点击立即购买. */
    goBuyFn () {
      let idAndNums = []
      this.packageInfo.cover = this.GLOBAL.BEFORE_IMG_URL + this.packageInfo.cover
      this.packageInfo.productId = this.packageInfo.id
      this.packageInfo.quantity = this.quantityValue
      idAndNums.push(this.packageInfo)
      this.allPrice = this.quantityValue * this.packageInfo.salePrice * 100
      this.$router.push({
        path: 'submitOrder'
      })
      sessionStorage.setItem('allPrice', this.allPrice)
      sessionStorage.setItem('allCount', this.quantityValue)
      sessionStorage.setItem('submitOrderLists', JSON.stringify(idAndNums))
    }

  }
}
</script>
<style>
    .details img{
        max-width: 100%;
    }
</style>

<style scoped lang="less">

    .type{
        width: 90%;
        margin: 0 auto;
        padding: .1rem 0;
        &:after{
            content: '';
            display: block;
            clear: both;
        }
        li{
            width: 50%;
            float: left;
            display: flex;
            height: .8rem;
            line-height: .8rem;
            border-bottom: 1px solid #ededed;
            &:nth-child(2n-1){
                border-right: 1px solid #ededed;
            }
            &:last-child{
                border:none;
            }
            div.item{
                &:nth-child(1){
                    width: 40%;
                    color: #333;
                }
                &:nth-child(2){
                    width: 59%;
                    color: #999;
                }
            }
        }
    }

    .shopName{
        text-indent: .4rem;
        line-height: 1rem;
        font-size: .3rem;
    }
    .topImg{
        width: 100%;
        height: 5rem;
        text-align: center;
        img{
            max-width: 100%;
            height: 100%;
        }
    }
    .contentLists{
        width: 100%;
        box-sizing: border-box;
        /*padding: .2rem .3rem;*/
        .item{
            display: flex;
            justify-content: space-between;
            padding: .2rem 0;
            border-bottom: 1px solid #ededed;
            .l{
                width: 2rem;
                height: 2rem;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .r{
                width: 66%;
                position: relative;
                p{
                    margin-top: .2rem;
                }
            }
        }
    }
    .goods-price {
        .price{
            color: #f44;
            font-size: .4rem;
            margin-right: .2rem;
        }
        .del{
            font-size: .32rem;
            color:#999;
        }
        i{
            font-size: .3rem;
        }
    }

</style>
