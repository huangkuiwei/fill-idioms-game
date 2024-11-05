<template>
  <view class="find-error-data">
    <view class="page-title">录入找错成语</view>

    <!-- #ifdef APP-PLUS || H5 -->
    <view class="options">
      <button type="primary" @click="uploadFile.onClick">上传文件</button>
      <button @click="clearData">清除数据</button>
    </view>
    <!-- #endif -->

    <view class="word-list">
      <view class="title">当前系统录入数据：{{ wordsList2.length ? '' : '(空)' }}</view>

      <view class="item" v-for="(item, index) of wordsList2" :key="index">
        <text>{{ index + 1 }}、{{ item.orgWord }}</text>
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
    ...mapState('app', ['wordsList2'])
  },

  methods: {
    ...mapMutations('app', ['_setWordsList2']),

    extractParenthesesContent(str) {
      // 定义正则表达式，匹配括号内的内容
      const regex = /\((.*?)\)/g;

      // 使用 matchAll 方法来获取所有匹配项
      const matches = [...str.matchAll(regex)];

      // 提取每个匹配项中的括号内容
      const results = matches.map(match => {
        return {
          word: match[1],
          index: match.index - 1
        }
      });

      return results;
    },

    removeParenthesesContent(str) {
      // 定义正则表达式，匹配括号及其内容
      const regex = /\(.*?\)/g;

      // 使用 replace 方法替换掉括号及其内容
      const result = str.replace(regex, '');

      return result.trim();  // 去除多余的空格
    },

    receiveRenderData(value) {
      let splitValues = value.split('|').map(item => item.replace(/[\r\n]/g,""))

      let wordsList2 = []

      splitValues.forEach(item => {
        wordsList2.push({
          orgWord: item,
          word: this.removeParenthesesContent(item),
          correctWord: this.extractParenthesesContent(item)[0].word,
          errorWordIndex: this.extractParenthesesContent(item)[0].index,
          hasRecode: false,
        })
      })

      this._setWordsList2(wordsList2)
      uni.setStorageSync('wordsList2', wordsList2)
    },

    selectError() {
      uni.showToast({
        title:'请选择txt文件',
        icon:'error'
      })
    },

    clearData() {
      this._setWordsList2([])
      uni.setStorageSync('wordsList2', [])
    }
  }
}
</script>

<script module="uploadFile" lang="renderjs">
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
.find-error-data {
  margin-top: 100rpx;

  .page-title {
    text-align: center;
    margin-bottom: 40rpx;
    font-size: 40rpx;
    font-weight: bold;
  }

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
      margin-bottom: 40rpx;
    }

    .item {
      margin-bottom: 20rpx;
    }
  }
}
</style>
