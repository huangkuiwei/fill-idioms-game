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
    let arr = new Array(60).fill(undefined).map((item, index) => index + 1)
    let newArr = this.shuffleArray(arr)

    newArr.forEach((item) => {
      let moneyData = uni.getStorageSync('moneyData')[3]
      let money = Number(moneyData.minMoney) + Math.random() * (moneyData.maxMoney - moneyData.minMoney)

      this.advList.push({
        name: item,
        videoSrc: `/static/videos/${item}.mp4`,
        coverSrc: `/static/images/cover/${item}.jpg`,
        money: money.toFixed(2) }
      )
    })
  },

  computed: {
    ...mapState('app', ['deviceUuid']),
  },

  methods: {
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        // 生成一个从0到i的随机索引
        const j = Math.floor(Math.random() * (i + 1));
        // 交换当前元素和随机索引对应的元素
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },

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
    <!--<view class="tabs">-->
    <!--  <view class="tab">热点</view>-->
    <!--  <view class="tab">生活</view>-->
    <!--  <view class="tab">商城</view>-->
    <!--  <view class="tab">推荐</view>-->
    <!--  <view class="tab">朋友</view>-->
    <!--  <view class="tab">视频</view>-->
    <!--</view>-->

    <view class="adv-list">
      <view class="adv-item" v-for="item of advList" :key="item.name"  @click="lookAdv(item)">
        <view class="poster">
          <image class="cover" mode="aspectFill" :src="item.coverSrc"/>

          <image class="play-icon" mode="widthFix" src="/static/images/play-circle.png"/>

          <view class="container">
            <view class="tip">
              <text>观看视频自动获得现金</text>
            </view>

            <view class="money">
              <view class="left">
                <image mode="widthFix" src="/static/images/money-icon.png"/>
                <text class="money">+{{item.money}}</text>
              </view>

              <text class="number">剩余10000+</text>
            </view>
          </view>
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
  background: #ffffff;
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
    justify-content: space-around;
    padding: 0 0 20rpx;
    margin-bottom: 40rpx;
    border-bottom: 1px solid #D0D3DE;
    overflow: auto;

    &::-webkit-scrollbar {
      display: none;
    }

    .tab {
      flex-shrink: 0;
      font-size: 32rpx;
      color: #000000;

      &:nth-child(6) {
        position: relative;
        color: #0062FF;

        &:after {
          content: '';
          position: absolute;
          bottom: -20rpx;
          left: -30rpx;
          width: 120rpx;
          height: 4rpx;
          background: #0062FF;
          border-radius: 4rpx;
        }
      }
    }
  }

  .adv-list {
    flex-grow: 1;
    overflow: auto;
    padding: 0 32rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .adv-item {
      width: 326rpx;
      background: #ffffff;
      border-radius: 6rpx;
      display: flex;
      flex-direction: column;
      margin-bottom: 40rpx;
      position: relative;

      .poster {
        width: 100%;
        height: 400rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        .cover {
          border-radius: 24rpx;
          width: 100%;
          height: 100%;
        }

        .play-icon {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 76rpx;
        }

        .container {
          position: absolute;
          left: 10rpx;
          right: 10rpx;
          bottom: 10rpx;

          .tip {
            margin-bottom: 10rpx;

            text {
              &:nth-child(1) {
                font-size: 24rpx;
                color: #ffffff;
              }
            }
          }

          .money {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .left {
              color: #ffffff;
              font-size: 28rpx;
              background: linear-gradient(to right, #FFD51C, #FF2F05);
              display: flex;
              align-items: center;
              border-radius: 20rpx;
              padding: 0 16rpx 0 8rpx;

              image {
                width: 40rpx;
              }
            }

            .number {
              color: #D9D9D9;
              font-size: 20rpx;
            }
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