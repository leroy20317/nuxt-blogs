<template>
  <div class="articleld">
    <!-- Article Progress -->
    <div :style="{ width: postProgress }" class="scrollbar"></div>

    <nuxt-header :like="data._id" :music="data.music.url" :title="data.title" @liked="liked" />

    <section>
      <h1 class="title">{{ data.title }}</h1>
      <div class="stuff">
        <span>{{ timeFormat(data.time) }}</span>
        <span>阅读 {{ data.read }}</span>
        <span>字数 {{ data.words }}</span>
        <span>评论 {{ commentTotal }}</span>
        <span>喜欢 {{ data.like }}</span>
      </div>

      <div class="content">
        <client-only>
          <mavon-editor code-style="monokai-sublime" v-html="data.contentHtml" />
        </client-only>
      </div>
    </section>

    <!-- Comment -->
    <comment :article-id="data._id" :title="data.title" :info="info" @total="totalComment" />
  </div>
</template>

<script>
import Comment from '@/components/comment';
import Url from '~/utils/url';
import { dateFormat } from '~/utils/util';

export default {
  components: { Comment },
  // error page
  validate({ params }) {
    return /^[A-z0-9]+$/.test(params.articleId);
  },
  async asyncData(context) {
    const id = context.params.articleId;
    const { data } = await context.$axios.get(`${Url.article}/${id}`);

    if (data.status === 'success' && data.body) {
      return { data: data.body };
    } else {
      context.error({ statusCode: 404, message: '页面未找到或无数据' });
    }
  },
  data() {
    return {
      title: false,
      isLike: false,

      timer: null,
      postProgress: 0,

      scrollTop: 0,
      timerTop: null,
      scrollTopBtn: false,
      loading: true,

      commentTotal: 0,

      header: true
    };
  },
  head() {
    return {
      title: `${this.data.title} | ${this.info.web.name}`
    };
  },
  computed: {
    info() {
      return this.$store.state.data;
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll, true);
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true);
  },
  methods: {
    timeFormat(date) {
      const dateObject = dateFormat(date);
      return `${dateObject.month.cn}月 ${dateObject.day.on}, ${dateObject.year}`;
    },
    liked() {
      this.data.like++;
    },
    totalComment(val) {
      this.commentTotal = val;
    },
    handleScroll() {
      /**
       * Article Progress
       */
      this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

      const h1 = document.getElementsByClassName('content')[0];
      const h2 = document.getElementsByClassName('stuff')[0];
      const h3 = document.getElementsByTagName('h1')[0];

      const h =
        h1.offsetHeight +
        h2.offsetHeight +
        h3.offsetHeight -
        document.documentElement.clientHeight -
        100;
      const n = (100 * (this.scrollTop / h)).toFixed(4);

      if (n < 110) this.postProgress = n + '%';
    },
    myself() {
      this.$router.push('/Leroy');
    },
    toIndex() {
      this.$router.push('/');
    }
  }
};
</script>

<style lang="scss" scoped>
.articleld {
  position: absolute;
  width: 100%;

  section {
    width: 800px;
    margin: auto;
    transition: all 0.3s;
  }

  .scrollbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: #50bcb6;
    transition: width 0.5s ease;
    z-index: 999999;
  }

  h1.title {
    font-size: 30px;
    padding: 130px 0 22px;
    color: #333;
  }

  .stuff {
    color: #6a737d;
    position: relative;
    line-height: 22px;

    span {
      font-size: 13px;
      margin-right: 10px;
      display: inline-block;
    }

    &:after {
      content: '';
      width: 100px;
      position: absolute;
      bottom: -30px;
      left: 50%;
      transform: translateX(-50%);
      border-bottom: 1px solid #eaeaea;
    }
  }

  .content {
    padding: 100px 0;
    font-size: 14px;

    /deep/ .markdown-body {
      box-shadow: none !important;
      min-height: auto;

      p {
        line-height: 36px;
        margin: 0 0 22px;
        font-size: 16px;

        mark {
          padding: 4px 4px 0;
          line-height: 22px;
          display: inline-block;
          font-size: 16px;
        }

        strong {
          font-weight: bold;
          font-size: 16px;
        }

        ins {
          font-size: 16px;
        }
      }

      h1,
      h2,
      h3,
      h4,
      h5 {
        border: 0;
        padding: 0;
        margin: 0 0 18px;
        line-height: 28px;
      }

      blockquote {
        background: white;
        border-radius: 10px;
        padding-left: 22px;
        margin-bottom: 20px;

        p {
          margin: 10px 0;
        }
      }

      ul,
      ol {
        margin: 0 0 20px;

        li {
          margin: 10px 0;
          line-height: 28px;
        }
      }

      ul li {
        list-style: none;
        position: relative;

        &:after {
          content: '☼';
          font-size: 8px;
          position: absolute;
          top: 0px;
          left: -16px;
        }
      }

      iframe {
        width: 100%;
        height: 450px;
        margin-bottom: 20px;
      }

      pre {
        padding: 0;
        font-size: 16px;
        max-height: 500px;
        overflow: hidden;
        border-radius: 4px;

        .hljs {
          padding: 10px 0 10px 12px;
          line-height: 20px;
          overflow: hidden;
          max-height: 500px;
          box-sizing: border-box;

          & > code {
            overflow-y: auto;
            max-height: 480px;
            display: block;

            &::-webkit-scrollbar {
              width: 4px;
            }

            &::-webkit-scrollbar-thumb {
              background: #949494;
            }

            &::-webkit-scrollbar-track {
              background: #23241f;
            }
          }
        }
      }
    }
  }

  .back-top {
    position: fixed;
    bottom: 20px;
    right: 20px;
    height: 20px;
    line-height: 20px;
    background: #50bcb6;
    font-size: 13px;
    z-index: 9999;
    padding: 0 5px;
    color: #fff;
  }
}

@media screen and (max-width: 800px) {
  .articleld {
    section {
      width: 90%;
    }

    h1.title {
      font-size: 20px;
      padding: 90px 0 15px;
    }

    .content {
      padding: 60px 0;

      /deep/ .markdown-body {
        p {
          line-height: 28px;
        }

        iframe {
          height: 390px;
        }
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .articleld {
    /deep/ header {
      &.isUp {
        position: fixed;
        box-shadow: 0 1px 8px #f0f9ff;
        background: rgba(255, 255, 255, 0.9);
        animation: headShow 0.6s both;
      }

      .myself {
        display: none;
      }
    }

    .content {
      /deep/ .markdown-body {
        iframe {
          height: 310px;
        }

        blockquote {
          padding-left: 16px;
        }

        p {
          font-size: 14px;

          strong,
          mark {
            font-size: 14px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .articleld {
    .content {
      /deep/ .markdown-body {
        iframe {
          height: 260px;
        }
      }
    }
  }
}

@media screen and (max-width: 414px) {
  .content {
    /deep/ .markdown-body {
      iframe {
        height: 220px;
      }
    }
  }
}

.verify {
  filter: blur(5px);
}

@keyframes headShow {
  from {
    opacity: 0;
    top: -50px;
  }
  to {
    top: 0;
    opacity: 1;
  }
}
</style>
