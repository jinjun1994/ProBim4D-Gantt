import modelApi from './modelMock.js'

// var acturalScheduleUrl
let createPlannedArrowRenderItem = (data, color) => {
  let _data = data;
  let arrowSize = 15;
  return (params, api) => {
    var point = api.coord([
      api.value(0),
      api.value(1)
    ]);
    var middlePoint = point;
    var dataIndex = params.dataIndex;
    var preDataIndex = dataIndex - 1;
    var gap = 0;
    var graphics = [];
    if (dataIndex > 0) {
      var prePoint = api.coord([_data[preDataIndex][0], _data[preDataIndex][1]]);
      middlePoint = [(point[0] + prePoint[0]) / 2, point[1]];
      gap = point[0] - prePoint[0];

    }

    gap > 1 && (graphics = graphics.concat([{
        type: 'path',
        shape: {
          pathData: 'M-256 0 1024 512 -256 1024Z',
          x: -arrowSize - 8,
          y: -arrowSize / 2,
          width: arrowSize,
          height: arrowSize
        },
        position: point,

        style: api.style({
          stroke: color,
          fill: color,
          lineWidth: 1,
        })
      },
    ]));
    if (params.dataIndexInside === 0) {
      return null;
    }

    return {
      type: 'group',
      children: graphics.concat([{
        type: 'text',
        style: {
          text: api.value(1) + 'F',
          textFont: api.font({
            fontSize: 14
          }),
          textAlign: 'center',
          textVerticalAlign: 'bottom'
        },
        position: middlePoint
      }])
    };
  };
}

let createArrowRenderItem = (data, color) => {
  let key_data = {};
  let key_index = {};
  data.forEach(x => {
    key_data[x[2]] = {
      startData: x[5],
      endData: x[0],
      floor: x[1],
      parentId: x[4],
      Id: x[2]
    }
    if (!key_index[x[4]])
      key_index[x[4]] = [];
    key_index[x[4]].push(x[2]);
  });
  let _data = data;
  let arrowSize = 15;
  let radius = 10;
  return (params, api) => {
    let dataIndex = params.dataIndex;
    let preDataIndex = dataIndex - 1;
    let postDataIndex = dataIndex + 1;
    let preData = preDataIndex > -1 ? _data[preDataIndex] : null;
    let postData = postDataIndex < _data.length ? _data[postDataIndex] : null;
     let prePoint = preData && api.coord([preData[0], preData[1]]);
    // let prePoint = key_data[_data[dataIndex][4]];
    let postPoint = postData && api.coord([postData[0], postData[1]]);
    let postPointIds = key_index[_data[dataIndex][2]];
    let postPoints = postPointIds && postPointIds.map(x => {
      return api.coord([key_data[x].endData, key_data[x].floor]);
    })
    let point = api.coord([_data[dataIndex][0], _data[dataIndex][1]]);
    let startDatePoint = api.coord([_data[dataIndex][5], _data[dataIndex][1]]);
    let graphics = [];
   
    graphics.push({
      type: 'circle',
      position: point,
      shape: {
        r: radius
      },
      style: {
        stroke: color,
        fill: '#fff'
      }
    });
      graphics = graphics.concat([{
        type: 'text',
        position: point,
        style: {
          text: _data[dataIndex][6],
          textAlign: 'center',
          textVerticalAlign: 'center'
        }
      }, {
        type: 'path',
        shape: {
          pathData: 'M-256 0 1024 512 -256 1024Z',
          //pathData: 'M1024 0 512 -512 0 0Z',
          x: -arrowSize - 8,
          y: arrowSize/2 -14 ,
          width: arrowSize,
          height: arrowSize
        },
        position: point,
        style: api.style({
          stroke: color,
          fill: color,
          lineWidth: 1,
        })
      },
    ])
      
   
    return {
      type: 'group',
      children: graphics
      
    }


  }
}

let getDateRange = (array = []) => {
  let result = [];
  let max = new Date()
  let min = new Date();
  array.map(function (data) {
    data.data.map(function (d) {
      let date = new Date(d[0]);
      if (min > date) min = date;
      if (max < date) max = date;
    })
  })

  for (let date = min; date < max; date = date) {
    result.push(date.toLocaleDateString().replace(/\//g, '-'));
    date.setTime(date.getTime() + 3600 * 24 * 1000);
  }
  return result;
}

class scheduleRenderer {

  constructor(chart) {
    this.chart = chart;
  }

  dataZoomSet(startVal, endVal) {
    if (startVal && endVal) {
      return [{
          type: 'inside',
          xAxisIndex: [0],
          //minSpan: 5,
          start: startVal, //数据窗口范围的起始百分比,表示30%  
          end: endVal, //数据窗口范围的结束百分比,表示70%  
          startValue: 10, //数据窗口范围的起始数值  
          endValue: 20,
        },
        {
          type: 'slider',
          xAxisIndex: [0],
          // minValueSpan: 1000 * 3600 * 24,
          height: 20,
          bottom: 50,
          // handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '120%',
        }
      ]
    } else {
      return [{
          type: 'inside',
          xAxisIndex: 0,
          //minSpan: 5,
          start: 0, //数据窗口范围的起始百分比,表示30%  
          end: 100, //数据窗口范围的结束百分比,表示70%  
          startValue: 10, //数据窗口范围的起始数值                   
          endValue: 20,
        },
        {
          type: 'slider',
          xAxisIndex: 0,
          // minValueSpan: 1000 * 3600 * 24,
          height: 20,
          bottom: 0,
          // handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '120%',

        }
      ]
    }

  }
  
  axisPointer(time,hideMaker){
    time?time: time = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) +'-'+ new Date().getDate()
    if(hideMaker){
      return {lineStyle:{
        opacity:0
      }}
    }
   return { value: time,
            snap: true,
            lineStyle: {
                color: 'red',
                opacity: 1,
                width: 2
            },
            label: {
                show: true,
                formatter: function (params) {
                    var date = new Date(params.value)
                    return `${date.getFullYear()} - ${date.getMonth() +1} - ${date.getDate()}`
                },
                backgroundColor: '#004E52'
            },
            handle: {
                show: true,
                color: 'transparent'
            }
        }
  }
  
  async getPlannedScheduleAsync(ganttData) {
    var a = [];
    let response = ganttData
    console.log(response)
    this.plannedSchedule = [];
    response.forEach(d => {
      let schedule = [];
      d.schedule.forEach(s => {
        let groupIndex = s[3];
        if (!schedule[groupIndex])
          schedule[groupIndex] = [];
        schedule[groupIndex].push(s);
      })
      this.plannedSchedule = this.plannedSchedule.concat(schedule.map(s => {
        return {
          business: d.business,
          color: d.color,
          schedule: s
        }
      }));
    })
  }

  async getActuralScheduleAsync(ganttData) {
    var a = [];
    // let response = await this.getActuralSchedule();
    let response = ganttData
    this.acturalLinkedSchedule = response;

    this.acturalSchedule = [];
    response.forEach(d => {
      let schedule = [];
      d.schedule.forEach(s => {
        let groupIndex = s[3];
        if (!schedule[groupIndex])
          schedule[groupIndex] = [];
        schedule[groupIndex].push(s);
      })
      this.acturalSchedule = this.acturalSchedule.concat(schedule.map(s => {
        return {
          business: d.business,
          color: d.color,
          schedule: s
        }
      }));
    })
  }

  async render(actural, planned,ganttData) {
    actural = actural || false;
    planned = planned || false;
    let legend_data = [];
    let series = [];
    let xAxisData = [];
    let legendColor = []
    if (actural) {
      let response = await this.createActuralSeries(ganttData.actural);
      response[1].forEach(item => {
        if (item.color) legendColor.push(item.color)
      })
      legend_data = legend_data.concat(response[0]);
      series = series.concat(response[1]);
      xAxisData = getDateRange(response[1]);
    }
    if (planned) {
      let response = await this.createPlannedSeries(ganttData.planned);
      console.log(response)
      response[1].forEach(item => {
        if (item.color) legendColor.push(item.color)
      })  
      legend_data = legend_data.concat(response[0]);
      series = series.concat(response[1]);
    }
    let _this = this
    var options = {
      tooltip: {
        trigger: 'axis',
        triggerOn:'none',
        position: function (pt) {
          return [pt[0]+30, '10%'];
        },
        axisPointer: {
          type: 'cross',
          snap: true
        },
        formatter:function(params){
          function arrUnique(arr,field){
            var map = {};
            var res = [];
            for (var i = 0; i < arr.length; i++) {
                if (!map[arr[i][field][2]]) {
                    map[arr[i][field][2]]=1;
                    res.push(arr[i]);
                }
            }
              return res;
          }
          
          let newList = arrUnique(params,'data')
          let res = `${params[0].data[0]}`
          newList.forEach(list=>{
            res+=`<br/><span style="width:10px;border-radius:50%;background-color:${list.color};height:10px;display:inline-block;margin-right:5px;"></span>${list.seriesName}:${list.data[1]}`
          })
          return res
        }
      },
        toolbox: {
          feature: {
              saveAsImage: {}
          }
      },

      grid: {
        y: 30,
        x2: 50,
        left: '3%'
      },
      color: legendColor,
      legend: {
        data: legend_data,
        orient: 'horizontal', //垂直显示
        y: 'top', //延Y轴居中
        x: 'center' //居右显示
      },
      xAxis: {
        type: 'time',
        name: '',//x轴文字
        nameRotate: 45,
        axisPointer: this.axisPointer(null,false),
        splitLine: {
            show: true
        }
      },
      dataZoom: this.dataZoomSet(),
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        max: 34,
        min: -3,
        axisLabel:{
          formatter: function (value) {
            if(value<= 0){
              return value
            }else{
              return value + 'F'
            }

          }
              
        },
        scale: true,
        interval: 1,
        splitLine: {
          show: true,
          interval: 1
        }
      },
      series: series
    }
    this.chart.clear()
    this.chart.setOption(options, true);
  }

  async createActuralSeries(ganttData) {
    await this.getActuralScheduleAsync(ganttData);
    let data = this.acturalSchedule;
    let legend_data = [];
    let series = [];
    data.forEach((schedule,index) => {
          series.push({
          z: 0,
          name: schedule.business,
          type: 'line',
          lineStyle: {
            color: schedule.color,
            type: 'solid',
            opacity: 1,
            lineWidth: 2
          },
          data: schedule.schedule,
          step: 'start'})
      
    });
    this.acturalLinkedSchedule = this.acturalLinkedSchedule
    this.acturalLinkedSchedule.forEach((schedule) => {
      legend_data.push(schedule.business);
      series.push({
        name: schedule.business,
        type: 'custom',
        color: schedule.color,
        renderItem: createArrowRenderItem(schedule.schedule, schedule.color),
        data: schedule.schedule,
        z: 10,
      });
    })
    return [legend_data, series];
  }

  async createPlannedSeries(ganttData) {
    await this.getPlannedScheduleAsync(ganttData);
    console.log(this.plannedSchedule)
    let data = this.plannedSchedule;
    let legend_data = [];
    let series = [];
    data.forEach(schedule => {
      legend_data.push(schedule.business);
      series.push({
        name: schedule.business,
        type: 'line',
        step: 'start',
        lineStyle: {
          type: 'dashed',
          opacity: 0.7,
          color: schedule.color
        },
        data: schedule.schedule
      })
      series.push({
        color: schedule.color,
        name: schedule.business,
        type: 'custom',
        renderItem: createPlannedArrowRenderItem(schedule.schedule, schedule.color),
        data: schedule.schedule,
        z: 10,
        smooth: false,
        itemStyle: {
          opacity: 0.7,
          normal: {
            width: 2,
            type: 'dashed'
          }
        },
      })
    });
    console.log(legend_data, series)
    return [legend_data, series];
  }

}
export default {
  scheduleRenderer
}
// module.exports =;
