<template>
    <div>
    <van-nav-bar title="首页" fixed="" />
        <van-tabs class="channel-tabs" v-model="activeChannelIndex">
          <van-tab
           v-for="channelItem in channels"
           :key="channelItem.id"
           :title="channelItem.name"
           >
            <!--
              下拉刷新
              isLoading 用来控制下拉刷新的 loading 状态
              下拉刷新的时候，它会自动将 loading 设置为 true
              @refresh 当下拉刷新的时候触发
            -->
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh"></van-pull-refresh>

            <!--
              列表组件：主要是提供上拉加载更多的功能
              loading 用来控制加载中loading的状态
              finished 用来控制是否加载完毕
              @load 加载更多的时候触发的一个事件，他会自动调用一个onload函数拿数据，以填充页面
                  它每次调用 onload 会自动将 loading 设置为 true
                  我们需要在 onload 中拿到本次加载的数据以后，将 loading 设置为 false
            -->
                <van-list
                v-model="channelItem.upPullLoading"
                :finished="channelItem.upPullFinished"
                finished-text="没有更多了"
                @load="onLoad"
              >
                <van-cell
                  v-for="articleItem in channelItem.articles"
                  :key="articleItem.art_id"
                  :title="articleItem.title"
                />
              </van-list>
          </van-tab>
          </van-tabs>

    </div>
</template>

<script>
import { getUserChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
export default {
  name: 'HomeIndex',
  data () {
    return {
      activeChannelIndex: 0,
      list: [],
      loading: false,
      finished: false,
      isLoading: false,
      channels: [] // 存储频道列表
    }
  },

  computed: {
    /**
     * 当前激活的频道
     */
    activeChannel () {
      return this.channels[this.activeChannelIndex]
    }
  },

  created () {
    this.localChannels()
  },
  methods: {
    async localChannels () {
      const { user } = this.$store.state
      let channels = []

      // 已登录
      if (user) {
        const data = await getUserChannels()
        channels = data.channels
      } else {
      // 未登录

        // 如果有本地存储数据，则使用本地存储中的频道列表
        const localChannels = JSON.parse(window.localStorage.getItem('channels'))
        if (localChannels) {
          channels = localChannels
        } else {
          // 如果没有本地存储频道数据则请求获取默认推荐频道列表
          const data = await getUserChannels()
          channels = data.channels
        }
      }
      // 修改 channels， 将这个数据结构修改为满足我们使用的需求
      channels.forEach(item => {
        item.articles = [] // 用来存储当前文章的列表
        item.timestamp = Date.now() // 存储下一页数据的时间戳
        item.downPullLoading = false // 控制当前频道的下拉刷新 loading 状态
        item.upPullLoading = false // 控制当前频道的上拉加载更多的 loading 状态
        item.upPullFinished = false // 控制当前频道数据是否加载完毕
      })

      this.channels = channels
    },
    /**
       * 上拉加载更多， push数据
       */
    async onLoad () {
      await this.$sleep(800)
      console.log('onLoad')
      let data = []
      data = await this.loadArticles()

      // 如果没有 pre_timestamp 并且数组是空的，则意味着没有数据了
      if (!data.pre_timestamp && !data.results.length) {
        // 设置频道数据已加载完毕，组件会自动给出提示，并且不再 onLoad
        this.channels.upPullFinished = true
        // 取消loading
        this.channels.upPullLoading = true
        return
        // 代码不再往后执行
      }

      // pre_timestamp 下一页的页码
      //  results 文章列表
      // console.log(data)

      // 解决初始化的时候没有最新推荐的问题（没有最新数据,那就加载上一次推荐数据）
      if (data.pre_timestamp && !data.results.length) {
        this.activeChannel.timestamp = data.pre_timestamp

        // 加载下一页数据
        data = await this.loadArticles()
      }

      // 数据记载好以后，将 pre_timestamp 更新到当前频道的中用于加载下下页数据
      this.activeChannel.timestamp = data.pre_timestamp

      // 将文章数据更新到频道中
      this.activeChannel.articles.push(...data.results)

      // 数据加载完毕，取消上拉 loading
      this.activeChannel.upPullLoading = false

      // 异步更新数据
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1);
      //   }
      //   // 加载状态结束
      //   this.loading = false;

      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     this.finished = true;
      //   }
      // }, 1000)
    },

    /**
    * 下拉刷新， 如果有新数据， 则重置列表数据
    */
    onRefresh () {

    },

    async loadArticles () {
      const { id: channelId, timestamp } = this.activeChannel
      const data = await getArticles({
        channelId, // 当前激活频道id
        timestamp, // 用于请求分页的时间戳
        withTop: 1 // 是否包含置顶数据
      })
      return data
    }
  }
}
</script>

<style lang="less">
.channel-tabs{
  margin-bottom: 100px;
  .van-hairline--top-bottom {
    position: fixed;
    top: 92px;
  }
  .van-tabs__content{
    margin-top: 100px;
  }
}
</style>
