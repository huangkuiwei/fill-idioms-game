<script>
export default {
  data() {
    return {
      loading: false,
      deviceUuid: '',
      activationCode: ''
    }
  },

  onShow() {
    // #ifdef APP
    this.getDeviceUuid()
    // #endif
  },

  methods: {
    verification() {
      if (!this.activationCode) {
        uni.showToast({
          title: '请输入激活码',
          icon: 'none'
        })

        return
      }

      uni.showLoading({
        title: '加载中...',
        mask: true
      })

      uni.request({
        url: `http://110.40.131.58:5000/api/app-bind-pwd/bidapp/${this.deviceUuid}/${this.activationCode}`,
        method: 'POST',
        header:{
          Authorization: `Bearer ${uni.getStorageSync('token')}`
        },
        success: (res) => {
          if (!res.data.errors) {
            if (res.data.data) {
              uni.navigateTo({
                url: '/pages/gameMode/gameMode'
              })
            } else {
              uni.showToast({
                title: '验证失败',
                icon: 'error'
              })
            }
          } else {
            uni.showToast({
              title: res.data.errors
            })
          }
        },
        complete: () => {
          uni.hideLoading()
        }
      })
    },

    getDeviceUuid() {
      plus.device.getInfo({
        success: (event) => {
          this.deviceUuid = event.uuid

          // 验证
          uni.request({
            url: `http://110.40.131.58:5000/api/app-bind-pwd/verifyapp/${this.deviceUuid}`,
            method: 'POST',
            header:{
              Authorization: `Bearer ${uni.getStorageSync('token')}`
            },
            success: (res) => {
              if (!res.data.errors) {
                if (res.data.data) {
                  uni.navigateTo({
                    url: '/pages/gameMode/gameMode'
                  })
                }
              } else {
                uni.showToast({
                  title: res.data.errors
                })
              }
            },
            complete: () => {
              uni.hideLoading()
            }
          })
        },
        fail: (error) => {
          console.log('error', error)

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
  <view class="verification-page">
    <view class="tips">请输入激活码</view>
    <input type="text" v-model="activationCode" />
    <button type="primary" @click="verification" :loading="loading">确定</button>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background: url('/static/images/bg.png');
}

.verification-page {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .tips {
    font-size: 36rpx;
    margin-bottom: 40rpx;
  }

  input {
    background: #ffffff;
    width: 80%;
    height: 80rpx;
    font-size: 36rpx;
    padding: 0 40rpx;
    border-radius: 8rpx;
    margin-bottom: 80rpx;
  }

  button{
    width: 80%;
  }
}
</style>