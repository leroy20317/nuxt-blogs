<template>
  <div class="container">
    <nuxt-header v-if="refresh" :music="music" title="好好学习, 天天向上!" />

    <section class="content">
      <div v-if="!data.data || data.data.length <= 0">空无一物，就像你我一样。</div>
      <template v-else>
        <div v-for="(item, index) in data.data" :key="index" class="item">
          <div class="text" v-html="item.contentHtml"></div>
          <div class="time">{{ timeFormat(item.time) }}</div>
        </div>
        <load-more :loading-type="loadingType" />
      </template>
    </section>
  </div>
</template>

<script>
import Url from '~/utils/url';
import { dateFormat } from '~/utils/util';

export default {
  async asyncData(context) {
    const { data } = await context.$axios.get(Url.envelope);
    return { data: data.status === 'success' ? data.body : '' };
  },
  data() {
    return {
      music: 'https://image.raindays.cn/Myself-Resources/music/jingxin.mp3',
      refresh: true,
      loadingType: 'more'
    };
  },
  head() {
    return {
      title: `一封信 | ${this.info.web.name}`
    };
  },
  computed: {
    info() {
      return this.$store.state.data;
    }
  },
  mounted() {
    // 背景音乐
    if (this.info.bg_music.letter) {
      this.music = this.info.bg_music.letter;
      this.refresh = false;
      this.$nextTick(() => (this.refresh = true));
    }

    if (this.data.totalPage > 1) {
      window.addEventListener('scroll', this.load);
    }

    if (this.data.page === this.data.totalPage) {
      this.loadingType = 'nomore';
    }
  },
  destroyed() {
    this.$load('none');
    window.removeEventListener('scroll', this.load);
  },
  methods: {
    timeFormat(date) {
      const dateObject = dateFormat(date);
      return `${dateObject.month.en} ${dateObject.day.en}, ${dateObject.year}`;
    },
    load() {
      const data = this.$load('envelope');

      if (typeof data === 'object') {
        this.loadingType = 'loading';
      }

      data &&
        data
          .then(res => {
            if (res.status === 1) {
              const result = res.body;
              this.data.data = this.data.data.concat(result.data);

              if (result.page === result.totalPage) {
                this.loadingType = 'nomore';
                window.removeEventListener('scroll', this.load);
              } else {
                this.loadingType = 'more';
              }

              // 设置滚动条位置
              this.$setScroll('.bottom-loading');
            } else {
              this.loadingType = 'more';
            }
          })
          .catch(() => {
            this.loadingType = 'nomore';
          });
    }
  }
};
</script>

<style lang="scss" scoped>
header {
  position: fixed;
}

.container {
  min-height: 100vh;
  background: #eef5ff;
}

.content {
  width: 700px;
  margin: auto;
  padding: 90px 0 50px;

  .item {
    margin-bottom: 30px;
    background: #fff;
    padding: 30px 30px 20px;
    border-radius: 6px;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 1px 8px rgba(0, 132, 255, 0.3);
    }

    .text {
      color: #333;

      /deep/ .hljs-right {
        text-align: right;
      }
    }

    .time {
      font-size: 13px;
      text-align: right;
      margin-top: 14px;
      color: #888;
    }
  }
}

@media screen and (max-width: 700px) {
  .content {
    width: 100%;
    padding: 80px 20px 20px;
  }
}

@media screen and (max-width: 500px) {
  .content {
    width: 100%;
    padding: 70px 20px 10px;

    .item {
      padding: 20px;
      margin-bottom: 18px;
    }
  }
}
</style>
