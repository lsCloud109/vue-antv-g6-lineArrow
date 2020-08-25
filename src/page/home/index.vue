<template>
  <div>
    <ul>
      <li @click="JumpToPage('LineArrow')">缩进树</li>
       <li @click="JumpToPage('Dagre')">流程图布局</li>
    </ul>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  mounted () {

  },
  methods: {
    JumpToPage (val) {
      this.$router.push({
        name: val
      })
    }
  }
}
</script>
<style lang="scss" scoped>
ul li {
  cursor: pointer;
}
ul li:hover {
  text-decoration: underline;
  color: rgb(0,144,255);
}
</style>
