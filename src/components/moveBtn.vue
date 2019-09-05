<template>
    <div class="ys-float-btn" :style="{'width':itemWidth+'px','height':itemHeight+'px','left':left+'px','top':top+'px'}"
         ref="div"
         @click ="onBtnClicked">
        <i class="iconfont icon-add"></i>
    </div>
</template>

<script>
export default {
  name: 'FloatImgBtn',
  props: {
    text: {
      type: String,
      default: '默认文字'
    },
    itemWidth: {
      type: Number,
      default: 60
    },
    itemHeight: {
      type: Number,
      default: 60
    },
    gapWidth: {
      type: Number,
      default: 10
    },
    coefficientHeight: {
      type: Number,
      default: 0.8
    }
  },
  created () {
    this.clientWidth = document.documentElement.clientWidth
    this.clientHeight = document.documentElement.clientHeight
    this.left = this.clientWidth - this.itemWidth - this.gapWidth
    this.top = this.clientHeight * this.coefficientHeight - 40
  },
  mounted () {
    window.addEventListener('scroll', this.handleScrollStart)
    this.$nextTick(() => {
      const div = this.$refs.div
      div.addEventListener('touchstart', () => {
        div.style.transition = 'none'
        const mo = function (e) {
          e.preventDefault()
        }
        document.body.style.overflow = 'hidden'
        document.addEventListener('touchmove', mo, false)// 禁止页面滑动
      }, { passive: false })
      div.addEventListener('touchmove', (e) => {
        event.preventDefault()
        if (e.targetTouches.length === 1) {
          let touch = event.targetTouches[0]
          this.left = touch.clientX - this.itemWidth / 2
          this.top = touch.clientY - this.itemHeight / 2
        }
      }, { passive: false })
      div.addEventListener('touchend', () => {
        div.style.transition = 'all 0.3s'
        const mo = function (e) {
          e.preventDefault()
        }
        document.body.style.overflow = ''// 出现滚动条
        document.removeEventListener('touchmove', mo, false)
        if (this.left > this.clientWidth / 2) {
          this.left = this.clientWidth - this.itemWidth - this.gapWidth
        } else {
          this.left = this.gapWidth
        }
      }, { passive: false })
    })
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScrollStart)
  },
  methods: {
    onBtnClicked () {
      this.$emit('onFloatBtnClicked')
    },
    handleScrollStart () {
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.handleScrollEnd()
      }, 300)
      this.currentTop = document.documentElement.scrollTop || document.body.scrollTop
      if (this.left > this.clientWidth / 2) {
        this.left = this.clientWidth - this.itemWidth / 2
      } else {
        this.left = -this.itemWidth / 2
      }
    },
    handleScrollEnd () {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop === this.currentTop) {
        if (this.left > this.clientWidth / 2) {
          this.left = this.clientWidth - this.itemWidth - this.gapWidth
        } else {
          this.left = this.gapWidth
        }
        clearTimeout(this.timer)
      }
    }
  },
  data () {
    return {
      timer: null,
      currentTop: 0,
      clientWidth: 0,
      clientHeight: 0,
      left: 0,
      top: 0
    }
  }
}
</script>

<style lang="less" scoped>
    .ys-float-btn{
        background:rgb(255,255,255);
        box-shadow:0 2px 10px 0 rgba(0,0,0,0.1);
        border-radius:50%;
        color: #666666;
        z-index: 10;
        transition: all 0.3s;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        position: fixed;
        bottom: 20vw;
        i{
            color: #4276DF;
            font-size: .5rem;
        }
        img{
            width: 50%;
            height: 50%;
            object-fit: contain;
            margin-bottom: 3px;
        }
    }
</style>
