<template>
    <div>

        <div class="edit_address">
            <van-address-edit
                :area-list="areaList"
                show-delete
                show-set-default
                show-search-result
                :search-result="searchResult"
                @save="onSave"
                @delete="onDelete"
                @change-detail="onChangeDetail"
            />
        </div>

    </div>
</template>

<script>
import areaList from '../../assets/js/area'
export default {
  data () {
    return {
      areaList,
      searchResult: []
    }
  },
  mounted () {
    console.log(areaList)
  },
  methods: {
    onSave () {
      this.$toast('save')
    },
    onDelete () {
      this.$toast('delete')
    },
    onChangeDetail (val) {
      if (val) {
        this.searchResult = [{
          name: '黄龙万科中心',
          address: '杭州市西湖区'
        }]
      } else {
        this.searchResult = []
      }
    }
  }
}
</script>

<style scoped>

</style>
