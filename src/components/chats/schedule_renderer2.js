let plannedScheduleUrl = '/api/Schedule?projectId=0';
// var acturalScheduleUrl = `${window.urlConfig}/api/Prj/GetScheduleTask?ProjectID=${window.ProjectID}&ModelID=${window.ModelID}&ScheduleID=${window.ScheduleID}&&IsGantt=true`

// var acturalScheduleUrl
import axios from 'axios'
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
      {
        type: 'circle',
        z: 10,
        shape: {
          cx: 0,
          cy: 0,
          r: 10
        },
        position: point,
        style: {
          fill: '#fff',
          stroke: color,
        },
      },
      {
        type: 'text',
        position: point,
        style: {
          text: '101',
          textAlign: 'center',
          textVerticalAlign: 'center'
        }
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
    // let prePoint = preData && api.coord([preData[0], preData[1]]);
    let prePoint = key_data[_data[dataIndex][4]];
    let postPoint = postData && api.coord([postData[0], postData[1]]);
    let postPointIds = key_index[_data[dataIndex][2]];
    let postPoints = postPointIds && postPointIds.map(x => {
      return api.coord([key_data[x].endData, key_data[x].floor]);
    })
    let point = api.coord([_data[dataIndex][0], _data[dataIndex][1]]);
    let startDatePoint = api.coord([_data[dataIndex][5], _data[dataIndex][1]]);
    let graphics = [];
    // if (postPoint) {
    // postPoints && postPoints.forEach((x,index) =>
    //   graphics.push({
    //     type: 'line',
    //     position: point,
    //     shape: {
    //        y1: x[1] - point[1]
    //     },
    //     style: {
    //       stroke: color,
    //       lineWidth: 2
    //     },
    //   }));
    //   graphics.push({
    //     type:'line',
    //     position:point,
    //     shape:{
    //       x1:startDatePoint[0] -point[0]
    //     },
    //     style:{
    //       stroke:color,
    //       lineWidth:2
    //     }
    //   })
    
    // }
   
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
          //pathData: 'M-256 0 1024 512 -256 1024Z',
          pathData: 'M1024 0 512 -512 0 0Z',
          x: -arrowSize+8,
          y: arrowSize/2 -1,
          width: arrowSize,
          height: arrowSize
        },
        position: point,
        style: api.style({
          stroke: color,
          fill: color,
          lineWidth: 1,
        })
      }])
      
   
    return {
      type: 'group',
      children: graphics
    }


  }
}

let getDateRange = (array = []) => {
  let result = [];
  // array.map(function (data) {
  //     data.data.map(function (d) {
  //         let date = d[0];
  //         if (!result.includes(date))
  //             result.push(date);
  //     })
  // });
  // result.sort(function (a, b) {
  //     let date_a = new Date(a),
  //         date_b = new Date(b);
  //     return date_a - date_b;

  // })
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

  async getPlannedScheduleAsync() {
    var a = [];
    let response = await this.getPlannedSchedule();
    console.log(response)
    this.plannedSchedule = [];
    response.date.forEach(d => {
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

  getPlannedSchedule() {
    // var plannedScheduleUrl = `${window.urlConfig}/api/Prj/GetScheduleTask?ProjectID=${window.ProjectID}&ModelID=${window.ModelID}&ScheduleID=${window.ScheduleID}&&IsGantt=false`
    return new Promise(resolve => {
      axios.get(plannedScheduleUrl).then(x => {
        console.log(x.data)
        resolve(x.data)
      })
      // $.get(plannedScheduleUrl).done(
      //     x => {
      //         resolve(x)
      //     }
      // )
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

  // getActuralSchedule() {
  //   var acturalScheduleUrl = `${window.urlConfig}/api/Prj/GetScheduleTask?ProjectID=${window.ProjectID}&ModelID=${window.ModelID}&ScheduleID=${window.ScheduleID}&&IsGantt=false`
  //   //  var acturalScheduleUrl = `https://bimcomposer.probim.cn/api/Prj/GetScheduleTask?ProjectID=d975e1ea-7128-ceed-ac77-4a28d3bfd472&ModelID=7625a0b0-ae55-4131-843c-c791f93ff496&ScheduleID=609ec1fd-d973-4c71-a56a-8c7a8cc7d8f5&&IsGantt=false`
  //   return new Promise(resolve => {
  //     axios.get(acturalScheduleUrl).then(x => {
  //       console.log(x)
  //       resolve(x.data)
  //     })
  //   })

  // }

  async render(actural, planned,ganttData) {
    actural = actural || false;
    planned = planned || false;
    let legend_data = [];
    let series = [];
    let xAxisData = [];
    let legendColor = []
    if (actural) {
      let response = await this.createActuralSeries(ganttData);
      response[1].forEach(item => {
        if (item.color) legendColor.push(item.color)
      })
      legend_data = legend_data.concat(response[0]);
      series = series.concat(response[1]);
      xAxisData = getDateRange(response[1]);
    }
    if (planned) {
      let response = await this.createPlannedSeries();
      console.log(response)
      response[1].forEach(item => {
        if (item.color) legendColor.push(item.color)
      })
      legend_data = legend_data.concat(response[0]);
      series = series.concat(response[1]);
    }
    var options = {
      tooltip: {
        trigger: 'item',
        position: function (pt) {
          return [pt[0], '10%'];
        },
        axisPointer: {
          type: 'cross',
          snap: true
        }
      },
      //   toolbox: {
      //     feature: {
      //         saveAsImage: {}
      //     }
      // },

      grid: {
        y: 20,
        x2: 50,
      },
      color: legendColor,
      legend: {
        data: legend_data,
        orient: 'vertical', //垂直显示
        y: 'center', //延Y轴居中
        x: 'left' //居右显示
      },
      xAxis: {
        type: 'time',
        name: '开始施工',
        nameRotate: 45,
        splitLine: {
          interval: () => true,
          show: true
        },
        // axisPointer: {
        //     value: '2018-7-8',
        //     snap: true,
        //     lineStyle: {
        //         color: 'red',
        //         opacity: 1,
        //         width: 1
        //     },
        //     label: {
        //         show: true,
        //         formatter: function (params) {
        //             var date = new Date(params.value)
        //             return `${date.getFullYear()} - ${date.getMonth() +1} - ${date.getDate()}`
        //         },
        //         backgroundColor: '#004E52'
        //     },
        //     handle: {
        //         show: true,
        //         color: 'transparent'
        //     }
        // },
        // splitLine: {
        //     show: false
        // }
      },
      dataZoom: this.dataZoomSet(),
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        max: 33,
        min: -2,
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
      if(index == 0){
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
          step: 'start'
        })
      }else{
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
          step: 'end'
        })
      }
      
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

  async createPlannedSeries() {
    await this.getPlannedScheduleAsync();
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
