<template>
    <div class="goods">
        <van-swipe class="goods-swipe margin_bottom" :autoplay="3000" style="height: 5rem">
            <van-swipe-item v-for="(thumb,index) in goods.productPhotoList" :key="index">
                <img style="height: 100%;" :src="thumb.photo" >
            </van-swipe-item>
        </van-swipe>

        <!--<van-cell-group>-->
            <!--<van-cell class="goods-express">-->
                <!--<div class="goods-title margin_bottom_10">{{ goods.name }}</div>-->
                <!--<van-col span="14">-->
                    <!--<div class="goods-price">-->
                        <!--<span class="price" style="color: #e13d13 "><i class="iconfont icon-moneyrmb"></i>{{ formDataPrice(goods.salePrice) }}</span>-->
                        <!--<span class="del"><s> <i class="iconfont icon-moneyrmb"></i> {{formDataPrice(goods.marketPrice)}} </s></span>-->
                    <!--</div>-->
                <!--</van-col>-->
                <!--<van-col span="10" style="text-align: right"><span style="margin-right: .2rem;">类型</span> {{ goods.categoryName }}</van-col>-->
            <!--</van-cell>-->
        <!--</van-cell-group>-->

        <div class="bg_fff padding_bottom margin_bottom padding_left_right_20">
            <div class="item_goods">
                <div class="title">{{ goods.name }}</div>
            </div>
            <div class="item_goods">
                <div class="price color_theme">平台价</div>
                <div class="price color_theme"><i class="iconfont icon-moneyrmb"></i>{{goods.salePrice}}</div>
            </div>
            <div class="item_goods">
                <div class="price">原价</div>
                <div class="price color_999"><s><i class="iconfont icon-moneyrmb"></i>{{goods.salePrice}}</s></div>
            </div>

        </div>

        <div class="bg_fff margin_bottom">
            <div class="item_goods" v-for="(item,index) in goods.productAttrList" :key="index">
                <div class="init">{{item.attrName}}</div>
                <div class="init">{{item.attrValue}}</div>
            </div>
        </div>

        <div class="bg_fff padding_bottom">
            <div class="goods_details padding_left_right_20 margin_bottom"><span>简介</span></div>
            <div class="details padding_bottom padding_left_right_20" v-html="goods.intro"></div>
        </div>

        <div class="footer">

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
        <div style="height: 60px;"></div>
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
    .goods{
        width: 100%;
        min-height: 80vh;
        background: #f5f5f5;
    }
    .color_999{
        color: #999;
    }
    .color_theme{
        color: #409eff;
    }
    .padding_bottom{
        padding-bottom: 10px;
    }
    .margin_bottom{
        margin-bottom: 10px;
    }
    .padding_left_right_20{
        box-sizing: border-box;
        padding: 0 20px;
    }
    .bg_fff{
        background: #fff;
    }
    .item_goods{
        display: flex;
        line-height: 40px;
        .init:first-child{
            width: 30%;
            color:#999;
            text-align: right;
            margin-right: 10px;
        }
        .init:last-child{
            width: 40%;
            color: #333;
        }
        .price{
            margin-right: 10px;
        }
        .title{
            font-size: .4rem;
            color: #333;
            font-weight: 600;
        }
    }
    .goods_details{
        height: 50px;
        width: 100%;
        line-height: 50px;
        position: relative;
        &::after{
            content: " ";
            display: block;
            position: absolute;
            width: 100%;
            left:0;
            bottom: 0;
            border-top:1px solid #cdcdcd;
            transform: scaleY(.3);
        }
    }

    .details{
        img{
            max-width: 100%;
        }
    }

</style>
