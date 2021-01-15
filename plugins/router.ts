import { Route, NavigationGuardNext } from 'vue-router';

export default ({ app: { router } }: any) => {
  // 顶部loading
  router.afterEach(() => {
    setTimeout(() => {
      const loader: HTMLElement | null = document.querySelector('.loader');
      if (loader) {
        loader.style.display = 'none';
      }
    }, 1000);
  });
  router.beforeEach((_: Route, __: Route, next: NavigationGuardNext) => {
    const loader: HTMLElement | null = document.querySelector('.loader');
    if (loader) {
      loader.style.display = 'block';
    }
    next();
  });
};
