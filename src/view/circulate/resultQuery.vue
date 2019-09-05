<template>
    <div>
        <van-cell-group>
            <van-cell :border="false" />
            <van-cell title="作文批改结果" value="" is-link @click="toPageFn('/resultSearchPage?title=作文批改结果列表&category=1')"/>
            <van-cell title="作文精批结果" value="" is-link @click="toPageFn('/resultSearchPage?title=作文精批结果列表&category=2')"/>
            <van-cell title="同步辅导结果" value="" is-link @click="toPageFn('/resultSearchPage?title=同步辅导结果列表&category=3')"/>
            <!--<van-cell title="测评结果" value="" is-link/>-->
        </van-cell-group>
    </div>
</template>

<script>
export default {
  methods: {
    /** 跳转页面. */
    toPageFn (path) {
      this.$router.push({
        path: path
      })
    }
  }
}
</script>

<style scoped>

</style>
