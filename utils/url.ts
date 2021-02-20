const isProd = process.env.NODE_ENV === 'production';
const isServer = !process.browser;
let domain = isProd ? 'https://api.leroy.net.cn/web' : 'http://localhost:5001/web';
// let domain = 'https://api.leroy.net.cn/web';
if (isServer) {
  domain = domain.replace(/^https/i, 'http');
}

const Url = {
  domain,
  staticHost: isProd ? '//cdn.leroy.net.cn/nuxt-blogs/static/' : '/',
  // staticHost: '//static.leroy.net.cn/',

  info: domain + '/info', // 页面相关信息
  article: domain + '/article', // 文章
  envelope: domain + '/envelope', // 短语
  about: domain + '/about', // 关于我
  comment: domain + '/comment', // 评论
  article_like: domain + '/article/like' // 点赞
};
export default Url;
