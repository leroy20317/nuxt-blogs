<template>
  <div>
    <nuxt :keep-alive-props="{ include: includeArr }" class="page" keep-alive />
  </div>
</template>

<script>
import { dateFormat } from '~/utils/util';

export default {
  data() {
    return {
      includeArr: ['index', 'about'] // 组件的 name
    };
  },
  head() {
    return {
      title: this.info.web.name,
      meta: [
        { hid: 'keywords', name: 'keywords', content: this.info.web.seo },
        { hid: 'description', name: 'description', content: this.info.web.description }
      ]
    };
  },
  computed: {
    info() {
      const data = this.$store.state.data;
      const date = dateFormat(data.cover.date);
      return {
        ...data,
        cover: {
          ...data.cover,
          date: `${date.month.cn}月 ${date.day.on}, ${date.year}`
        }
      };
    }
  }
};
</script>
