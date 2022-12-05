<!-- 新增 -->
<template>
  <div class='index'>新增</div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
export default defineComponent({
  data() {
    return {
    };
  },

  created() {
    if (!("Notification" in window)) {
      console.log("浏览器不支持消息通知");
      return;
    }
    Notification.requestPermission(function (permission) { });





  },

  methods: {}
})

</script>
<style lang='scss' scoped>
</style>