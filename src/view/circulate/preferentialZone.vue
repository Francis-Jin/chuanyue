<template>
    <div>
        <Banner></Banner>

        <div class="main">
            <div v-if="showFooterBar" style="height: .3rem;"></div>
            <div class="hotNews">
                <div class="hotNavs">
                    <div class="item margin_right_10" :class="hotActive === 0 ? 'active': ''" @click="hotNavFn(0)">
                        <span>商品</span>
                    </div>
                    <div class="item" :class="hotActive === 1 ? 'active': ''" @click="hotNavFn(1)">
                        <span>套餐</span>
                    </div>
                </div>
            </div>

            <div class="showContentWrap">

                <div v-if="isShowListsBox" class="shopWrap">

                    <div class="item" v-for="(item,index) in shopLists" :key="index">
                        <div class="shopImg" @click="toDetails(item.id)">
                            <img :src="item.cover" alt="">
                        </div>
                        <div class="shopName overflow2" @click="toDetails(item.id)">
                            <span>{{item.name}}</span>
                        </div>
                        <div class="priceAddCart">
                            <div class="price">
                                <span>￥</span>
                                <span>{{item.salePrice.toFixed(2)}}</span>
                            </div>
                            <div class="addCart" @click="addCart(item.id)">
                                <span>添加购物车</span>
                            </div>
                        </div>
                    </div>

                </div>

                <div v-else class="setMealWrap">
                    <div class="init" v-for="(item,index) in setMealLists" :key="index">
                        <div class="setMealName overflow2" @click="toPackgeDetails(item.id)">
                            <span>{{item.name}}</span>
                        </div>
                        <div class="price" @click="toPackgeDetails(item.id)">
                            <span>￥</span>
                            <span>{{item.salePrice}}</span>
                        </div>
                        <div class="addCart" @click="addCart(item.id)">
                            <span>添加购物车</span>
                        </div>
                    </div>
                </div>

            </div>

        </div>

        <!--跳转到购物车-->
        <div class="myCart"  @click="toCartPageFn">
            <i class="iconfont icon-cartoutline"></i>
            <div class="tag" v-if="allQuantity != 0"><span>{{allQuantity}}</span></div>
        </div>

        <FooterBar v-if="showFooterBar" :curIndex='1'></FooterBar>
    </div>
</template>

<script>
import Banner from '../../components/banner'
import FooterBar from '../../components/footerBar'
export default {
  components: {
    Banner,
    FooterBar
  },
  data () {
    return {
      userIdentity: localStorage.getItem('identity') * 1,
      showFooterBar: this.$route.query.showFooterBar,
      hotActive: 0,
      isShowListsBox: true,
      shopLists: [],
      setMealLists: [],
      pageNum: 1,
      allQuantity: '',
      categoryType: 1,
      quantityValue: 1 // 默认商品购买数量为1
    }
  },
  mounted () {
    this.getGoodsLists()
    this.getCartShopAllQuantity()
  },
  methods: {
    /** 获取商品列表. */
    getGoodsLists () {
      let params = this.$Qs.stringify({
        category: this.categoryType,
        page: this.pageNum,
        limit: this.GLOBAL.LISTS_LIMIT
      })
      this.$toast.loading({
        mask: false,
        message: '加载中...',
        duration: 0
      })
      this.$api.getGoodsListsApi(params).then(res => {
        this.$toast.clear()
        if (res.data.code * 1 === 200) {
          if (this.categoryType === 1) {
            res.data.data.forEach(e => {
              e.cover = this.GLOBAL.BEFORE_IMG_URL + e.cover
            })
            this.shopLists = this.shopLists.concat(res.data.data)
          } else {
            this.setMealLists = this.setMealLists.concat(res.data.data)
          }
        }
      })
    },
    /** tabs 切换. */
    hotNavFn (index) {
      this.hotActive = index
      this.isShowListsBox = !this.isShowListsBox
      if (index === 0) {
        this.categoryType = 1
        this.pageNum = 1
        this.shopLists = []
        this.getGoodsLists()
      }
      if (index === 1) {
        this.categoryType = 2
        this.pageNum = 1
        this.setMealLists = []
        this.getGoodsLists()
      }
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

    /** 跳转套餐详情. */
    toPackgeDetails (itemId) {
      this.$router.push({
        path: '/packageDetails',
        query: {
          itemId: itemId
        }
      })
    },

    /** 点击加入购物车. */
    addCart (itemid) {
      const userId = JSON.parse(sessionStorage.getItem('userInfo')).id
      let parm = this.$Qs.stringify({
        productId: itemid,
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

    /** 跳转到我的购物车. */
    toCartPageFn () {
      this.$router.push({
        path: '/myCart'
      })
    }
  }
}
</script>

<style scoped lang="less">
    .main{
        width: 90%;
        margin: 0 auto;
    }
    .hotNews{
        width: 100%;
        .hotNavs{
            display: flex;
            .item{
                text-align: center;
                color: #666;
                height: 70px;
                line-height: 70px;
                position: relative;
                span{
                    position: relative;
                    z-index: 2;
                    padding: 0 .1rem;
                    font-size: .28rem;
                }
                &.active{
                    color: #4276DF;
                    span{
                        font-size: .32rem;
                        font-weight: 900;
                    }
                    &:after{
                        position: absolute;
                        content: "";
                        left: 20%;
                        bottom: 20px;
                        display: block;
                        width: 60%;
                        height: 2px;
                        border-radius: 3px;
                        background: #4276DF;
                    }
                }
            }
        }
    }
    .shopWrap{
        &:after{
            display: block;
            content: "";
            clear: both;
        }
        .item{
            width: 48%;
            height: 4.8rem;
            float: left;
            border-radius: 10px 10px 0 0;
            overflow: hidden;
            box-shadow: 0 4px 10px 2px rgba(0,0,0,.04);
            margin-bottom: 16px;
            position: relative;
            &:nth-child(2n-1){
                margin-right: 3%;
            }
            .shopImg{
                width: 100%;
                height: 3rem;
                text-align: center;
                font-size: 0;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .shopName{
                font-size: .28rem;
                box-sizing: border-box;
                padding:0 10px;
                margin: 4px 0 0px;
                min-height: .6rem;
                span{
                    color: #666666;
                }
            }
            .priceAddCart{
                position: absolute;
                left: 0;
                width: 100%;
                bottom: 0;
                display: flex;
                justify-content: space-between;
                color: #4276DF;
                .price,.addCart{
                    width: 50%;
                    height: 40px;
                    line-height: 40px;
                }
                .price{
                    font-size: .24rem;
                    text-indent: 10px;
                }
                .addCart{
                    text-align: center;
                    box-sizing: border-box;
                    span{
                        font-size: .20rem;
                        padding: 4px 8px;
                        border-radius: 18px;
                        border: 1px solid #4276DF;
                    }
                }
            }
        }
    }
    .setMealWrap{
        .init{
            width: 100%;
            height: 80px;
            position: relative;
            margin-bottom: 16px;
            &:before{
                position: absolute;
                left: 0;
                top: 0;
                background: #4276DF;
                width: 12px;
                height: 100%;
                border-radius: 8px 0 0 8px;
                content: "";
            }
            .setMealName {
                max-width: 250px;
                box-sizing: border-box;
                padding-left: 30px;
                height: 50px;
                color: #666666;
                padding-top: 10px;
                margin-bottom: 10px;
            }
            .price{
                text-indent: 30px;
                color: #4276DF;
            }
            .addCart{
                position: absolute;
                right: 0px;
                top: 20px;
                width: 80px;
                height: 30px;
                line-height: 30px;
                border-radius: 15px;
                color: #4276DF;
                font-size: .22rem;
                text-align: center;
                border: 1px solid #4276DF;
            }
        }
    }

    .myCart{
        position: fixed;
        right: .5rem;
        bottom: 1.5rem;
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        color: #fff;
        z-index: 10;
        background: #fff;
        box-shadow: 0 0 10px 2px rgba(0,0,0,.08);
        border-radius: 100%;
        i{
            font-size: 24px;
            font-weight: bold;
            color: #4276DF;
        }
        .tag{
            position: absolute;
            right: -.05rem;
            top: -.05rem;
            width: .4rem;
            height: .4rem;
            background: #e13d13;
            border-radius: 50%;
            text-align: center;
            line-height: .4rem;
            font-size: .2rem;
        }
    }
</style>
