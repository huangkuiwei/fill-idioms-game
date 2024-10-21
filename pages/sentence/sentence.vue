<template>
  <view class="sentence-page">
    <view class="container">
      <template v-if="success">
        <view class="success-tip">通关成功！</view>
      </template>

      <template v-else-if="noQuestionBank">
        <view class="no-word-tip">请先导入题库</view>
      </template>

      <template v-else>
        <view class="title">录入文本</view>
        <view class="sub-title">第{{ level }}关</view>
        <view class="words" v-if="splitCurrentWords.length">
          <view
              class="item"
              v-for="(item, index) of splitCurrentWords"
              :key="item.id"
          >
            <text :class="{ success: inputWord[index] && item.value === inputWord[index], error: inputWord[index] && item.value !== inputWord[index] }">
              {{ item.value }}
            </text>
          </view>
        </view>

        <view class="write-box">
          <textarea name="" id="" rows="8" v-model="inputWord"></textarea>
        </view>

        <view class="btn">
          <button type="primary" @click="submit">提交</button>
        </view>
      </template>
    </view>

    <view class="hongbao-icon">
      <image mode="widthFix" src="/static/images/hongbao-icon.png" @click="$refs.hongbaoRef.open()" />
    </view>

    <view class="block1" @click="jumpUrl('/pages/idioms1/idioms1')" @longtap="jumpUrl('/pages/data/data')"></view>
    <view class="block2" @click="jumpUrl('/pages/idioms2/idioms2')" @longtap="jumpUrl('/pages/data/data')"></view>
    <view class="block3" @longtap="jumpUrl('/pages/sentenceData/sentenceData')"></view>

    <uni-popup ref="successDialogRef" background-color="#ffffff" border-radius="5px 5px 5px 5px">
      <view class="success-dialog">
        <view class="title">恭喜回答正确!</view>
        <image class="success-icon" mode="widthFix" src="/static/images/success-icon.png"/>
        <view class="money">
          增加可提现 <text>{{ money }}</text> 元
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
          当前红包余额：<text>{{ totalMoney.toFixed(2) }}元</text>
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
      currentWord: '',
      inputWord: '',
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
    ...mapState('app', ['wordsList1']),
  },

  onShow() {
    if (this.wordsList1.length) {
      this.noQuestionBank = false;
      this.getCurrentWord();
    } else {
      this.noQuestionBank = true;
    }
  },

  methods: {
    getCurrentWord() {
      let noRecodeList = this.wordsList1.filter((item) => !item.hasRecode);

      if (noRecodeList.length) {
        let index = Math.floor(Math.random() * noRecodeList.length);
        this.currentWord = noRecodeList[index].word;

        this.splitCurrentWords = [];

        for (let i = 0; i < this.currentWord.length; i++) {
          this.splitCurrentWords.push({
            value: this.currentWord[i],
            id: Math.random().toString(),
          });
        }
      } else {
        this.success = true;
      }
    },

    submit() {
      if (this.currentWord !== this.inputWord) {
        this.$refs.errorDialogRef.open()
        return
      }

      this.inputWord = ''
      this.money = Number(Math.random().toFixed(2));
      this.totalMoney = this.totalMoney + this.money;
      this.wordsList1.find(item => item.word === this.currentWord).hasRecode = true;
      this.$refs.successDialogRef.open()
      this.getCurrentWord()
    },

    jumpUrl(url) {
      uni.navigateTo({
        url: url
      })
    }
  },
};
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;

  .sentence-page {
    height: 100%;
    overflow: hidden;
    background: url('/static/images/bg.png') top left/100% 100% no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .container {
      width: 650rpx;
      background: #ffffff;
      border-radius: 32rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40rpx 30rpx;

      .title,
      .success-tip,
      .no-word-tip {
        font-size: 46rpx;
        font-weight: bold;
      }

      .sub-title {
        padding: 20rpx 0;
      }

      .words {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10rpx;
        margin-bottom: 40rpx;

        .item {
          text {
            width: 50rpx;
            height: 50rpx;
            border-radius: 8rpx;
            padding: 10rpx;
            background: #eee;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333333;

            &.success {
              background: #59A13650;
              color: #59A136;
            }

            &.error {
              background: #d74a4a60;
              color: #d74a4a;
            }
          }
        }
      }

      .write-box {
        width: 100%;
        border-radius: 8rpx;
        border: 1px solid #cccccc;
        margin-bottom: 40rpx;

        textarea {
          padding: 20rpx;
          font-size: 32rpx;
        }
      }

      .btn {

      }
    }

    .hongbao-icon {
      position: absolute;
      right: 10rpx;
      top: 20%;

      image {
        width: 64rpx;
      }
    }

    .block1 {
      position: absolute;
      width: 100rpx;
      height: 100rpx;
      // background: red;
      left: 0;
      top: 0;
    }

    .block2 {
      position: absolute;
      width: 100rpx;
      height: 100rpx;
      // background: red;
      right: 0;
      top: 0;
    }

    .block3 {
      position: absolute;
      width: 100rpx;
      height: 100rpx;
      // background: red;
      left: 0;
      bottom: 0;
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
