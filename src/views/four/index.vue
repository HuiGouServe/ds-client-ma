<!-- 404页面 -->
<template>

  <div class='index'>
    <el-empty description="404页面,点击回到首页" style="height:100%">
      <el-button type="primary" @click="routerclick">确定</el-button>
    </el-empty>
  </div>
</template>

<script lang='ts'>

import { defineComponent } from 'vue'
export default defineComponent({
  data() {
    return {
    };
  },

  created() {
    const { BrowserWindow } = require('electron')
    const win = new BrowserWindow()
    win.once('focus', () => win.flashFrame(false))
    win.flashFrame(true)
  },

  methods: {
    routerclick() {
      this.$router.push('login')
    }
  }
})

</script>
<style lang='scss' scoped>
.index {
  height: 100%;
  width: 100%;
}
</style>