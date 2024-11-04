<template>
  <view class="idioms-page">
    <view class="container">
      <template v-if="success">
        <view class="success-tip">通关成功！</view>
      </template>

      <template v-else-if="noQuestionBank">
        <view class="no-word-tip">请先录入成语</view>
      </template>

      <template v-else>
        <view class="title">成语填空</view>

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
        <view class="words" v-if="splitCurrentWords.length">
          <input
              v-for="item of splitCurrentWords"
              :key="item.id"
              v-model="item.value"
              :class="{ isWrite: item.isWrite }"
              :maxlength="1"
              :disabled="!item.isWrite"
              :focus="item.isWrite && focus"
              @input="onInputChange($event, item)"
          />
        </view>
        <view class="next" @click="next">下一关</view>
      </template>
    </view>

    <view class="hongbao-icon" @click="getTotalMoney">
      <image mode="widthFix" src="/static/images/hongbao-icon.png" @click="$refs.hongbaoRef.open()" />
    </view>

    <view class="user-icon" @click="jumpUrl('/pages/userCenter/userCenter')">
      <image mode="widthFix" src="/static/images/user-icon.png" />
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
        <view class="btn" style="margin-bottom: 30rpx" @click="resAnswer">
          重新回答
        </view>
        <view class="btn" @click="next(); focus = true">
          下一题
        </view>
      </view>
    </uni-popup>

    <uni-popup ref="hongbaoRef" background-color="#ffffff" border-radius="5px 5px 5px 5px">
      <view class="hongbao-dialog">
        <view class="title">
          当前红包余额：<text>{{ totalMoney }}</text>
        </view>

        <image class="hongbao-icon2" mode="widthFix" src="/static/images/hongbao-icon2.png"/>

        <view class="btn">
          <button size="mini" @click="$refs.hongbaoRef.close()">关闭</button>
          <!--<button type="primary" size="mini" @click="withdrawal">提现</button>-->
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
    ...mapState('app', ['wordsList', 'deviceUuid']),
  },

  onShow() {
    this.getTotalMoney()

    if (this.wordsList.length) {
      this.noQuestionBank = false;
      this.getCurrentWord();
    } else {
      this.noQuestionBank = true;
    }
  },

  methods: {
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

    getCurrentWord() {
      let noRecodeList = this.wordsList.filter((item) => !item.hasRecode);

      if (noRecodeList.length) {
        let index = Math.floor(Math.random() * noRecodeList.length);
        this.currentWord = noRecodeList[index].word;

        this.splitCurrentWords = [];

        let index1 = Math.floor(Math.random() * 4);
        for (let i = 0; i < this.currentWord.length; i++) {
          if (index1 === i) {
            this.splitCurrentWords.push({
              value: '',
              trueValue: this.currentWord[i],
              isWrite: true,
              id: Math.random().toString(),
            });
          } else {
            this.splitCurrentWords.push({
              value: this.currentWord[i],
              trueValue: this.currentWord[i],
              isWrite: false,
              id: Math.random().toString(),
            });
          }
        }
      } else {
        // this.success = true;
        // 重新玩
        this.wordsList.forEach(item => item.hasRecode = false)
        this.getCurrentWord()
      }
    },

    onInputChange(event, item) {
      setTimeout(() => {
        let newDate = Date.now()

        if (newDate - this.date < 500) {
          this.date = new Date()
          return
        }

        this.date = new Date()

        if (!/^[\u4e00-\u9fa5]+$/.test(event.detail.value)) {
          item.value = '';
          return;
        }

        if (!item.value) {
          return
        }

        this.focus = false

        if (event.detail.value === item.trueValue) {
          setTimeout(() => {
            let money = 0.9 + (Math.random())

            while (money <= 0.9 || money >= 1.5) {
              money = 0.9 + (Math.random())
            }

            this.money = Number(money.toFixed(2))
            this.$refs.successDialogRef.open();
            this.level += 1;
            this.wordsList.find(item => item.word === this.currentWord).hasRecode = true;
            this.getCurrentWord();

            uni.request({
              url: `http://110.40.131.58:5000/api/app-bind-pwd/addwithdrawrecords/${this.deviceUuid}/${this.money}/2`,
              method: 'POST',
              header:{
                Authorization: `Bearer ${uni.getStorageSync('token')}`
              },
            })
          }, 200);
        } else {
          setTimeout(() => {
            item.value = '';
            this.$refs.errorDialogRef.open();
          }, 200);
        }
      }, 10);
    },

    resAnswer() {
      this.$refs.errorDialogRef.close()
      this.focus = true
    },

    jumpUrl(url) {
      uni.navigateTo({
        url: url
      })
    },

    next() {
      this.$refs.errorDialogRef.close()
      this.level += 1;
      this.wordsList.find(item => item.word === this.currentWord).value = '';
      this.wordsList.find(item => item.word === this.currentWord).hasRecode = true;
      this.getCurrentWord();
    },
  },
};
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.idioms-page {
  height: 100%;
  overflow: hidden;
  background: url('/static/images/bg2.png') top left/100% 100% no-repeat;
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
        margin-top: -350rpx;
        margin-bottom: 60rpx;
        color: #ffffff;
        font-size: 70rpx;
      }
    }

    .llq-icon {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;

      view {
        width: 140rpx;
        height: 140rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 20rpx;

        image {
          width: 100%;
        }
      }
    }

    .input-box {
      margin-bottom: 80rpx;
      width: 600rpx;
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
        top: 15rpx;
        right: 10rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        image {
          width: 100rpx;
        }
      }
    }

    .sub-title {
      margin-bottom: 40rpx;
    }

    .words {
      display: flex;
      align-items: center;
      gap: 40rpx;
      margin-bottom: 40rpx;

      input {
        width: 100rpx;
        height: 100rpx;
        font-size: 36rpx;
        padding: 0 10rpx;
        text-align: center;
        background: #ffffff;
        border-radius: 24rpx;
        border: 2px solid #00a099;
        color: #005456;

        &.isWrite {
          border: 2px solid #ff8769;
        }
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

  .user-icon {
    position: absolute;
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
    padding: 20rpx 0;
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
