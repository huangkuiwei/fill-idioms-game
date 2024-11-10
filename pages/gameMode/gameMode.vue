<template>
  <view class="game-mode-page">
    <view class="select" v-if="requestSuccess">
      <view>请选择游戏模式</view>
      <button type="primary" @click="jumpUrl('/pages/idioms/idioms')" @longtap="jumpUrl('/pages/data/data')">成语填空</button>
      <button type="primary" @click="jumpUrl('/pages/findError/findError')" @longtap="jumpUrl('/pages/findErrorData/findErrorData')">成语找错</button>
      <button type="primary" @click="jumpUrl('/pages/sentence/sentence')" @longtap="jumpUrl('/pages/sentenceData/sentenceData')">句子填空</button>
      <button type="primary" @click="jumpUrl('/pages/adv/adv')">看视频得收益</button>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      requestSuccess: false
    }
  },

  computed: {
    ...mapState('app', ['deviceUuid'])
  },

  onShow() {
    this.autoLogin()
  },

  methods: {
    ...mapMutations('app', ['_setDeviceUuid']),

    jumpUrl(url) {
      uni.navigateTo({
        url: url
      })
    },

    autoLogin() {
      uni.showLoading({
        title: '加载中...',
        mask: true
      })

      uni.request({
        url: 'http://110.40.131.58:5000/api/sys-auth/login',
        method: 'POST',
        data: {
          account: 'superadmin',
          password: 'Admin123456@'
        },
        success: (res) => {
          if (!res.data.errors) {
            uni.setStorageSync('token', res.data.data.accessToken)
            this.verification()
          } else {
            uni.redirectTo({
              url: '/pages/verification/verification'
            })
          }
        },
        complete: () => {
          uni.hideLoading()
        }
      })
    },

    async verification() {
      uni.showLoading({
        title: '加载中...',
        mask: true
      })

      // #ifdef APP
      await this.getUuid()
      // #endif

      uni.request({
        url: `http://110.40.131.58:5000/api/app-bind-pwd/verifyapp/${this.deviceUuid}`,
        method: 'POST',
        header:{
          Authorization: `Bearer ${uni.getStorageSync('token')}`
        },
        success: (res) => {
          if (!res.data.errors) {
            if (res.data.data) {
              this.requestSuccess = true
            } else {
              uni.redirectTo({
                url: '/pages/verification/verification'
              })
            }
          } else {
            uni.redirectTo({
              url: '/pages/verification/verification'
            })
          }
        },
        complete: () => {
          uni.hideLoading()
        }
      })
    },

    async getUuid() {
      return new Promise((resolve, reject) => {
        plus.device.getInfo({
          success: (event) => {
            this._setDeviceUuid(event.uuid)
            resolve()
          },
          fail: () => {
            uni.redirectTo({
              url: '/pages/verification/verification'
            })
            reject()
          }
        })
      })
    }
  },
};
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.game-mode-page {
  height: 100%;
  overflow: hidden;
  background: url('/static/images/bg2.png') top left/100% 100% no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .select {
    display: flex;
    flex-direction: column;
    gap: 50rpx;

    view {
      font-size: 46rpx;
      font-weight: bold;
      text-align: center;
      color: #333333;
    }

    button {
      width: 400rpx;
    }
  }
}
</style>
