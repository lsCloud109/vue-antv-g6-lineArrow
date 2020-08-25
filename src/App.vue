<template>
  <div id='app'>
    <router-view></router-view>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/index.css'

// import axios from "axios";

export default {
  data () {
    return {}
  },
  name: 'app',
  created () {
  },
  computed: {},
  methods: {

  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background: #ffffff;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}
</style>
