import Vue from 'vue';
import { $axios } from '@/utils/api';

type VueType = typeof Vue;

interface CommonType {
  install: (Vue: VueType) => void;
  timerScroll?: number;
}

interface ListItemType {
  el: HTMLElement;
  src: string;
}

const common: CommonType = {
  install(Vue) {
    // 设置滚动条位置
    Vue.prototype.$setScroll = (dom: string, type: string) => {
      // DOM元素 计算位置
      const domTop = document.querySelector<HTMLElement>(dom)?.offsetTop || 0;
      const index = type === 'index' ? 280 : -700;
      const target =
        domTop + (document.documentElement.clientHeight || document.body.clientHeight) / 2 + index;

      let beforeScroll = 0;

      this.timerScroll = window.setInterval(() => {
        let scrollT = document.documentElement.scrollTop || document.body.scrollTop;
        let speed = (target - scrollT) / 10;

        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
        scrollT = document.body.scrollTop = document.documentElement.scrollTop = scrollT + speed;

        let result = null;
        if (type === 'comment') {
          result = (beforeScroll && scrollT > beforeScroll) || scrollT <= target || scrollT === 0;
        } else {
          result = scrollT <= beforeScroll || scrollT + speed >= target;
        }
        if (result) {
          clearInterval(this.timerScroll);
        }
        beforeScroll = scrollT;
      }, 25);
    };

    // 加载下一页数据
    let [page, loadingFrom, loadingType] = [1, '', 'more'];
    Vue.prototype.$load = (type: string, from: string) => {
      // 离开路由 初始化
      if (type === 'none') {
        loadingFrom = '';
        loadingType = 'more';
        page = 1;
        return;
      }

      // 初始化
      if (type !== loadingFrom) {
        loadingFrom = type;
        loadingType = 'more';
        page = 1;
      }

      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

      if (scrollTop + windowHeight >= scrollHeight - 10) {
        if (loadingType === 'nomore' || loadingType === 'loading') return;

        page++;
        loadingType = 'loading';

        const data = {
          page,
          from: from ? 'list' : ''
        };
        return new Promise((resolve, reject) => {
          $axios
            .get(type, { params: data })
            .then(res => {
              setTimeout(() => {
                loadingType = res.data.body.page === res.data.body.totalPage ? 'nomore' : 'more';
                resolve(res.data);
              }, 1000);
            })
            .catch(e => {
              loadingType = 'more';
              reject(e);
            });
        });
      }
    };

    /**
     * 首页图片懒加载
     */

    // 需加载图片
    const listenList: ListItemType[] = [];

    Vue.directive('lazy', {
      inserted: (el, binding) => {
        const url = binding.value;
        listenList.push({ el, src: url });
        window.addEventListener('scroll', watch);
        // 首屏初始化
        lazyLoad({ el, src: url });
      },
      unbind: () => {
        window.removeEventListener('scroll', watch);
      }
    });

    // 使用函数，切换路由，可清除监听事件
    const watch = () => {
      // const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

      // console.log(scrollTop)
      Vue.prototype.$throttle(() => listenList.map(i => lazyLoad(i)), 50)();
    };

    // 加载图片
    const lazyLoad = (item: ListItemType) => {
      const { el, src } = item;
      const windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      const position = el.getBoundingClientRect().top;
      const show = position <= windowHeight + 500;

      // 元素存在，元素可见
      if (src && show) {
        const img: HTMLImageElement = new Image();
        img.src = src;

        // 加载成功后, 删除对象
        img.onload = () => {
          el.setAttribute('src', src);
          const index = listenList.indexOf(item);
          index > -1 && listenList.splice(index, 1);
        };
      }
    };

    Vue.prototype.$throttle = (fn: (...args: any[]) => void, interval: number) => {
      let flag = true;
      return (...args: any[]) => {
        if (flag) {
          flag = false;
          setTimeout(() => {
            fn.apply(this, args);
            flag = true;
          }, interval);
        }
      };
    };
    Vue.prototype.$debounce = (fn: (...args: any[]) => void, interval: number) => {
      let timer: null | number = null;
      return (...args: any[]) => {
        if (timer) clearTimeout(timer);
        timer = window.setTimeout(() => {
          fn.apply(this, args);
        }, interval);
      };
    };
  }
};

Vue.use(common);
