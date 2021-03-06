<template>
  <div :class="{ navActive: isNav }" class="container index">
    <div class="cover">
      <div id="scene" :style="{ height: boxH }">
        <div :style="layerStyle" class="layer" data-depth="0.4">
          <img id="image" :src="image" :style="imgStyle" height="1080" width="1920" />
        </div>
      </div>
      <div class="head">
        <!-- <div class="logo"><span class="iconfont icon-logo4"></span></div> -->
        <div class="logo-img">Leroy</div>
        <div class="menu" @click="menu">
          <span :class="isNav ? 'icon-close' : 'icon-menu'" class="iconfont"></span>
        </div>
      </div>
      <div :style="{ backgroundColor: info.cover.color }" class="misk"></div>
      <div class="post">
        <div class="time">{{ timeFormat(info.cover.date) }}</div>
        <div class="title">
          <nuxt-link v-if="info.cover.link" :to="info.cover.link">{{ info.cover.title }}</nuxt-link>
          <span v-else>{{ info.cover.title }}</span>
        </div>
        <div class="describe">{{ info.cover.description }}</div>
      </div>
      <!-- menu -->
      <div class="nav">
        <ul class="nav-list">
          <template v-for="(item, index) in navList">
            <li :key="index">
              <a @click="toPage(item.url)">{{ item.title }}</a>
            </li>
          </template>
        </ul>
        <div class="world">
          <span>Everywhere in the world has a similar life.</span>
        </div>
      </div>
    </div>

    <div v-if="articleList.data && articleList.data.length > 0" class="content">
      <div v-for="(item, index) in articleList.data" :key="index" class="post">
        <div class="img-box" @click="article(item._id)">
          <img
            v-lazy="item.image.url"
            :alt="item.image.name"
            :src="`${staticHost}image/other/default.jpg`"
          />
        </div>
        <div class="info">
          <div class="time">
            {{ timeFormat(item.time) }}
          </div>
          <div class="title">
            <a @click="article(item._id)">{{ item.title }}</a>
          </div>
          <div class="describe">{{ item.describe }}</div>
          <div class="stuff">
            <div>
              <i class="iconfont icon-text"></i><span>{{ item.words }}</span>
            </div>
            <div>
              <i class="iconfont icon-eye"></i><span>{{ item.read }}</span>
            </div>
            <div>
              <i class="iconfont icon-like"></i><span>{{ item.like }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="more" @click="loadMoreData">
        <load-more :loading-type="loadingType" />
      </div>
    </div>

    <div v-if="info.web.icp" class="foot">
      <a href="https://beian.miit.gov.cn" target="_blank">{{ info.web.icp }}</a>
    </div>

    <back-top v-if="isBack" />

    <!-- loading -->
    <loading v-if="loading" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Context } from '@nuxt/types/app';
import { $axios } from '@/utils/api';
import Parallax from 'parallax-js';
import Url from '~/utils/url';
import { dateFormat } from '~/utils/util';

export default Vue.extend({
  name: 'Index',
  beforeRouteEnter(_, __, next) {
    next((vm: any) => {
      vm.init();
      vm.windowChange = vm.$debounce(vm.init, 100);
      window.onresize = () => vm.windowChange();
      vm.isBack = true;
    });
  },
  beforeRouteLeave(_, __, next) {
    document.body.style.overflowY = '';
    window.onresize = null;
    this.isBack = false;
    setTimeout(() => (this.isNav = false), 500);
    document.removeEventListener('touchmove', this.on, false);
    next();
  },
  async asyncData(context: Context) {
    if (context.store.state.index) {
      // 防止重复加载
      return;
    }
    const { data } = await $axios.get(Url.article);
    console.log('data', data);
    return { articleList: data.status === 'success' ? data.body : {} };
  },
  data() {
    return {
      staticHost: Url.staticHost,
      layerStyle: {},
      imgStyle: {},
      boxH: '100%',
      boxW: '100%',
      navList: [
        {
          title: 'Article',
          url: 'article'
        },
        {
          title: 'Rainy',
          url: 'rain'
        },
        {
          title: 'Envelope',
          url: 'envelope'
        },
        {
          title: 'About',
          url: 'about'
        }
      ],
      isNav: false,
      loading: true,
      loadingType: 'more',
      page: 1,

      isBack: true,

      image: null,
      windowChange: () => {}
    };
  },
  computed: {
    info() {
      return this.$store.state.data;
    }
  },
  mounted() {
    document.body.style.overflowY = 'hidden';

    // Cover image loading is complete
    const img = new Image();
    img.src = this.info.cover.image;
    img.onload = () => {
      setTimeout(() => {
        this.image = this.info.cover.image;
        this.loading = false;
        document.body.style.overflowY = '';
      }, 1500);
    };

    // Homepage loaded
    this.$store.commit('isIndex');

    // Cover image init
    const scene = document.getElementById('scene');
    const parallaxInstance = new Parallax(scene, {
      relativeInput: true,
      clipRelativeInput: true
    });

    console.log('parallaxInstance', parallaxInstance);
    if (this.articleList.page >= this.articleList.totalPage) {
      this.loadingType = 'nomore';
    }
  },
  methods: {
    // Cover image init
    init() {
      this.boxH = document.documentElement.clientHeight + 'px';
      this.boxW = document.documentElement.clientWidth + 'px';
      this.coverLayer();
    },
    // Cover image box calculation
    coverLayer() {
      const _w = parseInt(this.boxW);
      const _h = parseInt(this.boxH);
      let x;
      let y;
      let i;
      const e = _w >= 1000 || _h >= 1000 ? 1000 : 500;

      if (_w >= _h) {
        i = (_w / e) * 50;
        y = i;
        x = (i * _w) / _h;
      } else {
        i = (_h / e) * 50;
        x = i;
        y = (i * _h) / _w;
      }
      const style = {
        width: _w + x + 'px',
        height: _h + y + 'px',
        marginLeft: -0.5 * x + 'px',
        marginTop: -0.5 * y + 'px'
      };
      this.layerStyle = Object.assign({}, this.layerStyle, style);
      this.coverImg();
    },
    // Cover image size calculation
    coverImg() {
      const width = parseInt(this.layerStyle.width);
      const height = parseInt(this.layerStyle.height);
      const ratio = 1080 / 1920;
      const style: { width?: string; height?: string; left?: string; top?: string } = {};

      const compute = height / width > ratio;

      style.width = compute ? height / ratio + 'px' : `${width}px`;
      style.height = compute ? `${height}px` : width * ratio + 'px';

      style.left = (width - parseInt(style.width)) / 2 + 'px';
      style.top = (height - parseInt(style.height)) / 2 + 'px';

      this.imgStyle = Object.assign({}, this.imgStyle, style);
    },
    loadMoreData() {
      if (this.loadingType === 'nomore' || this.loadingType === 'loading') return;

      this.page++;
      this.loadingType = 'loading';
      this.$axios
        .get(Url.article, {
          params: {
            page: this.page
          }
        })
        .then(res => {
          const result = res.data.body;
          if (res.data.status === 'success') {
            setTimeout(() => {
              this.articleList.data = this.articleList.data.concat(result.data);

              this.$setScroll('.bottom-loading', 'index');

              this.loadingType = result.page === result.totalPage ? 'nomore' : 'more';
            }, 1000);
          } else {
            this.loadingType = 'more';
          }
        })
        .catch(() => {
          this.loadingType = 'more';
        });
    },
    // Other pages
    toPage(url: string) {
      this.$router.push(`/${url}`);
    },
    // Nav
    menu() {
      this.isNav = !this.isNav;
      if (this.isNav) {
        document.addEventListener('touchmove', this.on, { passive: false });
      } else {
        document.removeEventListener('touchmove', this.on);
      }
      document.body.style.overflowY = this.isNav ? 'hidden' : '';
    },
    on(e: Event) {
      e.preventDefault();
    },
    article(id: string) {
      // console.log('this.$router', this.$router);
      this.$router.push(`/${id}`);
    },
    timeFormat(date) {
      const dateObject = dateFormat(date);
      return `${dateObject.month.cn}月 ${dateObject.day.on}, ${dateObject.year}`;
    }
  }
});
</script>
<style lang="scss" scoped>
.index {
  position: absolute;
  width: 100%;

  #scene {
    height: 100%;
    position: relative;
    overflow: hidden;

    #image {
      position: absolute;
      max-width: none;
      display: block;
    }
  }

  .cover {
    width: 100%;
    height: 100vh;
    position: relative;
    z-index: 9999;
    overflow: hidden;

    .head {
      position: absolute;
      top: 70px;
      width: 100%;
      color: #fff;
      z-index: 99999;
      padding: 0 40px 0 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .logo {
        transition: all 0.3s;

        .iconfont {
          font-size: 36px;
          cursor: pointer;
        }
      }

      .logo-img {
        width: 100px;
        height: 44px;
        position: relative;
        transition: all 0.3s;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 34px;

        img {
          opacity: 1;
          width: 100%;
          position: absolute;
          transition: all 0.3s;
          cursor: pointer;

          &:last-child {
            opacity: 0;
          }
        }
      }

      .menu {
        width: 30px;
        height: 30px;
        line-height: 32px;
        border-radius: 2px;
        cursor: pointer;
        color: #ff3600;
        text-align: center;
        background: rgba(255, 255, 255, 0.9);

        span {
          font-size: 20px;
        }
      }
    }

    .cover-bg {
      width: 100%;
      height: 100%;

      img {
        position: absolute;
      }
    }

    .misk {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: rgba(176, 14, 37, 0.7);
      clip-path: polygon(0 0, 25% 0, 60% 100%, 0% 100%);
    }

    .post {
      position: absolute;
      top: 54%;
      left: 10%;
      color: #fff;
      width: 30%;
      transform: translateY(-50%);

      .time {
        font-size: 14px;
      }

      .title {
        margin: 15px 0 30px;

        span {
          font-size: 28px;
          color: #fff;
        }

        a {
          font-size: 28px;
          color: #fff;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      .describe {
        line-height: 22px;
      }
    }
  }

  .content {
    width: 1200px;
    margin: auto;
    position: relative;
    padding-bottom: 80px;
    text-align: center;

    &:after {
      content: '';
      width: 1px;
      height: calc(100% + 100px);
      position: absolute;
      top: -100px;
      left: 50%;
      background: #eaeaea;
      z-index: 0;
    }

    .more {
      margin-top: 90px;
      display: inline-block;
    }

    /deep/ .bottom-loading {
      position: relative;
      z-index: 999;

      .btn {
        border-radius: 0;
        display: inline-block;
        border: 1px solid #eaeaea;
        border-radius: 4px;
      }
    }

    .post {
      position: relative;
      margin-top: 100px;
      z-index: 1;

      .img-box {
        width: 680px;
        height: 440px;
        font-size: 0;
        display: inline-block;
        position: relative;
        cursor: pointer;
        z-index: 3;
        overflow: hidden;
        border-radius: 6px;
        border: 1px solid #f3fafd;
        transition: all 0.3s;

        img {
          width: 100%;
          height: 100%;
        }

        &:hover img {
          opacity: 0.95;
        }
      }

      .info {
        width: 500px;
        height: 400px;
        position: absolute;
        top: 20px;
        padding: 80px 100px 0 80px;
        border: 1px solid #eaeaea;
        border-radius: 6px;

        .time {
          color: #999;
          font-size: 12px;
        }

        .title {
          margin-top: 8px;
          word-break: break-all;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;

          a {
            font-size: 24px;
            line-height: 30px;
            cursor: pointer;

            &:hover {
              background: radial-gradient(
                    circle at 10px -7px,
                    transparent 8px,
                    currentColor 8px,
                    currentColor 9px,
                    transparent 9px
                  )
                  repeat-x,
                radial-gradient(
                    circle at 10px 27px,
                    transparent 8px,
                    currentColor 8px,
                    currentColor 9px,
                    transparent 9px
                  )
                  repeat-x;
              background-size: 20px 20px;
              background-position: -10px calc(100% + 16px), 0 calc(100% - 4px);
              animation: waveFlow 1s infinite linear;
            }

            @keyframes waveFlow {
              from {
                background-position-x: -10px, 0;
              }
              to {
                background-position-x: -30px, -20px;
              }
            }
          }
        }

        .describe {
          color: #666;
          font-size: 14px;
          line-height: 22px;
          margin-top: 10px;
          word-break: break-all;
          display: -webkit-box;
          -webkit-line-clamp: 3; /* 指定行数*/
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .stuff {
          font-size: 12px;
          color: #999;
          position: absolute;
          bottom: 80px;
          left: 80px;
          display: flex;

          div {
            padding: 6px;
            font-size: 12px;
            display: flex;
            align-items: center;
            position: relative;
            transition: all 0.3s;

            &:nth-of-type(1):hover {
              color: #ef6d57;
            }

            &:nth-of-type(2):hover {
              color: #50bcb6;
            }

            &:nth-of-type(3):hover {
              color: #ffa800;
            }

            .iconfont {
              margin-right: 4px;
              margin-top: -4px;
              display: inline-block;

              &.icon-like {
                font-size: 14px;
                margin-top: -1px;
              }

              &.icon-text {
                font-size: 17px;
                margin-top: -2px;
              }
            }

            span {
              display: inline-block;
            }

            &::before,
            &::after {
              position: absolute;
              bottom: 100%;
              left: 50%;
              transition: all 0.3s;
              opacity: 0;
              visibility: hidden;
            }

            &::before {
              content: '善良';
              transform: translate(-50%, -5px);
              background: #ef6d57;
              white-space: nowrap;
              color: #fff;
              font-size: 12px;
              border-radius: 10px;
              padding: 5px 14px;
            }

            &::after {
              content: '';
              border: 5px solid transparent;
              border-top-color: #ef6d57;
              transform: translate(-50%, 5px);
            }

            &:nth-of-type(2)::before {
              content: '勇敢';
              background: #50bcb6;
            }

            &:nth-of-type(3)::before {
              content: '坚持';
              background: #ffa800;
            }

            &:nth-of-type(2)::after {
              border-top-color: #50bcb6;
            }

            &:nth-of-type(3)::after {
              border-top-color: #ffa800;
            }

            &:hover::before,
            &:hover::after {
              opacity: 1;
              visibility: visible;
            }
          }
        }
      }

      &:nth-child(odd) {
        text-align: left;

        .info {
          left: 660px;
        }
      }

      &:nth-child(even) {
        text-align: right;

        .info {
          text-align: left;
          right: 660px;
        }
      }
    }
  }

  .foot {
    text-align: center;

    a {
      margin: 0 auto;
      font-size: 13px;
      color: #666;
      text-decoration: none;
      display: inline-block;
      padding: 1px 0 2px;
    }
  }

  .nav {
    position: fixed;
    left: 0;
    top: -100%;
    width: 100%;
    height: 100%;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.96);
    transition: top 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);

    .world {
      width: 100%;
      position: absolute;
      bottom: 30px;
      display: block;
      text-align: center;
      color: #999;

      span {
        font-size: 16px;
      }
    }

    .nav-list {
      width: 80%;
      display: block;
      text-align: center;
      margin-top: -120px;

      li {
        margin: 0 20px 20px;
        list-style: none;
        display: inline-block;

        a {
          font-size: 24px;
          cursor: pointer;
          color: #666;
          letter-spacing: 1px;

          &:hover {
            color: #222;
          }
        }
      }
    }
  }

  @media screen and (max-width: 1200px) {
    .content {
      width: 900px;

      .post {
        .img-box {
          width: 480px;
          height: 310px;
        }

        .info {
          top: 10px;
          width: 420px;
          height: 290px;
          padding: 50px 60px 0 60px;

          .stuff {
            bottom: 50px;
            left: 60px;
          }

          .title {
            margin-top: 10px;
            line-height: 25px;
          }

          .describe {
            -webkit-line-clamp: 2;
          }
        }

        &:nth-child(odd) .info {
          left: 450px;
        }

        &:nth-child(even) .info {
          right: 450px;
        }
      }
    }
  }
  @media screen and (max-width: 900px) {
    .cover {
      .misk {
        clip-path: polygon(0 0, 220px 0, 700px 100%, 0% 100%);
      }

      .post {
        width: 40%;

        .title a {
          font-size: 22px;
        }
      }
    }
    .content {
      width: 100%;

      .post {
        margin-top: 60px;
        background: #fff;
        border-bottom: 1px solid #eaeaea;

        .img-box {
          width: 100%;
          height: auto;
          display: block;
          text-align: center;
          border: none;

          img {
            width: 680px;
            max-width: 100%;
          }
        }

        .info {
          position: static;
          width: 96%;
          padding: 40px 20px 40px;
          margin: auto;
          border: none;
          background: #fff;
          height: auto;

          .stuff {
            position: static;
            margin: 20px 0 0 -6px;
          }
        }
      }
    }
  }
  @media screen and (max-width: 780px) {
    .cover {
      .head {
        top: 40px;
      }

      .misk {
        clip-path: none;
        background: rgba(176, 14, 37, 0.35);
      }

      .post {
        bottom: 8%;
        left: 5%;
        top: auto;
        width: 70%;
        transform: none;
      }

      .cover-bg {
        img {
          position: absolute;
          left: 50%;
          top: 0;
          height: 100%;
          width: auto;
          transform: translateX(-50%);
        }
      }
    }
    .content {
      width: 100%;

      .post {
        .img-box {
          width: 100%;
          height: auto;
          border-radius: 0;
        }
      }
    }
    .nav {
      .nav-list {
        li {
          // margin: 0 12px;
          a {
            font-size: 18px;
          }
        }
      }
    }
  }
  @media screen and (max-width: 480px) {
    .cover {
      .head {
        padding: 0 24px 0 20px;

        .logo-img {
          width: 80px;

          img {
            top: 6px;
          }
        }
      }

      .post {
        .time {
          display: none;
        }

        .title {
          margin-bottom: 10px;
        }

        .describe {
          font-size: 13px;
          line-height: 20px;
        }
      }
    }
    .nav .world span {
      font-size: 14px;
    }
  }
}

.container.navActive {
  .logo {
    color: #333;
  }

  //.cover .head .logo-img img{
  //	opacity: 0;
  //	&:last-child{
  //		opacity: 1;
  //	}
  //}
  .cover .head .logo-img {
    color: #000;
  }

  .nav {
    top: 0;
  }
}
</style>
