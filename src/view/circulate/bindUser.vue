<template>
    <div>
        <BindUser :identity="identity"></BindUser>
    </div>
</template>

<script>
import BindUser from '../../components/bindUser'
export default {
  components: {
    BindUser
  },
  data () {
    return {
      identity: this.$route.query.identity
    }
  }
}
</script>

<style scoped>

</style>
