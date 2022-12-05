<!-- 地图 -->
<template>
  <div class='index'>
    <baidu-map class="bm-view" :center="center" v="3.0" type="API" :zoom="zoom" @ready="handler"
      ak="cA2RQ4lOgn1acepnTr9WjpWxwcRZEqGb">
      <bm-marker :position="{ lng: 114.05, lat: 22.53 }" :dragging="true" :icon="{ url: '../../assets/logo.png' }"
        :zIndex="1000" />
      <!--   :icon="{url: 'http://developer.baidu.com/map/jsdemo/img/fox.gif', size: {width: 300, height: 157}}" -->
    </baidu-map>
  </div>
</template>

<script lang='ts'>
import { BaiduMap } from 'vue-baidu-map-3x'

import { defineComponent } from 'vue'
export default defineComponent({
  components: { BaiduMap },
  data() {
    return {
      center: { lng: 0, lat: 0 },
      zoom: 3,
      map: ''
    };
  },

  mounted() {

  },

  methods: {
    handler({ BMap, map }: any) {
      console.log(BMap, map)
      this.center.lng = 114.05
      this.center.lat = 22.53
      this.zoom = 15
    }
  }
})

</script>
<style lang='scss' scoped>
.index {
  height: 100%;
  width: 100%;

  .bm-view {
    height: 100%;
    width: 100%;
  }
}
</style>