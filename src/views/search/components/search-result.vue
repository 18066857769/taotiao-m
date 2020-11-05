<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      @load="onLoad"
    >
     <van-cell
          v-for="(item, index) in suggestions"
          :key="index"
          @click="$emit('search', item)"
          icon="search">
    <span slot="title" v-html="highlight(item)"></span>
</van-cell>
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '../../../api/serach'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perpage: 20,
      error: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      try {
        //  请求获取数据
        const { data } = await getSearchResult({
          page: this.page, // 页码
          per_page: this.per_page, // 每页大小
          q: this.searchText // 搜索关键字
        })
        console.log(data)
        //  将数据添加到数组列表中
        const { results } = data.data
        this.list.push(...results)
        // 将本次加载中的loading关闭
        this.loading = false
        //  判断是否还有数据
        if (results.leng) {
        //  如果有，则更新获取下一个数据的页码
          this.page++ // 更新获取下一页的数据页码
        } else {
          this.finished = true
        }
      } catch (err) {
        //  如果没有，则将加载状态finished设置为结束
        this.$toast('数据获取失败,请稍后重试')
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.search {
    padding-top: 106px;
    .van-search {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1;
    }
    .van-search__action {
        color: #fff;
    }
}
</style>
