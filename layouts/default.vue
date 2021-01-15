<template>
  <div>
    <nuxt :keep-alive-props="{include: includeArr}" class="page" keep-alive />
  </div>
</template>

<script>
export default {
  data() {
    return {
      includeArr: ['index', 'about'] // 组件的 name
    }
  }
}
</script>
