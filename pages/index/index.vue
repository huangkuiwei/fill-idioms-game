<script>
export default {
  name: 'index',

  data() {
    return {
      loading: false,
      deviceUuid: '',
      activationCode: ''
    }
  },

  onLoad() {
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
	  
	  uni.navigateTo({
	  	url: '/pages/idioms1/idioms1'
	  })
    },

    getDeviceUuid() {
      plus.device.getInfo({
        success: (event)=> {
          this.deviceUuid = event.uuid
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
  <view class="index-page">
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

.index-page {
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