<template>
    <div>
        <div class="banner">
            <van-swipe :autoplay="3000" :show-indicators="showBtn" indicator-color="white" @change="bannerChangeFn($event)">
                <van-swipe-item v-for="(item,index) in bannerList" :key="index" @click="clickFn(item)">
                    <div class="bannerImgWrap">
                        <img :src="imgApi + item.cover" alt="">
                    </div>
                </van-swipe-item>
            </van-swipe>
            <div class="imgIndexWrap">
                <div class="item" :class="bannerActive === index ? 'bannerActive' : ''"
                     v-for="(item,index) in bannerList" :key="index"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      imgApi: this.GLOBAL.BEFORE_IMG_URL,
      showBtn: false,
      bannerActive: 0,
      bannerList: [require('../assets/images/white.png')]
    }
  },
  mounted () {
    this.getBannerLists()
  },
  methods: {
    //  轮播图切换改变时
    bannerChangeFn (e) {
      this.bannerActive = e
    },

    /** 轮播图点击. */
    clickFn (item) {
      if (item.category * 1 === 2) {
        console.log(item)
        window.location.href = item.url
      } else if (item.category * 1 === 1) {
        this.$router.push({
          path: 'hotDetails',
          query: {
            'isCustom': 1,
            'articleId': item.id
          }
        })
      }
    },

    getBannerLists () {
      this.$api.getBannerLists().then((res) => {
        if (res.data.code * 1 === 200) {
          this.bannerList = res.data.data
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
    /* 轮播 */
    .banner {
        box-shadow: 0 6px 10px rgba(45, 146, 239, .15);
        position: relative;

        .bannerImgWrap {
            width: 100%;
            height: 4rem;
            font-size: 0;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .imgIndexWrap {
            position: absolute;
            left: 0;
            bottom: 12px;
            display: flex;
            justify-content: center;
            z-index: 10;
            width: 100%;

            .item {
                width: 8px;
                height: 8px;
                margin-right: 10px;
                background: #f1f1f1;
                border-radius: 100%;

                &.bannerActive {
                    width: 16px;
                    border-radius: 4px;
                    background: #0069FF;
                }
            }
        }
    }

</style>
