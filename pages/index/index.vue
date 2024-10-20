<template>
  <view class="page-index">
    <view class="container">
      <template v-if="success">
        <view class="success-tip">通关成功！</view>
      </template>

      <template v-else-if="noQuestionBank">
        <view class="no-word-tip">请先导入题库</view>
      </template>

      <template v-else>
        <view class="title">成语填空</view>
        <view class="sub-title">第{{ level }}关</view>
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
      </template>
    </view>

    <view class="hongbao-icon">
      <image mode="widthFix" src="/static/images/hongbao-icon.png" @click="$refs.hongbaoRef.open()" />
    </view>

    <view class="block1" @click="jumpUrl('/pages/index/index')"></view>
    <view class="block2"></view>
    <view class="block3" @click="jumpUrl('/pages/data/data')"></view>
    <view class="block4"></view>

    <uni-popup ref="successDialogRef" background-color="#ffffff" border-radius="5px 5px 5px 5px">
      <view class="success-dialog">
        <view class="title">恭喜</view>
        <view class="sub-title">回答正确</view>
        <view class="money">
          增加可提现 <text>{{ money }}</text> 元
        </view>
        <view class="btn">
          <button type="primary" size="mini" @click="$refs.successDialogRef.close(); focus = true">确定</button>
        </view>
      </view>
    </uni-popup>

    <uni-popup ref="errorDialogRef" background-color="#ffffff" border-radius="5px 5px 5px 5px">
      <view class="error-dialog">
        <view class="title">很遗憾</view>
        <view class="sub-title" style="margin-bottom: 40rpx">回答错误</view>
        <view class="btn">
          <button type="primary" size="mini" @click="$refs.errorDialogRef.close(); focus = true">确定</button>
        </view>
      </view>
    </uni-popup>

    <uni-popup ref="hongbaoRef" background-color="#ffffff" border-radius="5px 5px 5px 5px">
      <view class="hongbao-dialog">
        <view class="title">
          当前红包余额：<text>{{ totalMoney.toFixed(2) }}元</text>
        </view>

        <view class="btn">
          <button size="mini" @click="$refs.hongbaoRef.close()">取消</button>
          <button type="primary" size="mini" @click="$refs.hongbaoRef.close()">提现</button>
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
	    focus: false
    };
  },

  computed: {
    ...mapState('app', ['wordsList']),
  },

  onShow() {
    if (this.wordsList.length) {
      this.noQuestionBank = false;
      this.getCurrentWord();
    } else {
      this.noQuestionBank = true;
    }
  },

  methods: {
    getCurrentWord() {
      let noRecodeList = this.wordsList.filter((item) => !item.hasRecode);

      if (noRecodeList.length) {
        let index = Math.floor(Math.random() * noRecodeList.length);
        noRecodeList[index].hasRecode = true;
        this.currentWord = noRecodeList[index].word;

        this.splitCurrentWords = [];

        let index1 = Math.floor(Math.random() * 3);
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
        this.success = true;
      }
    },

    onInputChange(event, item) {
      setTimeout(() => {
        if (!/^[\u4e00-\u9fa5]+$/.test(event.detail.value)) {
          item.value = '';
          return;
        }

		this.focus = false

        if (event.detail.value === item.trueValue) {
          setTimeout(() => {
            this.money = Number(Math.random().toFixed(2));
            this.totalMoney = this.totalMoney + this.money;
            this.$refs.successDialogRef.open();
            this.level += 1;
            this.getCurrentWord();
          }, 200);
        } else {
          setTimeout(() => {
            item.value = '';
            this.$refs.errorDialogRef.open();
          }, 200);
        }
      }, 10);
    },
	
	jumpUrl(url) {
		uni.navigateTo({
			url: '/pages/data/data'
		})
	}
  },
};
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;

  .page-index {
    height: 100%;
    overflow: hidden;
    background: url('/static/images/bg.png');
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .container {
      width: 600rpx;
      height: 300rpx;
      background: #ffffff;
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
      }

      .sub-title {
        padding: 20rpx 0;
      }

      .words {
        display: flex;
        align-items: center;
        gap: 20rpx;

        input {
          width: 80rpx;
          height: 80rpx;
          font-size: 36rpx;
          padding: 0 10rpx;
          text-align: center;

          &.isWrite {
            background: #dddddd;
            border-radius: 16rpx;
          }
        }
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
      background: red;
      left: 0;
      top: 0;
    }

    .block2 {
      position: absolute;
      width: 100rpx;
      height: 100rpx;
      background: red;
      right: 0;
      top: 0;
    }

    .block3 {
      position: absolute;
      width: 100rpx;
      height: 100rpx;
      background: red;
      left: 0;
      bottom: 0;
    }

    .block4 {
      position: absolute;
      width: 100rpx;
      height: 100rpx;
      background: red;
      right: 0;
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

  .sub-title {
    margin-bottom: 10rpx;
  }

  .money {
    margin-bottom: 40rpx;

    text {
      color: #dd524d;
    }
  }

  .btn {
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
    margin-bottom: 30rpx;

    text {
      color: #dd524d;
    }
  }

  .btn {
    align-self: stretch;
    display: flex;
    align-items: center;
  }
}
</style>
