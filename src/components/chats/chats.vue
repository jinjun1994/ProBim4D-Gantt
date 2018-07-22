<template>
  <div ref="echartDiv" style="height:800px; width:100%">
  </div>
</template>
<style>

</style>
<script>
  let echarts = require("echarts");
  const renderer = require("./schedule_renderer2");
  export default {
    props: {
      selectScheduleID: String
    },
    mounted() {
      // renderer.default.acturalScheduleUrl = `${window.urlConfig}/api/Prj/GetScheduleTask?ProjectID=${window.ProjectID}&ModelID=${window.ModelID}&ScheduleID=${window.ScheduleID}&&IsGantt=false`
      
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.5)'
      });
      var _this = this
      var domElement = this.$refs.echartDiv;
      domElement.style.height = domElement.parentElement.offsetHeight;
      this.chart = echarts.init(domElement);
      this.renderer = new renderer.default.scheduleRenderer(this.chart);
      this.renderer.render(this.acturalSchedule, this.plannedSchedule);
      loading.close()
      //节点点击事件
       this.chart.on('click', function (params) {
          // window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(params.name));
          alert('节点被电击了')
          console.log(params)
      });
      // var a=0,b=100;
      // this.chart.setOption({
      //   xAxis: {
      //     axisPointer: {
      //         value: '2018-7-7',
      //         snap: true,
      //         lineStyle: {
      //             color: 'red',
      //             opacity: 1,
      //             width: 3
      //         },
      //         label: {
      //             show: true,
      //             formatter: function (params) {
      //                 return echarts.format.formatTime('yyyy-MM-dd', params.value);
      //             },
      //             backgroundColor: '#004E52'
      //         },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
      //         handle: {
      //             show: true,
      //             color: 'transparent'
      //         }
      //     }
      // }
      // })
      // var timer = setInterval(()=>{
      //   if(a!=b){
      //       a+=10
      //       b-=10
      //      this.chart.setOption({dataZoom:_this.renderer.dataZoomSet(a,b)});
      //      console.log(a,b)
      //   }else{
      //     clearInterval(timer)
      //   }
      // },1000)
    },
    data() {
      return {
        acturalSchedule: true,
        plannedSchedule: false,
        chart: null,
        renderer: null
      };
    },
    methods: {
      reLoadChat() {
        this.chart.resize();
      },
      chartRender() {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.5)'
      });
        this.renderer.render(this.acturalSchedule, this.plannedSchedule);
        loading.close()
      },
    }
  };
</script>
