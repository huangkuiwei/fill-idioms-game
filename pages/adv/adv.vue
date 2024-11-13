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

    new Array(20).fill(undefined).forEach((item, index) => {
      this.advList.push( { name: index + 1, videoSrc: `/static/videos/${Math.ceil(Math.random() * 20)}.mp4`, money: (Math.random() * 2 + 1.5).toFixed(2) },)
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
    <view class="adv-list">
      <view class="adv-item" v-for="item of advList" :key="item.name">
        <image mode="widthFix" src="/static/images/douyin.png"/>

        <view class="tip">
          <text>看视频领现金红包</text>
          <text>观看精彩视频即可领取丰厚</text>
        </view>

        <view class="options">
          <text>+{{item.money}}</text>
          <text @click="lookAdv(item)">前往</text>
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
  background: #efefef;
  padding: 100rpx 0;
}

.adv-page {
  .adv-list {
    padding: 0 30rpx;
    display: flex;
    flex-direction: column;
    gap: 40rpx;

    .adv-item {
      background: #ffffff;
      padding: 20rpx 20rpx;
      border-radius: 16rpx;
      display: flex;
      align-items: center;

      image {
        width: 60rpx;
        margin-right: 20rpx;
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
            font-weight: bold;
            font-size: 32rpx;
          }

          &:nth-child(2) {
            font-size: 28rpx;
            color: #444444;
          }
        }
      }

      .options {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10rpx;

        text {
          &:nth-child(1) {
            color: #007aff;
          }

          &:nth-child(2) {
            background: #007aff;
            padding: 10rpx 26rpx;
            border-radius: 30rpx;
            color: #ffffff;
            font-size: 26rpx;
          }
        }
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