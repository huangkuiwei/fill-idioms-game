<template>
  <view class="data1-page">
    <!-- #ifdef APP-PLUS || H5 -->
    <view class="options">
      <button type="primary" @click="uploadFile1.onClick">上传文件</button>
      <button @click="clearData">清除数据</button>
    </view>
    <!-- #endif -->

    <view class="word-list">
      <view class="title">当前系统导入数据：{{ wordsList1.length ? '' : '(空)' }}</view>

      <view class="item" v-for="(item, index) of wordsList1" :key="index">
        <text>{{ index + 1 }}、{{ item.word }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  data() {
    return {

    }
  },

  computed: {
    ...mapState('app', ['wordsList1'])
  },

  methods: {
    ...mapMutations('app', ['_setWordsList1']),

    receiveRenderData(value) {
      let splitValues = value.split('|')

      let wordsList1 = []

      splitValues.forEach(item => {
        wordsList1.push({
          word: item,
          hasRecode: false,
        })
      })

      this._setWordsList1(wordsList1)
      uni.setStorageSync('wordsList1', wordsList1)
    },

    selectError() {
      uni.showToast({
        title:'请选择txt文件',
        icon:'error'
      })
    },

    clearData() {
      this._setWordsList1([])
    }
  }
}
</script>

<script module="uploadFile1" lang="renderjs">
export default {
  methods: {
    onClick(e, ownerVm) {
     const input = document.createElement('input')
     input.type = 'file'
     input.onchange = (event) => {
       let selectedFile = event.currentTarget.files[0]

       if (!selectedFile.name.endsWith('.txt')) {
          ownerVm.callMethod('selectError')
         return
       }

       let reader = new FileReader();
       reader.readAsText(selectedFile);

       reader.onload = (oFREvent) => {
       let pointsTxt = oFREvent.target.result;
         ownerVm.callMethod('receiveRenderData', pointsTxt)
       }
     }

     input.click()
    }
  }
}
</script>

<style lang="scss">
.data1-page {
  margin-top: 100rpx;

  .options {
    display: flex;
    align-items: center;

    button {
      width: 30%;
      gap: 20rpx;
    }
  }

  .word-list {
    margin-top: 60rpx;
    padding: 0 20rpx;

    .title {
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 40rpx;
    }

    .item {
      margin-bottom: 20rpx;
    }
  }
}
</style>
