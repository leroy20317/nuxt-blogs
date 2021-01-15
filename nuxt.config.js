const isProd = process.env.NODE_ENV === 'production';

const BASE_URL = 'https://www.leroy.net.cn';
// const BASE_URL = 'http://localhost:5001'

export default {
  mode: 'universal',
  head: {
    title: 'blogs',
    meta: [
      { charset: 'utf-8' },
      { name: 'Author', content: 'Leroy' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1.0, shrink-to-fit=no, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'
      },
      {
        hid: 'description',
        name: 'description',
        content:
          'Good morning, and in case I don’t see you, good afternoon, good evening, and good night...'
      },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: 'https://static.leroy.net.cn/images/icon.ico'
      }
    ]
  },
  server: {
    port: 5000,
    host: isProd ? '0.0.0.0' : 'localhost'
  },
  env: {
    baseUrl: `${BASE_URL}/web/api`
  },

  loading: '~/components/loadingTab.vue',

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~assets/css/main.css', '~assets/css/iconfont.css'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/axios-accessor',
    { src: '@/plugins/vue-mavon-editor', ssr: true },
    { src: '@/plugins/common', ssr: true },
    { src: '@/plugins/component', ssr: true },
    { src: '@/plugins/router', ssr: false }
  ],
  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios'
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    // 当启动nuxt build时， 将.nuxt/dist/client目录的内容上传到您的 CDN 即可！
    publicPath: 'https://cdn.leroy.net.cn/nuxt-blogs/client',

    terser: {
      parallel: true,
      cache: false,
      sourceMap: false,
      extractComments: {
        filename: 'LICENSES'
      },
      terserOptions: {
        compress: {
          drop_console: true
        },
        output: {
          comments: /^\**!|@preserve|@license|@cc_on/
        }
      }
    }
  }
};
