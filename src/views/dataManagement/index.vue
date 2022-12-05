<!-- 数据管理 -->
<template>
  <div id="main" style="width: 600px; height: 400px"></div>
</template>

<script>
import { onMounted } from 'vue'
import * as echarts from 'echarts' // 使用echarts
export default {
  setup(props, ctx) {
    onMounted(() => {
      var myChart = echarts.init(document.getElementById('main'))
      var option = {
        title: {
          text: 'ECharts 入门示例',
        },
        tooltip: {},
        legend: {
          data: ['销量'],
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    })
  },
}
</script>
