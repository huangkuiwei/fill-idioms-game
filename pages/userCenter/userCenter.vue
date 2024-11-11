<script>
import { mapState } from 'vuex';
import uniList from '../../uni_modules/uni-list/components/uni-list/uni-list.vue'
import uniListItem from '../../uni_modules/uni-list/components/uni-list-item/uni-list-item.vue'
import uniIcons from '../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue'

export default {
  name: 'userCenter',

  data() {
    return {
      totalMoney: 0,
      base64String: '',
      withdrawalMoney: null,
      username: '',
      usernameBak: '',
      usernameDialog: false
    }
  },

  computed: {
    ...mapState('app', ['deviceUuid']),
  },

  components: {
    uniList,
    uniListItem,
    uniIcons
  },

  onShow() {
    let base64String = uni.getStorageSync('base64String')
    let username = uni.getStorageSync('username')

    if (base64String) {
      this.base64String = base64String
    }

    if (username) {
      this.username = username
    }

    this.getTotalMoney()
  },

  methods: {
    jumpUrl(url) {
      uni.navigateTo({
        url: url
      })
    },

    getTotalMoney() {
      uni.showLoading({
        title: '请稍等...'
      })

      uni.request({
        url: `http://110.40.131.58:5000/api/app-bind-pwd/myhomeprice/${this.deviceUuid}`,
        method: 'POST',
        header:{
          Authorization: `Bearer ${uni.getStorageSync('token')}`
        },
        success: (response) => {
          this.totalMoney = response.data.data
        },
        complete: () => {
          uni.hideLoading()
        }
      })
    },

    showWithdrawalDialog() {
      if (Number(this.totalMoney) < 1) {
        uni.showToast({
          title: '余额不足1',
          icon: 'error'
        })

        return
      }

      this.$refs.withdrawalDialogRef.open()
    },

    withdrawal() {
      if (Number(this.withdrawalMoney) < 1) {
        uni.showToast({
          title: '最低提现1',
          icon: 'error'
        })

        return
      }

      if (Number(this.withdrawalMoney) > this.totalMoney) {
        uni.showToast({
          title: '余额不足',
          icon: 'error'
        })

        return
      }

      uni.showLoading({
        title: '请稍等...'
      })

      uni.request({
        url: `http://110.40.131.58:5000/api/app-bind-pwd/addwithdrawrecords/${this.deviceUuid}/${this.withdrawalMoney}/1`,
        method: 'POST',
        header:{
          Authorization: `Bearer ${uni.getStorageSync('token')}`
        },
        success: (res) => {
          if (!res.data.errors) {
            uni.showToast({
              title: '提现成功',
              icon: 'success'
            })

            this.$refs.withdrawalDialogRef.close()
            this.getTotalMoney()
          }
        },
        complete: () => {
          uni.hideLoading()
        }
      })
    },

    receiveRenderData() {
      plus.gallery.pick((path) => {
        plus.io.resolveLocalFileSystemURL(path, (entry) => {
          entry.file((file) => {
            let reader = new plus.io.FileReader();
            reader.onloadend = (e) => {
              let base64Data = e.target.result;
              this.base64String = base64Data
              uni.setStorageSync('base64String', this.base64String)
            };
            reader.readAsDataURL(file);
          }, (error) => {
            console.error("读取文件失败：" + error.message);
          });
        }, (error) => {
          console.error("获取图片资源失败：" + error.message);
        });
      }, (error) => {
        console.error("选择图片失败：" + error.message);
      });
    },

    setUsername() {
      this.$refs.usernameDialogRef.open()
    },

    usernameSubmit() {
      if (!this.usernameBak.trim()) {
        uni.showToast({
          title: '无效用户名',
          icon: 'error'
        })

        return
      }

      this.username = this.usernameBak
      uni.setStorageSync('username', this.usernameBak)
      this.$refs.usernameDialogRef.close()
    }
  },
}
</script>

<template>
  <view class="user-center">
    <view class="header">
      <view class="people" @click="receiveRenderData">
        <uniIcons v-if="!base64String" type="person" color="#536277" size="38" />
        <image v-else :src="base64String" />
      </view>

      <view class="username" @click="setUsername">{{ username || '默认用户名' }}</view>

      <view class="options">
        <view class="recode" @click="jumpUrl('/pages/receiveRecode/receiveRecode')">收益明细</view>
        <view class="money">
          <text>￥</text>
          <text>{{ totalMoney }}</text>
        </view>
      </view>
    </view>

    <uni-list>
      <uni-list-item show-arrow title="收益提现" @click.native="showWithdrawalDialog"></uni-list-item>
      <uni-list-item show-arrow title="我的客服"></uni-list-item>
    </uni-list>

    <uni-popup ref="withdrawalDialogRef" background-color="#ffffff" border-radius="5px 5px 5px 5px">
      <view class="withdrawal-dialog">
        <view class="title">提现</view>
        <input type="number" v-model="withdrawalMoney" placeholder="请输入提现金额">
        <view class="btn">
          <button @click="$refs.withdrawalDialogRef.close()">
            取消
          </button>

          <button type="primary" @click="withdrawal">
            确定
          </button>
        </view>
      </view>
    </uni-popup>

    <uni-popup ref="usernameDialogRef" background-color="#ffffff" border-radius="5px 5px 5px 5px">
      <view class="username-dialog">
        <view class="title">设置用户名</view>
        <input type="text" v-model="usernameBak" placeholder="请输入用户名">
        <view class="btn">
          <button @click="$refs.usernameDialogRef.close()">
            取消
          </button>

          <button type="primary" @click="usernameSubmit">
            确定
          </button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<style lang="scss">
page {
  background: #f3f2f2;
}

.user-center {
  padding: 120rpx 20rpx 40rpx;

  .header {
    margin-bottom: 40rpx;
    background: linear-gradient(to right, #539ff6, #007aff);
    padding: 40rpx;
    display: flex;
    align-items: center;
    // justify-content: space-between;
    border-radius: 16rpx;

    .people {
      color: #ffffff;
      background: #ffffff;
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .username {
      flex-grow: 1;
      padding: 0 20rpx 0 40rpx;
      color: #ffffff;
    }

    .options {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20rpx;

      .recode {
        background: #ffffff;
        padding: 10rpx 20rpx;
        font-size: 30rpx;
        color: #007aff;
        border-radius: 28rpx;
      }

      .money {
        text {
          color: #ffffff;
          line-height: 1;

          &:nth-child(1) {
            font-size: 20rpx;
          }

          &:nth-child(2) {
            font-size: 42rpx;
          }
        }
      }
    }
  }

  .withdrawal-dialog, .username-dialog {
    width: 550rpx;
    padding: 40rpx 50rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .title {
      font-size: 40rpx;
      font-weight: bold;
      margin-bottom: 40rpx;
    }

    input {
      height: 86rpx;
      margin-bottom: 40rpx;
      width: 100%;
      border: 1px solid #cccccc;
      border-radius: 16rpx;
      padding: 0 30rpx;
      font-size: 36rpx;
    }

    .btn {
      align-self: stretch;
      display: flex;
      align-items: center;
      justify-content: space-around;

      button {
        width: 180rpx;
        height: 70rpx;
        line-height: 70rpx;
        font-size: 30rpx;
      }
    }
  }
}
</style>
