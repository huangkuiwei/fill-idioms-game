<template>
  <view class="login-page">
    <input placeholder="请输入用户名" v-model="loginState.account" />
    <input placeholder="请输入密码" v-model="loginState.password" type="password"/>
    <button type="primary" @click="login">登录</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      loginState: {
        account: '',
        password: ''
      }
    }
  },

  onLoad() {
    let token = uni.getStorageSync('token')

    if (token) {
      uni.navigateTo({
        url: '/pages/verification/verification'
      })
    }
  },

  methods: {
    login() {
      if (!this.loginState.account) {
        uni.showToast({
          title: '请输入账号',
          icon: 'none'
        })

        return
      }

      if (!this.loginState.password) {
        uni.showToast({
          title: '请输入密码',
          icon: 'none'
        })

        return
      }

      uni.showLoading({
        title: '加载中...',
        mask: true
      })

      uni.request({
        url: 'http://110.40.131.58:5000/api/sys-auth/login',
        method: 'POST',
        data: {
          ...this.loginState
        },
        success: (res) => {
          if (!res.data.errors) {
            uni.setStorageSync('token', res.data.data.accessToken)

            uni.navigateTo({
              url: '/pages/verification/verification'
            })
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
    }
  }
}
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.login-page {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40rpx;
  padding: 0 40rpx;
  background: url('/static/images/bg.png') top left/100% 100% no-repeat;

  input {
    width: 100%;
    height: 80rpx;
    border-radius: 8rpx;
    border: 1px solid #cccccc;
    padding: 0 40rpx;
    font-size: 32rpx;
  }

  button {
    width: 100%;
  }
}
</style>
