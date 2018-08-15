<template>
	<div class="chart-wp">
		<div ref="echartDiv" style="height:800px; width:100%"></div>
		<div class="marker" v-if="dialogData.show">
			<div class="center">
				<el-row class="mt20">
					<el-col :span="5" class="label">
						工序名称
					</el-col>
					<el-col :span="18">
						<!-- <el-input  placeholder="请输入项目开工日期" v-model="temData.startTime" clearable></el-input> -->
						<!-- <el-input v-model="dialogData.name" prefix-icon="" size="small" placeholder="请输入工序名称"></el-input> -->
						<el-input placeholder="请输入工序名称" v-model="dialogData.name.split('_')[0]" >
							<template slot="append">{{dialogData.nameFloor}}</template>
						</el-input>
					</el-col>
				</el-row>
				<el-row class="mt20">
					<el-col :span="5" class="label">
						节点序号
					</el-col>
					<el-col :span="18">
						<!-- <el-input  placeholder="请输入项目开工日期" v-model="temData.startTime" clearable></el-input> -->
						<el-input v-model="dialogData.index" prefix-icon="" size="small" placeholder="输入节点序号" :disabled="true"></el-input>
					</el-col>
				</el-row>
				<el-row class="mt20">
					<el-col :span="5" class="label">
						完成时间
					</el-col>
					<el-col :span="18">
						<el-date-picker v-model="dialogData.endTime" type="date" placeholder="选择日期">
						</el-date-picker>
					</el-col>
				</el-row>
				<div class="sub-btn">
					<ul>
						<li class="ml20" @click="dialogSubmit">确定</li>
						<li class="ml20" @click="dialogData.show = false">取消</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>
<style>
.marker .center .el-input__inner{
	border: 1px solid #dcdfe6 !important;
}
	.marker {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .5);
		z-index: 999;
	}
	.marker .center {
		width: 350px;
		height: 200px;
		background: #fff;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		box-shadow: 0px 18px 49px -30px rgba(88, 90, 89, 0.5);
		border-radius: 10px;
	}
	.el-input__icon {
		line-height: 30px;
	}
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
				plannedSchedule: true,
				chart: null,
				renderer: null,
				chartData: null,
				timer: null,
				timeStamp: {
					start: null,
					end: null,
					EndStamp: null,
					nowTime: '',
					judge: false //判断是否是暂停后开始
				},
				dialogData: {
					name: '',
					nameFloor:'',
					index: '',
					endTime: '',
					show: false,
					selectTaskData:''
				},
				ganttOrChartsData: ''
			};
		},
		methods: {
			DateDiff(sDate1, sDate2) { //sDate1和sDate2是2006-12-18格式    
				var aDate, oDate1, oDate2, iDays
				oDate1 = new Date(sDate1).getTime()
				oDate2 = new Date(sDate2).getTime()
				iDays = parseInt((oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数   
				return iDays
			},
			dialogSubmit() {
				let diff = this.DateDiff(this.dialogData.endTime,this.dialogData.selectTaskData.TaskEndTime)
				if(this.dialogData.name.indexOf('_') == -1 || this.dialogData.name.indexOf('F') == -1){
					this.dialogData.name = this.dialogData.name + '_F'
				}
				let obj = {
					diff,
					name:this.dialogData.name,
					selectTaskData:this.dialogData.selectTaskData
				}
				this.$emit('chartUpDate',obj)
			},
			initGanttDataToCharts(passData) {
				var _this = this
				passData ? passData = passData : passData = this.$props.ganttData
				console.log(passData)
				this.ganttOrChartsData = passData
				passData = passData.sort(function(a, b) {
					if (_this.initFloorNameToNubSort(a.TaskName) > _this.initFloorNameToNubSort(b.TaskName)) {
						return 1
					} else if (_this.initFloorNameToNubSort(a.TaskName) < _this.initFloorNameToNubSort(b.TaskName)) {
						return -1
					} else {
						return 0
					}
				})
				let dataNub = [],
					lastData = {
						planned: [],
						actural: []
					};
				passData.forEach(item => { //获取所有类型
					if (item.Category) {
						dataNub.push(item.Category)
					} else {
						dataNub.push(item.FlowSection)
					}
				});
				dataNub = [...new Set(dataNub)] //去重
				let initData = {
					Guid: "00000000-0000-0000-0000-000000000000",
					time: '',
					plannedTime: ''
				}
				dataNub.forEach((data, index) => {
					lastData.actural.push({
						business: data,
						color: null,
						schedule: []
					})
					lastData.planned.push({
						business: data,
						color: null,
						schedule: []
					})
					initData = {
						Guid: "00000000-0000-0000-0000-000000000000",
						time: '',
						plannedTime: ''
					}
					passData.forEach((item, index1) => {
						if (item.Category) {
							if (data == item.Category) {
								if (item.color) {
									lastData.actural[index].color = item.color
									lastData.planned[index].color = item.color
								} else {
									lastData.actural[index].color =  '#' + Math.floor(Math.random() * 0xffffff).toString(16);
									lastData.planned[index].color =  '#' + Math.floor(Math.random() * 0xffffff).toString(16);
								}
								if (initData.time == '') {
									initData.time = item.TaskStartTime
								}
								if (initData.plannedTime == '') {
									initData.plannedTime = item.TaskPlanStartTime
								}
								if ((typeof item.TaskStartTime != 'string') && item.TaskStartTime.constructor != String) {
									lastData.actural[index].schedule.push([item.TaskStartTime, this.initFloorNameToNub(item.TaskName), item.TaskID, 0, initData.Guid, item.TaskEndTime, lastData.actural[index].schedule.length * 1 + 1,item.Percentage])
									lastData.planned[index].schedule.push([item.TaskPlanStartTime, this.initFloorNameToNub(item.TaskName), item.TaskID, 0, initData.Guid, item.TaskPlanEndTime, lastData.planned[index].schedule.length * 1 + 1])
									initData.time = item.TaskStartTime
									initData.plannedTime = item.TaskPlanStartTime
								} else {
									lastData.actural[index].schedule.push([item.TaskStartTime.split('T')[0], this.initFloorNameToNub(item.TaskName), item.TaskID, 0, initData.Guid, item.TaskEndTime.split('T')[0], lastData.actural[index].schedule.length * 1 + 1,item.Percentage])
									lastData.planned[index].schedule.push([item.TaskPlanStartTime.split('T')[0], this.initFloorNameToNub(item.TaskName), item.TaskID, 0, initData.Guid, item.TaskPlanEndTime.split('T')[0], lastData.planned[index].schedule.length * 1 + 1])
									initData.time = item.TaskStartTime.split('T')[0]
									initData.plannedTime = item.TaskPlanStartTime.split('T')[0]
								}
								// if(lastData.schedule.length == 0){
								//     lastData.schedule.push([item.TaskStartTime,item.initFloorNameToNub(item.TaskName),item.TaskID,0,initData.Guid,item.TaskStartTime,lastData.schedule.length*1+1)
								// }else{
								//     lastData.schedule.push([item.TaskStartTime,item.initFloorNameToNub(item.TaskName),item.TaskID,0,initData.Guid,initData.time,lastData.schedule.length*1+1)
								// }
								initData.Guid = item.TaskID
							}
						} else {
							if (data == item.FlowSection) {
								if (item.color) {
									lastData.actural[index].color = item.color
									lastData.planned[index].color = item.color
								} else {
									lastData.actural[index].color =  '#' + Math.floor(Math.random() * 0xffffff).toString(16);
									lastData.planned[index].color =  '#' + Math.floor(Math.random() * 0xffffff).toString(16);
								}
								if (initData.time == '') {
									initData.time = item.TaskStartTime
								}
								if (initData.plannedTime == '') {
									initData.plannedTime = item.TaskPlanStartTime
								}
								if ((typeof item.TaskStartTime != 'string') && item.TaskStartTime.constructor != String) {
									lastData.actural[index].schedule.push([item.TaskStartTime, this.initFloorNameToNub(item.TaskName), item.TaskID, 0, initData.Guid, item.TaskEndTime, lastData.actural[index].schedule.length * 1 + 1,item.Percentage])
									lastData.planned[index].schedule.push([item.TaskPlanStartTime, this.initFloorNameToNub(item.TaskName), item.TaskID, 0, initData.Guid, item.TaskPlanEndTime, lastData.planned[index].schedule.length * 1 + 1])
									initData.time = item.TaskStartTime
									initData.plannedTime = item.TaskPlanStartTime
								} else {
									lastData.actural[index].schedule.push([item.TaskStartTime.split('T')[0], this.initFloorNameToNub(item.TaskName), item.TaskID, 0, initData.Guid, item.TaskEndTime.split('T')[0], lastData.actural[index].schedule.length * 1 + 1,item.Percentage])
									lastData.planned[index].schedule.push([item.TaskPlanStartTime.split('T')[0], this.initFloorNameToNub(item.TaskName), item.TaskID, 0, initData.Guid, item.TaskPlanEndTime.split('T')[0], lastData.planned[index].schedule.length * 1 + 1])
									initData.time = item.TaskStartTime.split('T')[0]
									initData.plannedTime = item.TaskPlanStartTime.split('T')[0]
								}
								// lastData.actural[index].schedule.push([item.TaskStartTime.split('T')[0],this.initFloorNameToNub(item.TaskName),item.TaskID,0,initData.Guid, item.TaskEndTime.split('T')[0],lastData[index].schedule.length*1+1])
								// if(lastData.schedule.length == 0){
								//     lastData.schedule.push([item.TaskStartTime,item.TaskName.split('_')[1].split('F')[0]*1],item.TaskID,0,initData.Guid,item.TaskStartTime,lastData.schedule.length*1+1)
								// }else{
								//     lastData.schedule.push([item.TaskStartTime,item.TaskName.split('_')[1].split('F')[0]*1],item.TaskID,0,initData.Guid,initData.time,lastData.schedule.length*1+1)
								// }
								initData.Guid = item.TaskID
								initData.time = item.TaskStartTime.split('T')[0]
								initData.plannedTime = item.TaskPlanStartTime.split('T')[0]
							}
						}
					})
				})
				lastData.actural.forEach((last, index) => {
					// last.schedule.reverse()
					last.schedule.forEach((sc, index1) => {
						if (index != 0) {
							sc[6] = index1 + 1
						} else if (sc[1] * 1 == -1) {
							sc[4] = '00000000-0000-0000-0000-000000000000'
						}
						if (index1 == last.schedule.length - 1) {
							if (sc[1] == -1) {
								last.schedule.push(
									[sc[5], sc[1] * 1 + 2, sc[2], sc[3], sc[4], sc[5], sc[6] + 1]
								)
							} else {
								last.schedule.push(
									[sc[5], sc[1] * 1 + 1, sc[2], sc[3], sc[4], sc[5], sc[6] + 1]
								)
							}
						}
					})
				})
				lastData.planned.forEach((last, index) => {
					// last.schedule.reverse()
					last.schedule.forEach((sc, index1) => {
						if (index != 0) {
							sc[6] = index1 + 1
						} else if (sc[1] * 1 == -1) {
							sc[4] = '00000000-0000-0000-0000-000000000000'
						}
						if (index1 == last.schedule.length - 1) {
							if (sc[1] == -1) {
								last.schedule.push(
									[sc[5], sc[1] * 1 + 2, sc[2], sc[3], sc[4], sc[5], sc[6] + 1]
								)
							} else {
								last.schedule.push(
									[sc[5], sc[1] * 1 + 1, sc[2], sc[3], sc[4], sc[5], sc[6] + 1]
								)
							}
						}
					})
				})
				console.log(lastData)
				this.chartData = lastData
				this.$emit('proportionUpData',lastData)
				return lastData
			},
			initFloorNameToNubSort(str) {
				return str.split('_')[1].split('F')[0] * 1
			},
			initFloorNameToNub(str) { //xxxx_1F => 1
				// return str.split('_')[1].split('F')[0]*1
				var a = str.split('_')[1].split('F')[0] * 1
				if (a == -1) {
					return -2
				} else if (a == 1) {
					return -1
				} else {
					return a - 1
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
				this.renderer.render(this.acturalSchedule, this.plannedSchedule, this.initGanttDataToCharts(data));
				loading.close()
			},
			chartAxPointerStart() {
				console.log(this.chartData)
				if (this.timeStamp.start == null) { //计算开始及结束时间 
					var timeArr = []
					this.chartData.actural.forEach(element => {
						element.schedule.forEach(s => {
							timeArr.push(s[0])
							timeArr.push(s[5])
						})
					});
					timeArr = [...new Set(timeArr)]
					timeArr.sort((a, b) => {
						a = new Date(a).getTime()
						b = new Date(b).getTime()
						if (a - b > 0) {
							return 1
						} else if (a - b < 0) {
							return -1
						} else {
							return 0
						}
					})
					this.timeStamp.start = timeArr[0]
					this.timeStamp.end = timeArr[timeArr.length - 1]
					this.timeStamp.EndStamp = new Date(timeArr[timeArr.length - 1]).getTime()
				}
				let date = null
				if (this.timeStamp.judge) {
					date = new Date(this.timeStamp.nowTime)
				} else {
					date = new Date(this.timeStamp.start)
				}
				this.timer = setInterval(() => {
					if (date.getTime() < this.timeStamp.EndStamp) {
						date.setDate(date.getDate() + 1)
						this.timeStamp.nowTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
						this.chart.setOption({
							xAxis: {
								axisPointer: this.renderer.axisPointer(this.timeStamp.nowTime)
							}
						});
					} else {
						clearInterval(this.timer)
						this.timeStamp.judge = false
					}
				}, 1000)
			},
			chartAxPointerStop() {
				if (this.timer != null) {
					clearInterval(this.timer)
					this.timeStamp.judge = true
				}
			}
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
			this.renderer.render(this.acturalSchedule, this.plannedSchedule, this.initGanttDataToCharts());
			loading.close()
			//节点点击事件
			this.chart.on('click', function(params) {
				console.log(params)
				var judgeArr = params.seriesId.split('')
				if (judgeArr[judgeArr.length -1] == 2) { //防止点击计划节点
					return false
				}
				
				for (let i = 0; i < _this.ganttOrChartsData.length; i++) {
					if (_this.ganttOrChartsData[i].TaskID == params.data[2]) {
						_this.dialogData.selectTaskData = _this.ganttOrChartsData[i]
						_this.dialogData.name = _this.ganttOrChartsData[i].TaskName
						_this.dialogData.nameFloor = _this.ganttOrChartsData[i].TaskName.split('_')[1]
						_this.dialogData.endTime = _this.ganttOrChartsData[i].TaskEndTime
						_this.dialogData.show = true
						break
					}
				}
				_this.dialogData.index = params.data[6]
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
			//   this.chartAxPointerStart()
			//   var a = 0
			//   var date = new Date()
			//   var timer = setInterval(()=>{
			//     date.setDate(date.getDate() + 1)
			//     let newDate =  date.getFullYear() + '-' + (date.getMonth() + 1) +'-'+ date.getDate()
			//     if(a < 10){
			//       a += 1
			//        this.chart.setOption({xAxis:{axisPointer:_this.renderer.axisPointer(newDate)}});
			//        console.log(newDate)
			//     }else{
			//       clearInterval(timer)
			//     }
			//   },1000)
		}
	};
</script>
