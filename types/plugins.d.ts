declare module 'vue/types/vue' {
  interface Vue {
    $setScroll(dom: string, type: string): void;
    $load(type: string, from: string): void;
    $throttle(fn: (...args: any[]) => void, interval: number): void;
    $debounce(fn: (...args: any[]) => void, interval: number): void;
  }
}

