<script>
import {mapMutations} from 'vuex'

export default {
  methods: {
    ...mapMutations('app', ['_setWordsList', '_setWordsList1'])
  },

  onLaunch: function() {
    let wordsList = uni.getStorageSync('wordsList')
    let wordsList1 = uni.getStorageSync('wordsList1')

    if (wordsList) {
      this._setWordsList(wordsList)
    }

    if (wordsList1) {
      this._setWordsList1(wordsList1)
    }
  },
}
</script>

<style>
/*每个页面公共css */
@import '/common/styles/reset.scss';
@import '/common/styles/global.scss';
</style>
