<template>
<div class="search-suggestion">
<van-cell
          v-for="(text, index) in suggestions"
          :key="index"
          @click="$emit('search', text)"
          icon="search">
    <span slot="title" v-html="highlight(text)"></span>
</van-cell>
  </div>

</template>

<script>
import { getSearchSuggestion } from '@/api/serach'
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: []
    }
  },
  computed: {},
  watch: {
    searchText: {
      // handler (value) {
      //   // 当searchText发生变化的时候就会调用handler函数
      //   // handler函数名称是固定的
      //   this.loadSearchSuggestions(value)
      //   console.log(value)
      // }
      // debounce 函数
      // 参数1：一个函数
      // 参数2 ：延迟时间，单位是毫秒
      // 返回值：防抖之后的函数
      handler: debounce(function (value) {
        console.log(value)
        this.loadSearchSuggestion(value)
      }, 200),
      immmediate: true // 调用函数侦听之后会被立即执行
    }
  },
  created () {},
  mounted () {},
  methods: {
    async loadSearchSuggestion (q) {
      try {
        const { data } = await getSearchSuggestion(q)
        // console.log(data)
        this.suggestions = data.data.options
        // console.log(this.suggestions)
      } catch {
        this.$toast('获取失败')
      }
    },
    highlight (text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      // 正则表达式 // 中间的内容都会当作匹配字符来使用，而不是数据变量
      // 如果需要根据数据变量动态的创建正则表达式，则手动 new RegExp
      // RegExp 正则表达式构造函数
      // 参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      // 参数2：匹配模式，要写到字符串中
      const reg = new RegExp(this.searchText, 'gi')
      // text.replace(/匹配的内容/gi, highlightStr)
      // console.log(text.replace(reg, highlightStr))
      return text.replace(reg, highlightStr)
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
 /deep/.active{
    color: #3296fa;
  }
}
</style>
