<template>
  <view class="find-error-page">
    <view class="container">
      <template v-if="success">
        <view class="success-tip">通关成功！</view>
      </template>

      <template v-else-if="noQuestionBank">
        <view class="no-word-tip">请先录入成语</view>
      </template>

      <template v-else>
        <view class="title">成语找错</view>

        <view class="llq-icon">
          <view>
            <image mode="widthFix" src="/static/images/llq-icon1.png" />
          </view>

          <view>
            <image mode="widthFix" src="/static/images/llq-icon2.png" />
          </view>

          <view>
            <image mode="widthFix" src="/static/images/llq-icon3.png" />
          </view>

          <view>
            <image mode="widthFix" src="/static/images/llq-icon4.png" />
          </view>
        </view>

        <view class="input-box">
          <input type="text" placeholder="粘贴网站至此处">

          <view class="search">
            <image mode="widthFix" src="/static/images/search.png" />
          </view>
        </view>

        <!--<view class="sub-title">第{{ level }}关</view>-->
        <view class="words" v-if="currentWord.word">
          <text
              v-for="(item, index) of currentWord.word"
              :key="item.id"
              @click="onClickWord(item, index)"
          >
            {{ item }}
          </text>
        </view>
        <view class="next" @click="next">下一关</view>
      </template>
    </view>

    <view class="hongbao-icon">
      <image mode="widthFix" src="/static/images/hongbao-icon.png" @click="$refs.hongbaoRef.open()" />
    </view>

    <uni-popup ref="successDialogRef" background-color="#ffffff" border-radius="5px 5px 5px 5px">
      <view class="success-dialog">
        <view class="title">恭喜回答正确!</view>
        <image class="success-icon" mode="widthFix" src="/static/images/success-icon.png"/>
        <view class="money">
          增加可提现 <text>{{ money }}</text>
        </view>
        <view class="btn" @click="$refs.successDialogRef.close(); focus = true">
          下一题
        </view>
      </view>
    </uni-popup>

    <uni-popup ref="errorDialogRef" background-color="#ffffff" border-radius="5px 5px 5px 5px">
      <view class="error-dialog">
        <view class="title">很遗憾,回答错误</view>
        <image class="success-icon" mode="widthFix" src="/static/images/error-icon.png"/>
        <view class="btn" @click="$refs.errorDialogRef.close(); focus = true">
          确定
        </view>
      </view>
    </uni-popup>

    <uni-popup ref="hongbaoRef" background-color="#ffffff" border-radius="5px 5px 5px 5px">
      <view class="hongbao-dialog">
        <view class="title">
          当前红包余额：<text>{{ totalMoney.toFixed(2) }}</text>
        </view>

        <image class="hongbao-icon2" mode="widthFix" src="/static/images/hongbao-icon2.png"/>

        <view class="btn">
          <button size="mini" @click="$refs.hongbaoRef.close()">取消</button>
          <button type="primary" size="mini" @click="withdrawal">提现</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      level: 1,
      currentWord: undefined,
      splitCurrentWords: [],
      noQuestionBank: false,
      success: false,
      money: 0,
      totalMoney: 0,
      focus: false,
      date: Date.now()
    };
  },

  computed: {
    ...mapState('app', ['wordsList2']),
  },

  onShow() {
    if (this.wordsList2.length) {
      this.noQuestionBank = false;
      this.getCurrentWord();
    } else {
      this.noQuestionBank = true;
    }
  },

  methods: {
    getCurrentWord() {
      let noRecodeList = this.wordsList2.filter((item) => !item.hasRecode);

      if (noRecodeList.length) {
        let index = Math.floor(Math.random() * noRecodeList.length);
        this.currentWord = noRecodeList[index];
      } else {
        // this.success = true;
        // 重新玩
        this.wordsList2.forEach(item => item.hasRecode = false)
        this.getCurrentWord()
      }
    },

    onClickWord(item, index) {
      if (index === this.currentWord.errorWordIndex) {
        let money = 0.9 + (Math.random())

        while (money <= 0.9 || money >= 1.5) {
          money = 0.9 + (Math.random())
        }

        this.money = Number(money.toFixed(2))

        this.totalMoney = this.totalMoney + this.money;
        this.$refs.successDialogRef.open();
        this.level += 1;
        this.wordsList2.find(item => item === this.currentWord).hasRecode = true;
        this.getCurrentWord();
      } else {
        this.$refs.errorDialogRef.open();
        this.level += 1;
        this.wordsList2.find(item => item === this.currentWord).hasRecode = true;
        this.getCurrentWord();
      }
    },

    jumpUrl(url) {
      uni.navigateTo({
        url: url
      })
    },

    next() {
      this.level += 1;
      this.wordsList2.find(item => item === this.currentWord).hasRecode = true;
      this.getCurrentWord();
    },

    withdrawal() {
      if (!Number(this.totalMoney)) {
        uni.showToast({
          title: '余额不足',
          icon: 'error'
        })

        return
      }

      uni.showLoading({
        title: '请稍等...'
      })

      setTimeout(() => {
        uni.hideLoading()

        setTimeout(() => {
          uni.showToast({
            title: '提现成功',
            icon: 'success'
          })

          this.totalMoney = 0
          this.$refs.hongbaoRef.close()
        })
      }, 1000)
    }
  },
};
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.find-error-page {
  height: 100%;
  overflow: hidden;
  background: url('/static/images/bg2.jpg') top left/100% 100% no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .container {
    width: 600rpx;
    border-radius: 32rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40rpx 0;

    .title,
    .success-tip,
    .no-word-tip {
      font-size: 46rpx;
      font-weight: bold;

      &.title {
        margin-top: -300rpx;
        margin-bottom: 40rpx;
        color: #ffffff;
        font-size: 50rpx;
      }
    }

    .llq-icon {
      display: flex;
      align-items: center;
      gap: 40rpx;
      margin-bottom: 40rpx;

      view {
        width: 90rpx;
        height: 90rpx;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 20rpx;

        image {
          width: 60rpx;
        }
      }
    }

    .input-box {
      margin-bottom: 40rpx;
      width: 550rpx;
      position: relative;

      input {
        background: #ffffff;
        border-radius: 16rpx;
        height: 90rpx;
        width: 100%;
        padding: 0 40rpx;
        font-size: 30rpx;
      }

      .search {
        position: absolute;
        width: 70rpx;
        height: 70rpx;
        background: #E6A23C;
        top: 10rpx;
        right: 10rpx;
        border-radius: 8rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        image {
          width: 50rpx;
          height: 50rpx;
        }
      }
    }

    .sub-title {
      margin-bottom: 40rpx;
    }

    .words {
      display: flex;
      align-items: center;
      gap: 20rpx;
      margin-bottom: 40rpx;

      text {
        width: 80rpx;
        height: 80rpx;
        line-height: 80rpx;
        font-size: 36rpx;
        padding: 0 10rpx;
        text-align: center;
        background: #ffffff;
        border-radius: 16rpx;
      }
    }

    .next {
      width: 60%;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      background: #007aff;
      border-radius: 8rpx;
      font-size: 32rpx;
    }
  }

  .hongbao-icon {
    position: absolute;
    right: 10rpx;
    top: 10%;

    image {
      width: 100rpx;
    }
  }
}

.success-dialog,
.error-dialog {
  width: 550rpx;
  padding: 40rpx 50rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .title {
    font-size: 40rpx;
    font-weight: bold;
    margin-bottom: 30rpx;
  }

  .success-icon {
    width: 35%;
    margin-bottom: 30rpx;
  }

  .money {
    margin-bottom: 30rpx;

    text {
      color: #dd524d;
    }
  }

  .btn {
    width: 100%;
    padding: 10rpx 0;
    text-align: center;
    color: #007aff;
    background: #007aff20;
    border-radius: 8rpx;
    font-size: 24rpx;
  }
}

.hongbao-dialog {
  width: 550rpx;
  padding: 40rpx 50rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .title {
    font-size: 40rpx;
    font-weight: bold;
    margin-bottom: 50rpx;

    text {
      color: #dd524d;
    }
  }

  .hongbao-icon2 {
    width: 50%;
    margin-bottom: 50rpx;
  }

  .btn {
    align-self: stretch;
    display: flex;
    align-items: center;
  }
}
</style>
