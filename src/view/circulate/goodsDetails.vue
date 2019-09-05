<template>
    <div class="goods">
        <van-swipe class="goods-swipe" :autoplay="3000" style="height: 5rem">
            <van-swipe-item v-for="(thumb,index) in goods.productPhotoList" :key="index">
                <img style="height: 100%;" :src="thumb.photo" >
            </van-swipe-item>
        </van-swipe>

        <van-cell-group>
            <van-cell class="goods-express">
                <div class="goods-title margin_bottom_10">{{ goods.name }}</div>
                <van-col span="14">
                    <div class="goods-price">
                        <span class="price" style="color: #e13d13 "><i class="iconfont icon-moneyrmb"></i>{{ formDataPrice(goods.salePrice) }}</span>
                        <span class="del"><s> <i class="iconfont icon-moneyrmb"></i> {{formDataPrice(goods.marketPrice)}} </s></span>
                    </div>
                </van-col>
                <van-col span="10" style="text-align: right"><span style="margin-right: .2rem;">类型</span> {{ goods.categoryName }}</van-col>
            </van-cell>
            <div class="type">
                <ul>
                    <li v-for="(item,index) in goods.productAttrList" :key="index">
                        <div class="item"><span>{{item.attrName}}</span></div>
                        <div class="item"><span>{{item.attrValue}}</span></div>
                    </li>
                </ul>
            </div>
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
                <div class="details" v-html="goods.intro"></div>
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
</template>

<script>
export default {
  data () {
    return {
      itemId: this.$route.query.itemId,
      goods: '',
      allQuantity: '',
      quantityValue: 1
    }
  },
  mounted () {
    this.getGoodsDetails()
    this.getCartShopAllQuantity()
  },
  methods: {
    /** 返回两位小数价格. */
    formDataPrice (price) {
      return price
      // return price.toFixed(2)
    },

    /** 获取商品详情. */
    getGoodsDetails () {
      let parm = this.$Qs.stringify({
        productId: this.itemId
      })
      this.$toast.loading({
        message: '加载中...',
        mask: false,
        duration: 0
      })
      this.$api.getGoodsDetailsApi(parm).then(res => {
        this.$toast.clear()
        if (res.data.code * 1 === 200) {
          res.data.data.productPhotoList.forEach(e => {
            e.photo = this.GLOBAL.BEFORE_IMG_URL + e.photo
          })
          this.goods = res.data.data
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

    /** 点击立即购买. */
    goBuyFn () {
      let idAndNums = []
      this.goods.cover = this.GLOBAL.BEFORE_IMG_URL + this.goods.cover
      this.goods.productId = this.goods.id
      this.goods.quantity = this.quantityValue
      idAndNums.push(this.goods)
      this.allPrice = this.quantityValue * this.goods.salePrice * 100
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

<style lang="less">
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
    .details{
        img{
            max-width: 100%;
        }
    }
    .goods {
        padding-bottom: 50px;
        &-swipe {
            img {
                width: 100%;
                display: block;
            }
        }
        &-title {
            font-size: 16px;
        }
        &-price {
            .price{
                color: #f44;
                font-size: .4rem;
                margin-right: .2rem;
            }
            .del{
                font-size: .4rem;
                color:#999;
            }
            i{
                font-size: .3rem;
            }
        }
        &-express {
            color: #999;
            font-size: 12px;
            padding: 5px 15px;
        }
        &-cell-group {
            margin: 15px 0;
            .van-cell__value {
                color: #999;
            }
        }
        &-tag {
            margin-left: 5px;
        }
    }
</style>
