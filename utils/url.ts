const isServer = !process.browser;
const domain = process.env.baseUrl || '';
if (isServer) {
  // domain = domain.replace(/^https/i, 'http')
}

const prod = process.env.NODE_ENV === 'production';

const Url = {
  domain,
  staticHost: prod ? '//cdn.leroy.net.cn/nuxt-blogs/static/' : '/',
  // staticHost: '//static.leroy.net.cn/',

  info: domain + '/info', // 个人信息
  article: domain + '/article', // 文章
  envelope: domain + '/envelope', // 短语
  subscribe: domain + '/subscribe', // 订阅通知
  subscribe_result: domain + '/subscribe_result', // 开启订阅通知功能
  myself: domain + '/myself', // 关于我
  comment: domain + '/comment', // 评论
  article_like: domain + '/article_like' // 点赞
};
export default Url;
