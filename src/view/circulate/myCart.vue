<template>
    <div class="cartMain">

        <van-swipe-cell v-if="goods.length != 0" v-for="pros in goods" :key="pros.id">
            <div class="goods_item">
                <van-checkbox class="card-goods__item" v-model="pros.checked" @click="ischeck(pros)">
                    <div class="shopImg">
                        <img :src="pros.cover" alt="">
                    </div>
                </van-checkbox>
                <div class="content">
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
                            @change="stepperChangeFn(pros, $event)"/>
                    </div>
                </div>
            </div>
            <template slot="right">
                <van-button style="border-radius: 100%;margin-top: .3rem;height: 1.2rem;font-size: .24rem;margin-left: 2px;" square type="danger" text="删除" @click="deleteShopFn(pros.productId)" />
            </template>
        </van-swipe-cell>

        <div v-if="goods.length == 0" class="not">
            <div>
                <img src="../../assets/images/timg.jpg" alt="">
            </div>
            <div>
                <p>购物车空空如也</p>
                <p @click="toPreferentialZone"><span>去逛逛</span></p>
            </div>
        </div>

        <van-submit-bar
            button-type="info"
            :price="allPrice"
            :button-text="submitBarText"
            @submit="onSubmit">
            <van-checkbox class="margin_left_20" v-model="isCheckAll" @click="checkAll">全选</van-checkbox>
        </van-submit-bar>
        <div style="height: 60px"></div>
    </div>
</template>

<script>

export default {
  data () {
    return {
      goods: [],
      isCheckAll: false, // 是否全选
      allPrice: 0, // 所有价格
      slectCount: 0, // 选中的条目
      allCount: 0, // 被选中的产品数量
      pageNum: 1,
      updateValue: 1,
      sdkConfig: null
    }
  },

  created () {

  },

  computed: {
    submitBarText () {
      return '去结算' + (this.allCount ? this.allCount : '')
    }
  },

  mounted () {
    this.getCartLists()
  },

  methods: {

    /** 数量改变时. */
    stepperChangeFn (item, e) {
      console.log(e)
      this.checkTrue(item)
      let parms = this.$Qs.stringify({
        productId: item.productId,
        quantity: e
      })
      this.$api.updateCartGoodsQuantityApi(parms).then(res => {
        // if (res.data.code * 1 === 200) {
        //   this.getCartLists()
        // }
      })
    },

    // 选中单个商品
    ischeck (item) {
      // 为未选中的时候改变为false，反之为true
      !item.checked ? this.checkTrue(item) : this.checkFalse(item)
    },

    /** 修改单个商品的true. */
    checkTrue (item) {
      if (!item.checked) this.slectCount++
      item.checked = true // 将商品选中状态改为true
      this.slectCount === this.goods.length
        ? this.isCheckAll = true
        : this.isCheckAll = false
      this.totalPeice()
      this.totalCount()
    },

    /** 修改单个商品的 false. */
    checkFalse (item) {
      item.checked = false // 将商品选中状态改为false
      this.slectCount--
      this.slectCount === this.goods.length
        ? this.isCheckAll = true
        : this.isCheckAll = false
      this.totalPeice()
      this.totalCount()
    },

    /** 选择全部商店的商品，已经计算总价和总数量的函数. */
    checkAll () {
      // 方法内调用方法
      this.isCheckAll = !this.isCheckAll
      this.isCheckAll
        ? this.goods.forEach(item => {
          this.checkTrue(item)
        })
        : this.goods.forEach(item => {
          this.checkFalse(item)
        })
    },

    /** 获取购物车列表. */
    getCartLists () {
      let parms = this.$Qs.stringify({
        userId: JSON.parse(sessionStorage.getItem('userInfo')).id,
        page: this.pageNum,
        limit: this.GLOBAL.LISTS_LIMIT
      })
      this.$toast.loading({
        mask: true,
        message: '加载中...',
        duration: 0
      })
      this.$api.getCartListsApi(parms).then(res => {
        this.$toast.clear()
        if (res.data.code * 1 === 200) {
          res.data.data.forEach(e => {
            e.cover = this.GLOBAL.BEFORE_IMG_URL + e.cover
            e.checked = false
          })
          this.goods = res.data.data
        }
      })
    },

    /** 计算总价. */
    totalPeice () {
      // 每次调用此方法，将初始值为0，遍历价格并累加
      this.allPrice = 0
      this.goods.forEach(item => {
        if (item.checked) {
          this.allPrice += item.salePrice * item.quantity * 100
        }
      })
    },

    /** 计算总数. */
    totalCount () {
      // 同上
      this.allCount = 0
      this.goods.forEach(item => {
        if (item.checked) this.allCount += item.quantity
      })
    },

    /** 点击删除按钮删除商品. */
    deleteShopFn (id) {
      let parm = this.$Qs.stringify({
        productId: id,
        userId: JSON.parse(sessionStorage.getItem('userInfo')).id
      })
      this.$api.deleteCartGoodsApi(parm).then(res => {
        if (res.data.code * 1 === 200) {
          this.getCartLists()
          this.$toast.success(res.data.message)
        }
      })
    },

    /** 点击去结算. */
    onSubmit () {
      let idAndNums = this.goods.filter(e => e.checked === true)
      if (idAndNums.length !== 0) {
        this.$router.push({
          path: 'submitOrder'
        })
        sessionStorage.setItem('allPrice', this.allPrice)
        sessionStorage.setItem('allCount', this.allCount)
        sessionStorage.setItem('submitOrderLists', JSON.stringify(idAndNums))
      } else {
        this.$toast('你还未选择商品哦')
      }
    },

    /** 去逛逛. */
    toPreferentialZone () {
      this.$router.push({
        path: '/preferentialZone'
      })
    }
  }
}
</script>

<style lang="less">
    .cartMain{
        background: #f5f5f5;
        min-height: 100vh;
        width: 100%;
    }
    .not{
        padding-top: 2rem;
        text-align: center;
        img{
            border-radius: 100%;
            max-width: 50%;
        }
        p{
            margin-bottom: .2rem;
            color: #999;
            span{
                color: #fff;
                background: #1989FA;
                padding: .2rem .8rem;
            }
        }
    }
    .van-checkbox__label {
        display: inline-block;
        margin-left: 8px;
        color: #323233;
        line-height: 20px;
        height: 90%;
    }
    .van-stepper button{
        border-radius: 100%;
    }
    .goods_item{
        width: 94%;
        margin: 10px auto 0;
        height: 2rem;
        display: flex;
        box-sizing: border-box;
        padding: 0 10px;
        background: #fff;
        border-radius: 6px;
        box-shadow: 0 0 10px 3px rgba(0,0,0,.03);
        .shopImg{
            width: 1.6rem;
            height: 100%;
            border-radius: 4px;
            overflow: hidden;
            img{
                max-width: 100%;
                height: 100%;
            }
        }
        .content{
            width: 70%;
            box-sizing: border-box;
            padding-left: .2rem;
            position: relative;
            .title{
                font-size: .28rem;
                color: #333;
                margin-top: .1rem;
            }
            .desc{
                font-size: .24rem;
                color: #999;
            }
            .price{
                margin-top: .15rem;
                font-size: .26rem;
                color: #e13d13;
                i{
                    font-size: .26rem;
                    margin-right: .2rem;
                }
            }
            .num{
                position: absolute;
                right: 0;
                top: .8rem;
                color: #e13d13;
                background: #fff;
            }
            .updateQuantity{
                position: absolute;
                right: 0;
                bottom: 4px;
                min-width: 30px;
                height: 26px;
            }
        }
    }
</style>
