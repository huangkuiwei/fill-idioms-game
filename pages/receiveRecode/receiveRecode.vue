<script>
import uniListItem from '../../uni_modules/uni-list/components/uni-list-item/uni-list-item.vue'
import uniList from '../../uni_modules/uni-list/components/uni-list/uni-list.vue'

export default {
  name: 'receiveRecode',
  components: { uniList, uniListItem },

  data() {
    return {
      deviceUuid: '',
      recodeList: []
    }
  },

  methods: {
    getRecode() {
      plus.device.getInfo({
        success: (event) => {
          this.deviceUuid = event.uuid

          uni.request({
            url: `http://110.40.131.58:5000/api/app-bind-pwd/mywithdrawlist/${this.deviceUuid}`,
            method: 'POST',
            header:{
              Authorization: `Bearer ${uni.getStorageSync('token')}`
            },
            success: (res) => {
              if (!res.data.errors) {
                this.recodeList = res.data.data || []
              }
            },
            complete: () => {
              uni.hideLoading()
            }
          })
        },
        fail: () => {
          uni.hideLoading()

          uni.showToast({
            title: '获取设备id失败',
            icon: 'none'
          })
        }
      })
    }
  }
}
</script>

<template>
  <view class="receive-recode">
    <uni-list>
      <uni-list-item v-for="(item, index) of recodeList" :key="index" :title="item.note" />
    </uni-list>
  </view>
</template>

<style lang="scss">
.receive-recode {

}
</style>
