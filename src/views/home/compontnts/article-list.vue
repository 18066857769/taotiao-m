<template>
  <div class="article-list">
     <van-pull-refresh v-model="isLoading" :success-text="refresjsuccessText"
     :success-duration="1500"
     @refresh="onRefresh">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
     <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        />
      <!-- <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      /> -->
    </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import articleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    'article-item': articleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 控制获取失败的状态
      isLoading: false, // 控制下拉书信
      refresjsuccessText: '刷新成功'
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 初始化或滚动到底部的时候会触发调用 onLoad
    async onLoad () {
      try {
        // 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道ID
          // 你可以把 timestamp 理解为页码
          // 如果请求第1页数据：当前最新时间戳 Date.now
          // 如果请求之后的数据，使用本次接口返回的数据中的 pre_timestamp
          timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        // 2. 把请求结果数据放到 list 数组中
        const { results } = data.data
        // 数组的展开操作符...
        this.list.push(...results)
        // 3. 本次数据加载结束之后要把加载状态设置为结束
        this.loading = false
        // 4. 判断数据是否全部加载完成
        if (results.length) {
        // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，不在load加载更多
          this.finished = true
        }
      } catch (err) {
        // 展示错误提示状态
        this.error = true
        // 请求失败了，loading需要关闭
        this.loading = false
        // console.log('请求失败')
      }
    },
    // 初始化或滚动到底部的时候会触发调用 onLoad
    // onLoad () {
    //   // 1. 请求获取数据
    //   // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    //   setTimeout(() => {
    //     // 2. 把请求结果数据放到 list 数组中
    //     for (let i = 0; i < 10; i++) {
    //       // 0 + 1 = 1
    //       // 1 + 1 = 2
    //       // 2 + 1 = 3
    //       this.list.push(this.list.length + 1)
    //     }

    //     // 3. 本次数据加载结束之后要把加载状态设置为结束
    //     //     loading 关闭以后才能触发下一次的加载更多
    //     this.loading = false

    //     // 4. 判断数据是否全部加载完成
    //     if (this.list.length >= 40) {
    //       // 如果没有数据了，把 finished 设置为 true，之后不再触发加载更多
    //       this.finished = true
    //     }
    //   }, 1000)
    // }
    async  onRefresh () {
      // 请求获取数据
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(),
          with_top: 1
        })
        // 2.将数据追加到列表的顶部
        const { results } = data.data
        this.list.unshift(...results)
        // 3.关闭下拉刷新的loading=false
        this.isLoading = false
        // 更新下拉刷新成功
        this.refresjsuccessText = `刷新成功,更新了${results.length
            }调数据`
      } catch (err) {
        this.refresjsuccessText = '刷新失败'
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list{
  height: 79vh;
  overflow-y: auto;
}
  </style>
