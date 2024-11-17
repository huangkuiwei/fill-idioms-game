<script>
import { mapState } from 'vuex';

export default {
  name: 'adv',

  data() {
    return {
      advList: [],
      currentAdv: {}
    }
  },

  onLoad() {
    this.advList = []

    new Array(60).fill(undefined).forEach((item, index) => {
      let moneyData = uni.getStorageSync('moneyData')[3]
      let money = Number(moneyData.minMoney) + Math.random() * (moneyData.maxMoney - moneyData.minMoney)

      this.advList.push( { name: index + 1, videoSrc: `/static/videos/${Math.ceil(Math.random() * 60)}.mp4`, money: money.toFixed(2) },)
    })
  },

  computed: {
    ...mapState('app', ['deviceUuid']),
  },

  methods: {
    jumpUrl(url) {
      uni.navigateTo({
        url: url
      })
    },

    lookAdv(item) {
      this.currentAdv = item
      this.$refs.advDialog.open()
    },

    playEnded() {
      this.$refs.advDialog.close()

      setTimeout(() => {
        this.$refs.successDialog.open()
      }, 500)

      uni.request({
        url: `http://110.40.131.58:5000/api/app-bind-pwd/addwithdrawrecords/${this.deviceUuid}/${this.currentAdv.money}/3`,
        method: 'POST',
        header:{
          Authorization: `Bearer ${uni.getStorageSync('token')}`
        },
      })
    }
  }
}
</script>

<template>
  <view class="adv-page">
    <view class="tabs">
      <view class="tab">热点</view>
      <view class="tab">生活</view>
      <view class="tab">商城</view>
      <view class="tab">推荐</view>
      <view class="tab">朋友</view>
      <view class="tab">视频</view>
    </view>

    <view class="adv-list">
      <view class="adv-item" v-for="item of advList" :key="item.name"  @click="lookAdv(item)">
        <view class="poster">
          <image mode="widthFix" src="/static/images/video-icon.png"/>
        </view>

        <view class="tip">
          <text>看视频自动获得</text>
        </view>

        <view class="money">
          +{{item.money}}
        </view>
      </view>
    </view>

    <uni-popup
        ref="advDialog"
        :is-mask-click="false"
    >
      <view class="adv-dialog">
        <video
            :controls="false"
            autoplay
            object-fit="contain"
            :src="currentAdv.videoSrc"
            @ended="playEnded"
        >
        </video>

        <view class="btn">
          <text>点击查看详情</text>
        </view>
      </view>
    </uni-popup>

    <uni-popup
        ref="successDialog"
        background-color="#ffffff"
        border-radius="20px 20px 20px 20px"
    >
      <view class="success-dialog">
        <view class="tip">观看成功，增加{{currentAdv.money}}</view>
        <view class="btn">
          <text @click="$refs.successDialog.close()">知道了</text>
        </view>
      </view>
    </uni-popup>

    <view class="user-icon" @click="jumpUrl('/pages/userCenter/userCenter')">
      <image mode="widthFix" src="/static/images/user-icon.png" />
    </view>
  </view>
</template>

<style lang="scss">
page {
  background: #f5f5f5;
  padding: 100rpx 0 0;
  height: 100%;
  overflow: hidden;
}

.adv-page {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .tabs {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 40rpx;
    padding: 0 60rpx 20rpx;
    margin-bottom: 40rpx;
    border-bottom: 1px solid #cccccc;
    overflow: auto;

    &::-webkit-scrollbar {
      display: none;
    }

    .tab {
      flex-shrink: 0;
      font-size: 34rpx;

      &:nth-child(6) {
        position: relative;

        &:after {
          content: '';
          position: absolute;
          bottom: -20rpx;
          left: -20rpx;
          width: 100rpx;
          height: 4rpx;
          background: #007aff;
          border-radius: 4rpx;
        }
      }
    }
  }

  .adv-list {
    flex-grow: 1;
    overflow: auto;
    padding: 0 30rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .adv-item {
      width: 48%;
      background: #ffffff;
      padding: 20rpx 20rpx;
      border-radius: 16rpx;
      display: flex;
      flex-direction: column;
      margin-bottom: 40rpx;
      position: relative;

      .poster {
        width: 100%;
        height: 200rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        image {
          width: 120rpx;
          height: 120rpx;
        }
      }

      .tip {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10rpx;
        margin-right: 10rpx;

        text {
          &:nth-child(1) {
            font-size: 22rpx;
          }
        }
      }

      .money {
        position: absolute;
        right: 20rpx;
        top: 20rpx;
        color: #007aff;
      }
    }
  }

  .adv-dialog {
    width: 550rpx;
    height: 400rpx;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 12rpx;

    video {
      width: 460rpx;
      height: 260rpx;
    }

    .btn {
      margin-top: 50rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0 30rpx;

      text {
        padding: 8rpx 100rpx;
        font-size: 26rpx;
        color: #ffffff;
        background: #007aff;
        border-radius: 30rpx;
      }
    }
  }

  .success-dialog {
    width: 550rpx;
    padding: 40rpx;

    .tip {
      font-size: 30rpx;
      margin-bottom: 40rpx;
    }

    .btn {
      text-align: right;
      color: #007aff;
    }
  }

  .user-icon {
    position: fixed;
    right: 10rpx;
    bottom: 10%;
    width: 100rpx;
    height: 100rpx;
    background: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    image {
      width: 50rpx;
    }
  }
}
</style>