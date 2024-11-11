<script>
import { mapState } from 'vuex';
import uniListItem from '../../uni_modules/uni-list/components/uni-list-item/uni-list-item.vue'
import uniList from '../../uni_modules/uni-list/components/uni-list/uni-list.vue'
import uniIcons from '../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue'

export default {
  name: 'receiveRecode',
  components: { uniIcons, uniList, uniListItem },

  data() {
    return {
      totalMoney: 0,
      recodeList: [],
    }
  },

  computed: {
    ...mapState('app', ['deviceUuid']),
  },

  onShow() {
    this.getRecode()
    this.getTotalMoney()
  },

  methods: {
    getRecode() {
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

    withdrawal() {
      if (Number(this.totalMoney) < 1) {
        uni.showToast({
          title: '余额不足1',
          icon: 'error'
        })

        return
      }

      uni.showModal({
        title: '温馨提示',
        content: '确定要全部提现吗？',
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
                  this.getRecode()
                }
              }
            })
          }
        }
      })
    }
  }
}
</script>

<template>
  <view class="receive-recode">
    <view class="header">
      <view class="top">
        <view class="left">
          <text>我的余额</text>
          <text>￥{{ totalMoney }}</text>
        </view>

        <view class="right" @click="withdrawal">全部提现</view>
      </view>

      <view class="bottom">(提现手续费0%，单次提现范围为1~500)</view>
    </view>

    <uni-list class="recode-list">
      <uni-list-item
          v-for="(item, index) of recodeList"
          :key="index"
          :title="item.note"
          :note="item.dateTime"
          :rightText="item.price > 0 ? `+${item.price}` : item.price"
      />
    </uni-list>
  </view>
</template>

<style lang="scss">
.receive-recode {
  padding: 120rpx 20rpx 40rpx;

  .header {
    margin-bottom: 40rpx;
    background: linear-gradient(to right, #539ff6, #007aff);
    padding: 40rpx;
    border-radius: 16rpx;
    color: #ffffff;

    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30rpx;

      .left {
        display: flex;
        flex-direction: column;
        gap: 20rpx;

        text {
          line-height: 1;

          &:nth-child(1) {
            font-size: 24rpx;
          }

          &:nth-child(2) {
            font-size: 46rpx;
          }
        }
      }

      .right {
        background: #ffffff;
        padding: 10rpx 20rpx;
        font-size: 30rpx;
        color: #007aff;
        border-radius: 28rpx;
      }
    }

    .bottom {
      font-size: 24rpx;
      text-align: center;
    }
  }

  .recode-list {
    /deep/ .uni-list-item__extra-text {
      color: #007aff;
    }
  }
}
</style>
