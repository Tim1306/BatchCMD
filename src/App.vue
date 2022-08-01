<template>
  <div id="app">
    <Home msg="Welcome to BatchCMD App"/>
  </div>
</template>

<script>
import Home from './components/index.vue'

export default {
  name: 'App',
  components: {
    Home
  }
}
</script>

<style lang="less" scoped>
#app{
  height: 100%;
}
</style>