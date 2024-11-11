<script>
import { mapState } from 'vuex';

export default {
  name: 'adv',

  data() {
    return {
      advList: [
        { name: '01', videoSrc: '/static/videos/01.mp4', money: 2.5 },
        { name: '02', videoSrc: '/static/videos/02.mp4', money: 1.8 },
        { name: '03', videoSrc: '/static/videos/03.mp4', money: 2.7 },
        { name: '04', videoSrc: '/static/videos/04.mp4', money: 2.1 },
        { name: '05', videoSrc: '/static/videos/05.mp4', money: 1.4 },
        { name: '06', videoSrc: '/static/videos/06.mp4', money: 3.1 },
        { name: '07', videoSrc: '/static/videos/07.mp4', money: 1.5 },
        { name: '08', videoSrc: '/static/videos/08.mp4', money: 2.4 },
        { name: '09', videoSrc: '/static/videos/09.mp4', money: 2.9 },
        { name: '10', videoSrc: '/static/videos/10.mp4', money: 1.1 },
        { name: '11', videoSrc: '/static/videos/11.mp4', money: 1.5 },
        { name: '12', videoSrc: '/static/videos/12.mp4', money: 2.8 },
        { name: '13', videoSrc: '/static/videos/13.mp4', money: 1.8 },
        { name: '14', videoSrc: '/static/videos/14.mp4', money: 1.1 },
        { name: '15', videoSrc: '/static/videos/15.mp4', money: 2.9 },
        { name: '16', videoSrc: '/static/videos/16.mp4', money: 2.4 },
        { name: '17', videoSrc: '/static/videos/17.mp4', money: 2.1 },
        { name: '18', videoSrc: '/static/videos/18.mp4', money: 1.4 },
        { name: '19', videoSrc: '/static/videos/19.mp4', money: 1.9 },
        { name: '20', videoSrc: '/static/videos/20.mp4', money: 2.8 },
      ],
      currentAdv: {}
    }
  },

  computed: {
    ...mapState('app', ['deviceUuid']),
  },

  methods: {
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
          <text>看视频领现金红包&nbsp;{{item.name}}</text>
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
        <view class="tip">观看成功，增加{{currentAdv.money}}元</view>
        <view class="btn">
          <text @click="$refs.successDialog.close()">知道了</text>
        </view>
      </view>
    </uni-popup>
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
}
</style>