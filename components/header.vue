<template>
  <header :class="{ qrccode, isUp }">
    <div class="l icon">
      <!-- <span class="iconfont icon-logo3 logo" @click="toIndex"></span> -->
      <div class="logo-img" @click="toIndex">
        <span style="font-size: 18px">Leroy</span>
      </div>
      <span
        v-if="music"
        :class="isStore ? 'icon-pause' : 'icon-play'"
        class="iconfont"
        @click="changeMusic"
      ></span>
    </div>

    <div :class="{ active: isTitle }" class="title">{{ title }}</div>

    <div class="r icon">
      <!-- Article Page -->
      <template v-if="like">
        <!--        <span class="iconfont icon-wechat" @click="wechat"></span>-->
        <span :class="{ like: isLike }" class="iconfont icon-like" @click="likeClick"></span>
      </template>

      <span class="myself" @click="myself">
        <img :src="info.admin.avatar" />
      </span>
    </div>

    <!-- liked hint -->
    <div v-if="like" :class="{ likeHint }" class="like-hint-box">
      <div class="like-hint">只能点赞一次哦, 感谢支持</div>
      <span></span>
      <span></span>
    </div>

    <!-- Music Progress -->
    <div :style="{ width: changeProgress }" class="musicBar"></div>

    <!-- mobile music icon -->
    <div v-if="music" :class="[mobileMusic]" class="music-btn" @click="changeMusic">
      <svg
        class="progress-circle"
        version="1.1"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle class="progress-background" cx="50" cy="50" fill="transparent" r="50" />
        <circle
          :stroke-dasharray="dashArray"
          :stroke-dashoffset="dashOffset"
          class="progress-bar"
          cx="50"
          cy="50"
          fill="transparent"
          r="50"
        />
      </svg>
      <span :class="isStore ? 'icon-pause' : 'icon-play'" class="iconfont"></span>
    </div>

    <!-- music -->
    <audio v-if="music" id="music" loop="loop" preload="auto">
      <source :src="music" type="audio/mpeg" />
    </audio>
  </header>
</template>

<script>
import Url from '~/utils/url';

export default {
  props: ['music', 'title', 'github', 'like'],
  data() {
    return {
      isStore: false,
      isTitle: false,
      timer: null,
      changeProgress: 0,

      percent: 0,
      mobileMusic: '',
      dashArray: Math.PI * 100,

      isLike: false,
      scrollTop: 0,
      qrccode: false,
      isUp: false,

      likeTime: null,
      likeHint: false,

      fnScroll: () => {}
    };
  },
  computed: {
    info() {
      return this.$store.state.data;
    },
    // mobile music progress
    dashOffset() {
      return (1 - this.percent) * this.dashArray;
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.fnScroll);
  },
  mounted() {
    // isLike
    const like = localStorage.getItem(`like-${this.like}`);
    this.isLike = Boolean(like);

    this.fnScroll = this.$throttle(this.handleScroll, 100);
    window.addEventListener('scroll', this.fnScroll);

    // 播放音乐
    setTimeout(this.changeMusic, 1000);
  },
  methods: {
    // Scroll Change
    handleScroll() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const relust = scrollTop - this.scrollTop;
      this.scrollTop = scrollTop;

      this.isUp = scrollTop > 100 && relust < 0;

      if (scrollTop >= 100) {
        this.isTitle = true;
        this.mobileMusic = 'show';
      } else {
        this.isTitle = false;
        this.mobileMusic = this.mobileMusic ? 'exit' : '';
      }
    },
    wechat() {
      this.qrccode = !this.qrccode;
    },
    // like +1
    likeClick() {
      if (this.isLike) {
        clearTimeout(this.likeTime);
        this.likeHint = true;
        this.likeTime = setTimeout(() => (this.likeHint = false), 3000);
      } else {
        this.$axios.put(`${Url.article_like}/${this.like}`).then(() => {
          this.$emit('liked', true);
          this.isLike = true;
          localStorage.setItem(`like-${this.like}`, true);
        });
      }
    },
    changeMusic() {
      const music = document.getElementById('music');
      if (!this.isStore) {
        // 播放
        music
          .play()
          .then(() => {
            this.isStore = true;
            this.timer = setInterval(() => {
              const n = (100 * (music.currentTime / music.duration)).toFixed(2);
              const ns = 1 * (music.currentTime / music.duration);
              // Loop
              if (n >= 100) clearInterval(this.timer);
              this.changeProgress = n + '%';
              this.percent = ns;
            }, 50);
          })
          .catch(() => {
            console.log('该浏览器暂不支持！');
          });
      } else {
        // 暂停
        music.pause();
        this.isStore = false;
        if (this.timer) clearInterval(this.timer);
      }
    },
    toIndex() {
      this.$router.push('/');
    },
    myself() {
      this.$router.push('/about');
    }
  }
};
</script>

<style lang="scss" scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  border-bottom: 1px solid #f6f7f8;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #666;
  padding: 0 15px;
  background: #fff;
  z-index: 99999;
  transition: all 0.3s;

  .musicBar {
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 50px;
    z-index: -1;
    background: #eee;
  }

  .title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    transition: all 0.8s;
    text-align: center;
    opacity: 0;

    &.active {
      opacity: 1;
    }
  }

  .logo-img {
    //width: 30px;
    margin-top: 4px;
    vertical-align: middle;
    display: inline-block;
    cursor: pointer;

    img {
      width: 100%;
    }
  }

  .icon .iconfont {
    color: #888;
    font-size: 20px;
    cursor: pointer;
    margin: 4px 5px 0;
    transition: all 0.3s;
    vertical-align: middle;
    display: inline-block;

    &.logo {
      color: #444;
      font-size: 30px;
    }

    &.icon-github {
      font-size: 28px;
      position: absolute;
      right: 48px;
      top: 5px;

      &:hover {
        color: #000;
      }
    }

    &.like,
    &.icon-like:hover {
      color: #ef6d57;
    }

    &.icon-wechat:hover {
      color: #0cd438;
    }

    &:hover {
      color: var(--colorDefault);
    }
  }

  .myself {
    width: 26px;
    height: 26px;
    display: inline-block;
    border-radius: 50%;
    overflow: hidden;
    vertical-align: bottom;
    margin-left: 8px;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
    }
  }

  #qrccode {
    height: 180px !important;
    width: 180px !important;
    padding: 10px;
    position: absolute;
    top: 60px;
    right: 10px;
    background: #fff;
    border-radius: 10px;
    border: 1px solid #eee;
    box-shadow: 0 4px 10px #eee;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
  }

  &.qrccode {
    #qrccode {
      opacity: 1;
      visibility: visible;
    }

    .icon-wechat {
      color: #0cd438;
    }
  }

  .like-hint-box {
    position: absolute;
    top: 60px;
    right: 75px;
    transition: all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    transform-origin: right top;
    transform: scale(0);
    opacity: 0;
    visibility: hidden;

    .like-hint {
      position: absolute;
      top: 30px;
      right: 40px;
      background: #ef6c57;
      color: #fff;
      font-size: 13px;
      width: 210px;
      height: 110px;
      line-height: 114px;
      text-align: center;
      border-radius: 220px / 120px;
    }

    span {
      position: absolute;
      top: 13px;
      right: 13px;
      height: 28px;
      width: 28px;
      border-radius: 50%;
      background: #ef6b57;

      &:last-child {
        width: 14px;
        height: 14px;
        right: 0;
        top: 0;
      }
    }

    &.likeHint {
      opacity: 1;
      visibility: visible;
      transform: scale(1);
    }
  }
}

.music-btn {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 36px;
  padding: 3px;
  height: 36px;
  color: #fff;
  opacity: 0.8;
  cursor: pointer;
  z-index: 9999999;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  display: none;

  .progress-circle {
    height: 30px;
    width: 30px;

    circle {
      stroke-width: 10px;
      transform-origin: center;

      &.progress-background {
        transform: scale(0.9);
        stroke: #fff;
      }

      &.progress-bar {
        transform: scale(0.9) rotate(-90deg);
        stroke: #50bcb6;
      }
    }
  }

  .iconfont {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: inline-block;
    padding: 1px 0 0 3px;
    font-size: 14px;

    &.icon-pause {
      padding-left: 1px;
    }
  }
}

@media screen and (max-width: 600px) {
  header {
    position: absolute;

    .scrollbar {
      position: fixed;
      height: 1px;
    }

    .iconfont.logo {
      font-size: 28px;
      margin: 4px 0 0;
    }
  }
  .music-btn {
    opacity: 0;
    display: none;

    &.show {
      display: block;
      visibility: visible;
      animation: fadeInTop 0.6s both;
    }

    &.exit {
      display: block;
      opacity: 0;
      animation: fadeInDown 0.6s both;
    }
  }
}

@keyframes fadeInTop {
  from {
    opacity: 0;
    transform: translate(0, 30px);
  }
  to {
    opacity: 1;
    transform: translate(0, 0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 1;
    transform: translate(0, 0px);
  }
  to {
    opacity: 0;
    visibility: hidden;
    transform: translate(0, 30px);
  }
}
</style>
