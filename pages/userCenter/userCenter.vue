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
      base64String: ''
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

    if (base64String) {
      this.base64String = base64String
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
      uni.request({
        url: `http://110.40.131.58:5000/api/app-bind-pwd/myhomeprice/${this.deviceUuid}`,
        method: 'POST',
        header:{
          Authorization: `Bearer ${uni.getStorageSync('token')}`
        },
        success: (response) => {
          this.totalMoney = response.data.data
        }
      })
    },

    withdrawal() {
      if (!Number(this.totalMoney)) {
        uni.showToast({
          title: '余额不足',
          icon: 'error'
        })

        return
      }

      uni.showModal({
        title: '温馨提示',
        content: '确定要进行提现吗？',
        success: (data) => {
          if (!data.cancel) {
            uni.showLoading({
              title: '请稍等...'
            })

            uni.request({
              url: `http://110.40.131.58:5000/api/app-bind-pwd/addwithdrawrecords/${this.deviceUuid}/${this.totalMoney}/1`,
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

                  this.getTotalMoney()
                }
              }
            })
          }
        }
      })
    },

    selectError() {
      uni.showToast({
        title:'请选择图片文件',
        icon:'error'
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
  }
}
</script>

<template>
  <view class="user-center">
    <view class="header">
      <view class="people" @click="receiveRenderData">
        <uniIcons v-if="!base64String" type="person" color="#536277" size="38" />
        <image v-else :src="base64String" />
      </view>

      <view class="options">
        <view class="recode" @click="jumpUrl('/pages/receiveRecode/receiveRecode')">收益明细</view>
        <view class="money">
          <text>￥</text>
          <text>{{ totalMoney }}</text>
        </view>
      </view>
    </view>

    <uni-list>
      <uni-list-item show-arrow title="余额提现" @click.native="withdrawal"></uni-list-item>
      <uni-list-item show-arrow title="我的客服"></uni-list-item>
    </uni-list>
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
    justify-content: space-between;
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
}
</style>
