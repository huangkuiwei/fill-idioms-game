<script>
import {mapMutations} from 'vuex'

export default {
  methods: {
    ...mapMutations('app', ['_setWordsList', '_setWordsList1', '_setWordsList2'])
  },

  onLaunch: function() {
    let wordsList = uni.getStorageSync('wordsList')
    let wordsList1 = uni.getStorageSync('wordsList1')
    let wordsList2 = uni.getStorageSync('wordsList2')

    if (wordsList) {
      this._setWordsList(wordsList)
    }

    if (wordsList1) {
      this._setWordsList1(wordsList1)
    }

    if (wordsList2) {
      this._setWordsList2(wordsList2)
    }

    let moneyData = uni.getStorageSync('moneyData')

    if (!moneyData) {
      uni.setStorageSync('moneyData', [
        {
          minMoney: 0.9,
          maxMoney: 1.5
        },
        {
          minMoney: 0.9,
          maxMoney: 1.5
        },
        {
          minMoney: 1,
          maxMoney: 2
        },
        {
          minMoney: 0.8,
          maxMoney: 3.1
        }
      ])
    }
  },
}
</script>

<style>
/*每个页面公共css */
@import '/common/styles/reset.scss';
@import '/common/styles/global.scss';
</style>
