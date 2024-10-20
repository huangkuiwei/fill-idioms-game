<template>
	<view class="data-page">
    <!-- #ifdef APP-PLUS || H5 -->
    <button type="primary" @click="uploadFile.onClick">上传文件</button>
    <!-- #endif -->

    <view class="word-list">
      <view class="title">当前系统导入数据：{{ !wordsList.length && '(空)' }}</view>

      <view class="item" v-for="(item, index) of wordsList" :key="index">
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
      ...mapState('app', ['wordsList'])
    },

		methods: {
      ...mapMutations('app', ['_setWordsList']),

      receiveRenderData(value) {
        let splitValues = value.split('|').filter(item => item.length === 4)

        let wordsList = []

        splitValues.forEach(item => {
          wordsList.push({
            word: item,
            hasRecode: false,
          })
        })

        this._setWordsList(wordsList)
      },

      selectError() {
        uni.showToast({
        	title:'请选择txt文件',
			    icon:'error'
        })
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
.data-page {
	margin-top: 100rpx;

  .word-list {
    margin-top: 20rpx;
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
