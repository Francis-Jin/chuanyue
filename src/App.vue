<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
document.oncontextmenu = (e) => {
  if (e.button === 2) {
    e.preventDefault()
  }
}
export default {
  name: 'App'
}
const myDate = new Date()
const Str = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate()
console.log('版本日期：' + Str)
</script>

<style>
    @import "../src/style/public.css";
  /*#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }*/
</style>
