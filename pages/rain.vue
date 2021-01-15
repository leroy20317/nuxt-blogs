<template>
  <div class="rain">
    <div class="logo-img" @click="toIndex">Leroy</div>

    <!-- <span class="logo iconfont icon-logo4" @click="toIndex"></span> -->

    <img :src="img" class="rain-bg" draggable="false" />
    <img class="words" draggable="false" :src="`${staticHost}image/rain/words.png`" />

    <ul class="option">
      <li v-for="(item, index) in rainIcon" :key="index">
        <span @click="music(index, item.active)">
          <img v-if="item.active" :src="item.on" draggable="false" />
          <img v-else :src="item.off" draggable="false" />
        </span>
        <!-- music -->
        <audio class="music" loop="loop" preload="auto">
          <source :src="item.music" type="audio/mpeg" />
        </audio>
      </li>
    </ul>

    <!-- loading -->
    <loading v-if="loading" />
  </div>
</template>

<script>
import Url from '~/utils/url';

export default {
  data() {
    return {
      staticHost: Url.staticHost,
      rainIcon: [
        {
          on: `${Url.staticHost}image/rain/rain_on.png`,
          off: `${Url.staticHost}image/rain/rain_off.png`,
          music: Url.staticHost + 'image/rain/thunder.mp3',
          active: false
        },
        {
          on: `${Url.staticHost}image/rain/rain2_on.png`,
          off: `${Url.staticHost}image/rain/rain2_off.png`,
          music: `${Url.staticHost}image/rain/loudThunder.mp3`,
          active: false
        },
        {
          on: `${Url.staticHost}image/rain/rain3_on.png`,
          off: `${Url.staticHost}image/rain/rain3_off.png`,
          music: `${Url.staticHost}image/rain/rain.mp3`,
          active: false
        }
      ],
      loading: true,
      img: null
    };
  },
  head() {
    return {
      title: 'Rainy Day',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            '下雨了，打湿心扉的，不是突如其来的雨点，是人情冷暖。一辆黑色的轿车，嘎然而止，一声亲切的呼唤，上车吧！'
        }
      ]
    };
  },
  mounted() {
    const img = new Image();
    img.src = `${Url.staticHost}image/rain/rain-bg.gif`;
    img.onload = () => {
      this.loading = false;
      this.img = img.src;
    };
    this.$nextTick(() => {
      this.music(0, false);
    });
  },
  methods: {
    toIndex() {
      this.$router.push('/');
    },
    music(type, active) {
      // icon
      this.$set(this.rainIcon[type], 'active', !active);
      const music = document.getElementsByClassName('music');
      if (!active) {
        setTimeout(() => {
          music[type].play();
        }, 500);
      } else {
        music[type].pause();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.rain {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;

  .logo {
    color: #fff;
    position: fixed;
    bottom: 20px;
    left: 30px;
    z-index: 9999;
    font-size: 30px;
    cursor: pointer;
  }

  .logo-img {
    color: #fff;
    position: fixed;
    bottom: 20px;
    left: 30px;
    z-index: 9999;
    cursor: pointer;
    width: 80px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 24px;

    img {
      width: 100%;
    }
  }

  .rain-bg {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .words {
    position: fixed;
    top: 80px;
    right: 80px;
  }

  .option {
    width: 416px;
    height: 70px;
    position: fixed;
    bottom: 0;
    right: 0;
    text-align: center;

    li {
      display: inline-block;
      list-style-type: none;
      cursor: pointer;

      span {
        display: inline-block;
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .rain {
    .rain-bg {
      position: absolute;
      left: 60%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    .words {
      top: 30%;
      left: 50%;
      right: auto;
      transform: translate(-50%, -50%);
    }

    .option {
      width: auto;
      right: 20px;

      li {
        width: 60px;
        overflow: hidden;

        span {
          display: flex;
          justify-content: center;
        }
      }
    }

    .logo {
      left: 20px;
    }
  }
}
</style>
