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
      ganttData: Array
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
      initGanttDataToCharts(passData){
        passData?passData = passData: passData = this.$props.ganttData
        let dataNub = [],lastData =[];
       passData.forEach(item => {//获取所有类型
            if(item.Category){
                dataNub.push(item.Category)
            }else{
              dataNub.push(item.FlowSection)
            }
            
        });
        dataNub = [...new Set(dataNub)] //去重
        let initData = {
          Guid:"00000000-0000-0000-0000-000000000000",
          time:''
        }
        
        dataNub.forEach((data,index)=>{
            lastData.push({
              business:data,
              color:null,
              schedule:[]

            })
            initData = {
          Guid:"00000000-0000-0000-0000-000000000000",
          time:''
        }
            passData.forEach((item,index1)=>{
              if(item.Category){
                  if(data == item.Category){
                      if(item.color){
                        lastData[index].color = item.color
                      }else{
                        lastData[index].color =  '#'+Math.floor(Math.random()*0xffffff).toString(16);
                      }
                    
                      if(initData.time == ''){
                        initData.time = item.TaskStartTime
                      }
                      
                      lastData[index].schedule.push([item.TaskEndTime.split('T')[0],this.initFloorNameToNub(item.TaskName),item.TaskID,0,initData.Guid, item.TaskStartTime.split('T')[0],lastData[index].schedule.length*1+1])
                      // if(lastData.schedule.length == 0){
                      //     lastData.schedule.push([item.TaskStartTime,item.initFloorNameToNub(item.TaskName),item.TaskID,0,initData.Guid,item.TaskStartTime,lastData.schedule.length*1+1)
                      // }else{
                      //     lastData.schedule.push([item.TaskStartTime,item.initFloorNameToNub(item.TaskName),item.TaskID,0,initData.Guid,initData.time,lastData.schedule.length*1+1)
                      // }
                      initData.Guid = item.TaskID
                      initData.time = item.TaskStartTime.split('T')[0]
                      
                  }
              }else{
                if(data == item.FlowSection){
                      if(item.color){
                        lastData[index].color = item.color
                      }else{
                        lastData[index].color =  '#'+Math.floor(Math.random()*0xffffff).toString(16);
                      }
                    
                      if(initData.time == ''){
                        initData.time = item.TaskStartTime
                      }
                      lastData[index].schedule.push([item.TaskEndTime.split('T')[0],this.initFloorNameToNub(item.TaskName),item.TaskID,0,initData.Guid,item.TaskStartTime.split('T')[0],lastData[index].schedule.length*1+1])
                      // if(lastData.schedule.length == 0){
                      //     lastData.schedule.push([item.TaskStartTime,item.TaskName.split('_')[1].split('F')[0]*1],item.TaskID,0,initData.Guid,item.TaskStartTime,lastData.schedule.length*1+1)
                      // }else{
                      //     lastData.schedule.push([item.TaskStartTime,item.TaskName.split('_')[1].split('F')[0]*1],item.TaskID,0,initData.Guid,initData.time,lastData.schedule.length*1+1)
                      // }
                      initData.Guid = item.TaskID
                      initData.time = item.TaskStartTime.split('T')[0]
                      
                  }
              }
              
            })
        })
        lastData.forEach((last,index)=>{
          // last.schedule.reverse()
            last.schedule.forEach((sc,index1)=>{
              if(index != 0){
                 sc[6] = index1 + 1
              }else if(sc[1] * 1  == -1){
                sc[4] = '00000000-0000-0000-0000-000000000000'
              }
              
            })
        })
        console.log(lastData)
        return lastData
        
      },
      initFloorNameToNub(str){//xxxx_1F => 1
          // return str.split('_')[1].split('F')[0]*1
          var a =  str.split('_')[1].split('F')[0]*1
          if(a == -1) {
            return -2
          }else if(a == 1){
            return -1
          }else{
            return a -1
          }
      },
      reLoadChat() {
        this.chart.resize();
      },
      chartRender(data) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.5)'
      });
      
        this.renderer.render(this.acturalSchedule, this.plannedSchedule,this.initGanttDataToCharts(data));
        loading.close()
      },
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
      this.renderer.render(this.acturalSchedule, this.plannedSchedule,this.initGanttDataToCharts());
      loading.close()
      //节点点击事件
       this.chart.on('click', function (params) {
          // window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(params.name));
          // alert('节点被电击了')
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
    }
  };
</script>
