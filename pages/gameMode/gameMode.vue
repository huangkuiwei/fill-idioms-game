<template>
  <view class="game-mode-page">
    <view class="select">
      <view>请选择游戏模式</view>
      <button type="primary" @click="jumpUrl('/pages/idioms/idioms')">成语填空</button>
      <button type="primary" @click="jumpUrl('/pages/sentence/sentence')">句子填空</button>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    jumpUrl(url) {
      uni.navigateTo({
        url: url
      })
    },
  },
};
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.game-mode-page {
  height: 100%;
  overflow: hidden;
  background: url('/static/images/bg2.jpg') top left/100% 100% no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .select {
    display: flex;
    flex-direction: column;
    gap: 50rpx;

    view {
      font-size: 46rpx;
      font-weight: bold;
      text-align: center;
      color: #333333;
    }

    button {
      width: 400rpx;
    }
  }
}
</style>
