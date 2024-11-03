<script>
import uniList from '../../uni_modules/uni-list/components/uni-list/uni-list.vue'
import uniListItem from '../../uni_modules/uni-list/components/uni-list-item/uni-list-item.vue'

export default {
  name: 'userCenter',

  components: {
    uniList,
    uniListItem
  },

  methods: {
    jumpUrl(url) {
      uni.navigateTo({
        url: url
      })
    },
  }
}
</script>

<template>
  <view class="user-center">
    <uni-list>
      <uni-list-item title="领取记录" showArrow @click="jumpUrl('/pages/receiveRecode/receiveRecode')"></uni-list-item>
    </uni-list>
  </view>
</template>

<style lang="scss">
.user-center {

}
</style>
