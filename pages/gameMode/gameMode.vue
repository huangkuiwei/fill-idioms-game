<template>
  <view class="game-mode-page">
    <view class="select" v-if="requestSuccess">
      <view>请选择游戏模式</view>
      <button type="primary" @click="jumpUrl('/pages/idioms/idioms')" @longtap="jumpUrl('/pages/data/data')">成语填空</button>
      <button type="primary" @click="jumpUrl('/pages/findError/findError')" @longtap="jumpUrl('/pages/findErrorData/findErrorData')">成语找错</button>
      <button type="primary" @click="jumpUrl('/pages/sentence/sentence')" @longtap="jumpUrl('/pages/sentenceData/sentenceData')">句子填空</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // TODO
      requestSuccess: true
    }
  },

  onShow() {
    // #ifdef APP
    this.login()
    // #endif
  },

  methods: {
    jumpUrl(url) {
      uni.navigateTo({
        url: url
      })
    },

    login() {
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

    verification() {
      uni.showLoading({
        title: '加载中...',
        mask: true
      })

      plus.device.getInfo({
        success: (event) => {
          let deviceUuid = event.uuid

          // 验证
          uni.request({
            url: `http://110.40.131.58:5000/api/app-bind-pwd/verifyapp/${deviceUuid}`,
            method: 'POST',
            header:{
              Authorization: `Bearer ${uni.getStorageSync('token')}`
            },
            success: (res) => {
              uni.hideLoading()

              setTimeout(() => {
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
              }, 50)
            },
            complete: () => {
              uni.hideLoading()
            }
          })
        },
        fail: () => {
          uni.redirectTo({
            url: '/pages/verification/verification'
          })
        }
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
  background: url('/static/images/bg2.jpg') top left/100% 100% no-repeat;
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
