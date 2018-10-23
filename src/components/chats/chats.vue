<template>
	<div class="chart-wp">
		<div class="table-wp">
			<h1>{{reportFormDataTitle}} <span>{{tableTitleDate}}</span></h1>
			<div class="right">
				<el-table style="max-height=200" border :data="tableData">
					<el-table-column fixed prop="procedure" label="工序">
					</el-table-column>
					<el-table-column label="计划">
						<el-table-column prop="plan1" label="层数">
						</el-table-column>
						<el-table-column prop="plan2" label="进度">
						</el-table-column>
					</el-table-column>
					<el-table-column label="实际">
						<el-table-column prop="Actual1" label="层数">
						</el-table-column>
						<el-table-column prop="Actual2" label="进度">
						</el-table-column>
					</el-table-column>
					<el-table-column prop="state" label="状态">
					</el-table-column>
				</el-table>
			</div>
		</div>
		<div ref="echartDiv" style="flex:1;"></div>
		<div class="marker" v-if="dialogData.show">
			<div class="center">
				<el-row class="mt20">
					<el-col :span="5" class="label">
						工序名称
					</el-col>
					<el-col :span="18">
						<!-- <el-input  placeholder="请输入项目开工日期" v-model="temData.startTime" clearable></el-input> -->
						<!-- <el-input v-model="dialogData.name" prefix-icon="" size="small" placeholder="请输入工序名称"></el-input> -->
						<el-input placeholder="请输入工序名称" v-model="dialogData.name.split('_')[0]">
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
	.table-wp h1 span {
		font-size: 14px;
		color: #666;
		margin-left: 10px;
	}
	.table-wp .el-table td,
	.table-wp .el-table th {
		padding: 0;
	}
	.table-wp {
		height: 200px;
		overflow: auto;
		width: 100%;
		padding: 0 20px 20px;
		;
	}
	.table-wp h1 {
		font-size: 16px;
		line-height: 30px;
	}
	.marker .center .el-input__inner {
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
	.marker .center .el-date-editor.el-input {
		width: 100%
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
	.marker .center .el-input__icon {
		line-height: 30px;
	}
</style>
<script>
	let echarts = require("echarts");
	export default {
		props: {
			ganttData: Array,
			timerNumber: Number,
			show3d: Boolean,
			reportFormDataTitle: String
		},
		data() {
			return {
				tableTitleDate: '',
				tableData: [],
				acturalSchedule: true,
				plannedSchedule: true,
				chart: null,
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
					nameFloor: '',
					index: '',
					endTime: '',
					show: false,
					selectTaskData: ''
				},
				ganttOrChartsData: '',
				dataZoomDate: {
					startTime: '',
					endTime: ""
				},
				setModelTimer:null,
				dragDataJudge:''
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
				let diff = this.DateDiff(this.dialogData.endTime, this.dialogData.selectTaskData.TaskEndTime)
				if (this.dialogData.name.indexOf('_') == -1 || this.dialogData.name.indexOf('F') == -1) {
					this.dialogData.name = this.dialogData.name + '_F'
				}
				let obj = {
					diff,
					name: this.dialogData.name,
					selectTaskData: this.dialogData.selectTaskData
				}
				this.$emit('chartUpDate', obj)
			},
			initGanttDataToCharts(passData) {
				var _this = this
				passData ? passData = passData : passData = this.$props.ganttData
				this.ganttOrChartsData = passData
				//  passData = passData.sort((a,b)=>{return a.TaskOrder - b.TaskOrder})
				// passData = passData.sort(function(a, b) {
				// 	if (a.TaskOrder > a.TaskOrder) {
				// 		return 1
				// 	} else if (a.TaskOrder < a.TaskOrder) {
				// 		return -1
				// 	} else {
				// 		return 0
				// 	}
				// })
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
					for (let i = 0; i < passData.length; i++) {
						if (passData[i].Category) {
							if (data == passData[i].Category) {
								if (passData[i].color) {
									lastData.actural[index].color = passData[i].color
									lastData.planned[index].color = passData[i].color
								} else {
									lastData.actural[index].color =  '#' + Math.floor(Math.random() * 0xffffff).toString(16);
									lastData.planned[index].color =  '#' + Math.floor(Math.random() * 0xffffff).toString(16);
								}
								if (initData.time == '') {
									initData.time = passData[i].TaskStartTime
								}
								if (initData.plannedTime == '') {
									initData.plannedTime = passData[i].TaskPlanStartTime
								}
								if ((typeof passData[i].TaskStartTime != 'string') && passData[i].TaskStartTime.constructor != String) {
									lastData.actural[index].schedule.push([this.formsetDate(passData[i].TaskStartTime), this.initFloorNameToNub(passData[i].TaskOrder, lastData.actural[index].schedule.length), passData[i].TaskID, 0, initData.Guid, this.formsetDate(passData[i].TaskEndTime), lastData.actural[index].schedule.length * 1 + 1, passData[i].Percentage])
									lastData.planned[index].schedule.push([this.formsetDate(passData[i].TaskPlanStartTime), this.initFloorNameToNub(passData[i].TaskOrder, lastData.planned[index].schedule.length), passData[i].TaskID, 0, initData.Guid, this.formsetDate(passData[i].TaskPlanEndTime), lastData.planned[index].schedule.length * 1 + 1])
									initData.time = passData[i].TaskStartTime
									initData.plannedTime = passData[i].TaskPlanStartTime
								} else {
									lastData.actural[index].schedule.push([this.formsetDate(passData[i].TaskStartTime), this.initFloorNameToNub(passData[i].TaskOrder, lastData.actural[index].schedule.length), passData[i].TaskID, 0, initData.Guid, this.formsetDate(passData[i].TaskEndTime), lastData.actural[index].schedule.length * 1 + 1, passData[i].Percentage])
									lastData.planned[index].schedule.push([this.formsetDate(passData[i].TaskPlanStartTime), this.initFloorNameToNub(passData[i].TaskOrder, lastData.planned[index].schedule.length), passData[i].TaskID, 0, initData.Guid, this.formsetDate(passData[i].TaskPlanEndTime), lastData.planned[index].schedule.length * 1 + 1])
									initData.time = passData[i].TaskStartTime
									initData.plannedTime = passData[i].TaskPlanStartTime
								}
								initData.Guid = passData[i].TaskID
							}
						} else {
							if (data == passData[i].FlowSection) {
								if (passData[i].color) {
									lastData.actural[index].color = passData[i].color
									lastData.planned[index].color = passData[i].color
								} else {
									break
									lastData.actural[index].color =  '#' + Math.floor(Math.random() * 0xffffff).toString(16);
									lastData.planned[index].color =  '#' + Math.floor(Math.random() * 0xffffff).toString(16);
								}
								if (initData.time == '') {
									initData.time = passData[i].TaskStartTime
								}
								if (initData.plannedTime == '') {
									initData.plannedTime = passData[i].TaskPlanStartTime
								}
								if ((typeof passData[i].TaskStartTime != 'string') && passData[i].TaskStartTime.constructor != String) {
									lastData.actural[index].schedule.push([this.formsetDate(passData[i].TaskStartTime), this.initFloorNameToNub(passData[i].TaskOrder, lastData.actural[index].schedule.length), passData[i].TaskID, 0, initData.Guid, this.formsetDate(passData[i].TaskEndTime), lastData.actural[index].schedule.length * 1 + 1, passData[i].Percentage])
									lastData.planned[index].schedule.push([this.formsetDate(passData[i].TaskPlanStartTime), this.initFloorNameToNub(passData[i].TaskOrder, lastData.planned[index].schedule.length), passData[i].TaskID, 0, initData.Guid, this.formsetDate(passData[i].TaskPlanEndTime), lastData.planned[index].schedule.length * 1 + 1])
									initData.time = passData[i].TaskStartTime
									initData.plannedTime = passData[i].TaskPlanStartTime
								} else {
									lastData.actural[index].schedule.push([this.formsetDate(passData[i].TaskStartTime), this.initFloorNameToNub(passData[i].TaskOrder, lastData.actural[index].schedule.length), passData[i].TaskID, 0, initData.Guid, this.formsetDate(passData[i].TaskEndTime), lastData.actural[index].schedule.length * 1 + 1, passData[i].Percentage])
									lastData.planned[index].schedule.push([this.formsetDate(passData[i].TaskPlanStartTime), this.initFloorNameToNub(passData[i].TaskOrder, lastData.planned[index].schedule.length), passData[i].TaskID, 0, initData.Guid, this.formsetDate(passData[i].TaskPlanEndTime), lastData.planned[index].schedule.length * 1 + 1])
									initData.time = passData[i].TaskStartTime
									initData.plannedTime = passData[i].TaskPlanStartTime
								}
								// lastData.actural[index].schedule.push([item.TaskStartTime.split('T')[0],this.initFloorNameToNub(item.TaskName),item.TaskID,0,initData.Guid, item.TaskEndTime.split('T')[0],lastData[index].schedule.length*1+1])
								// if(lastData.schedule.length == 0){
								//     lastData.schedule.push([item.TaskStartTime,item.TaskName.split('_')[1].split('F')[0]*1],item.TaskID,0,initData.Guid,item.TaskStartTime,lastData.schedule.length*1+1)
								// }else{
								//     lastData.schedule.push([item.TaskStartTime,item.TaskName.split('_')[1].split('F')[0]*1],item.TaskID,0,initData.Guid,initData.time,lastData.schedule.length*1+1)
								// }
								initData.Guid = passData[i].TaskID
								initData.time = passData[i].TaskStartTime.split('T')[0]
								initData.plannedTime = passData[i].TaskPlanStartTime.split('T')[0]
							}
						}
					}
					// passData.forEach((item, index1) => {
					// })
				})
				lastData.actural.forEach((last, index) => {
					// last.schedule.sort((a,b)=>{
					// 	return a[1] -b[1]
					// })
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
					// last.schedule.sort((a,b)=>{
					// 	return a[1] -b[1]
					// })
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
				this.chartData = lastData
				this.$emit('proportionUpData', lastData)
				return lastData
			},
			// initFloorNameToNubSort(str) {
			// 	return str.split('_')[1].split('F')[0] * 1
			// },
			initFloorNameToNub(nub, index) { //xxxx_1F => 1
				// return str.split('_')[1].split('F')[0]*1
				// var a = str.split('_')[1].split('F')[0] * 1
				if (nub === -1) {
					return -1
				} else if (nub === 1) {
					return -1
				} else {
					if (index == 0) {
						return nub
					}
					return nub - 1
				}
			},
			reLoadChat() {
				setTimeout(() => {
					this.chart.resize();
				}, 220);
			},
			chartRender(data) {
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.5)'
				});
				this.render(this.acturalSchedule, this.plannedSchedule, this.initGanttDataToCharts(data));
				loading.close()
			},
			formsetDate(date) {
				if (date instanceof Date) {
					return date
				} else {
					return date.split('T')[0]
				}
			},
			chartAxPointerStart() {
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
			
				let arr = this.dateArrToAll([this.timeStamp.start, this.timeStamp.end])
				//对接模型api
				if (window.parent.BIMe) {
					window.parent.BIMe.control.BIMeHide.hideElementByElementId(window.parent.BIMe.modelData.BIMeElementData.getAllElementIds()) //隐藏所有构件
					window.parent.BIMe.control.BIMeUtility.resetElementColor(this.dragDataJudge)
				}
				this.timer = setInterval(() => {
					if (date.getTime() < this.timeStamp.EndStamp) {
						let newArr = []
						date.setDate(date.getDate() + 1)
<<<<<<< HEAD
						this.formatTableData(date,false,false)
						this.$props.ganttData.forEach(g => {
							if (new Date(this.dateInit(g.TaskStartTime)).getTime() == new Date(this.dateInit(date)).getTime()) {
								if (window.parent.BIMe) {
=======
						this.$props.ganttData.forEach(g=>{
							if(new Date(this.dateInit(g.TaskStartTime)).getTime() == new Date(this.dateInit(date)).getTime()){
								console.log(g)
								if(window.parent.BIMe){
>>>>>>> 5ef9773a8d03da77cce514a06ddbaedf7d79f7f7
									let a = g.ElementIDS.split(',')
									let b = []
									a.forEach(element => {
										b.push(
											window.ModelID + '^' + element
										)
									});
									let color = this.colorRbg(g.Color)
									color = color.split('RGB')[1].split('(')[1].split(')')[0].split(',')
<<<<<<< HEAD
									window.parent.BIMe.control.BIMeUtility.setElementColor(b, color[0], color[1], color[2], .4)
=======
									window.parent.BIMe.control.BIMeUtility.setElementColor(b,color[0],color[1],color[2],1)

>>>>>>> 5ef9773a8d03da77cce514a06ddbaedf7d79f7f7
								}
							}
							if (window.parent.BIMe) {
								if (new Date(this.dateInit(g.TaskEndTime)).getTime() == new Date(this.dateInit(date)).getTime()) {
									let a = g.ElementIDS.split(',')
									let b = []
									a.forEach(element => {
										b.push(
											window.ModelID + '^' + element
										)
									});
									window.parent.BIMe.control.BIMeUtility.resetElementColor(b)
            						window.parent.BIMe.control.BIMeHide.removeHideElementByElementId(b);
								}
							}
							if (this.isDateBetween(new Date(this.dateInit(date)), g.TaskStartTime, g.TaskEndTime)) {
								newArr.push(g.TaskName)
							}
						})
						this.$emit('upDataMockDetail', {
							date: date,
							taskName: newArr
						})
						this.timeStamp.nowTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
						if (this.dataZoomDate.startTime != '' && this.dataZoomDate.endTime != '') {
							if(this.dataZoomDate.startTime == null && this.dataZoomDate.endTime == null) {
								this.chart.setOption({
									xAxis: {
										axisPointer: this.axisPointer(this.timeStamp.nowTime)
									}
								});
								return 
							}
							if (this.isDateBetween(new Date(this.dateInit(date)), this.dataZoomDate.startTime, this.dataZoomDate.endTime)) {
								this.chart.setOption({
									xAxis: {
										axisPointer: this.axisPointer(this.timeStamp.nowTime)
									}
								});
							} else {
								this.chart.setOption({
									xAxis: {
										axisPointer: this.axisPointer(this.timeStamp.nowTime, true)
									}
								});
							}
						} else {
							this.chart.setOption({
								xAxis: {
									axisPointer: this.axisPointer(this.timeStamp.nowTime)
								}
							});
						}
					} else {
						clearInterval(this.timer)
						this.$emit('hiddenStopBtn', true)
						this.timeStamp.judge = false
						if (this.dataZoomDate.startTime != '' && this.dataZoomDate.endTime != '') {
							if(this.dataZoomDate.startTime == null && this.dataZoomDate.endTime == null) {
								this.chart.setOption({
									xAxis: {
										axisPointer: this.axisPointer(this.timeStamp.nowTime)
									}
								});
								return 
							}
							if (this.isDateBetween(new Date(this.dateInit(date)), this.dataZoomDate.startTime, this.dataZoomDate.endTime)) {
								this.chart.setOption({
									xAxis: {
										axisPointer: this.axisPointer(this.timeStamp.nowTime)
									}
								});
							} else {
								this.chart.setOption({
									xAxis: {
										axisPointer: this.axisPointer(this.timeStamp.nowTime, true)
									}
								});
							}
						} else {
							this.chart.setOption({
								xAxis: {
									axisPointer: this.axisPointer(this.timeStamp.nowTime)
								}
							});
						}
					}
				}, Math.floor(this.$props.timerNumber * 1000 / arr.length))
			},
			/** 
<<<<<<< HEAD
			 * 判断日期是否在区间内，在区间内返回true，否返回false 
			 * @param dateString 日期字符串 
			 * @param startDateString 区间开始日期字符串 
			 * @param endDateString 区间结束日期字符串 
			 * @returns {Number} 
			 */
			compareDate(startDate, endDate) {
				let endTimes, startTimes;
				if ((typeof startDate == 'string') && startDate.constructor == String) {
					if (startDate.length >= 8 && startDate.length <= 10) {
						startTimes = new Date(startDate).getTime()
					} else {
						startTimes = new Date(startDate.split(' ')[0]).getTime()
					}
				} else {
					startTimes = new Date(startDate).getTime()
				}
				if ((typeof endDate == 'string') && endDate.constructor == String) {
					if (endDate.length >= 8 && endDate.length <= 10) {
						endTimes = new Date(endDate).getTime()
					} else {
						endTimes = new Date(endDate.split(' ')[0]).getTime()
					}
				} else {
					endTimes = new Date(endDate).getTime()
				}
				if (endTimes < startTimes) {
					return -1;
				}
				return 1;
			},
			isDateBetween(dateString, startDateString, endDateString) {
				var flag = false;
				var startFlag = (this.compareDate(dateString, startDateString) < 1);
				var endFlag = (this.compareDate(dateString, endDateString) > -1);
				if (startFlag && endFlag) {
					flag = true;
				}
				return flag;
			},
			colorRbg(a) {
				var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
				var sColor = a.toLowerCase();
				if (sColor && reg.test(sColor)) {
					if (sColor.length === 4) {
						var sColorNew = "#";
						for (var i = 1; i < 4; i += 1) {
							sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
=======
             * 判断日期是否在区间内，在区间内返回true，否返回false 
             * @param dateString 日期字符串 
             * @param startDateString 区间开始日期字符串 
             * @param endDateString 区间结束日期字符串 
             * @returns {Number} 
             */ 
             compareDate(startDate, endDate) {
                 let endTimes,startTimes;
                if((typeof startDate=='string')&&startDate.constructor==String){
                    if(startDate.length >=8 && startDate.length <= 10){
                        startTimes = new Date(startDate).getTime()
                    }else{
                        startTimes = new Date(startDate.split(' ')[0]).getTime()
                    }
                }else{
                    startTimes = new Date(startDate).getTime()
                }
                if((typeof endDate=='string')&&endDate.constructor==String){
                    if(endDate.length >=8 && endDate.length <= 10){
                        endTimes = new Date(endDate).getTime()
                    }else{
                        endTimes = new Date(endDate.split(' ')[0]).getTime()
                    }
                }else{
                    endTimes = new Date(endDate).getTime()
                }
                if (endTimes<startTimes) {
                    return -1;
                }
                return 1;
            },
            isDateBetween(dateString, startDateString, endDateString){  
                var flag = false;  
                var startFlag = (this.compareDate(dateString, startDateString) < 1);  
                var endFlag = (this.compareDate(dateString, endDateString) > -1);  
                if(startFlag && endFlag){  
                    flag = true;  
                }  
                return flag;  
			},  
			colorRbg(a){
				var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
				var sColor = a.toLowerCase();
				if(sColor && reg.test(sColor)){
					if(sColor.length === 4){
						var sColorNew = "#";
						for(var i=1; i<4; i+=1){
							sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));	
>>>>>>> 5ef9773a8d03da77cce514a06ddbaedf7d79f7f7
						}
						sColor = sColorNew;
					}
					//处理六位的颜色值
					var sColorChange = [];
<<<<<<< HEAD
					for (var i = 1; i < 7; i += 2) {
						sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
					}
					return "RGB(" + sColorChange.join(",") + ")";
				} else {
					return sColor;
				}
			},
			dateInit(date) {
				if ((typeof date == 'string') && date.constructor == String) {
					if (date.indexOf('T') != -1) {
						return date.split('T')[0]
					} else {
=======
					for(var i=1; i<7; i+=2){
						sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));	
					}
					return "RGB(" + sColorChange.join(",") + ")";
				}else{
					return sColor;	
				}
			},
			dateInit(date){
				if( (typeof date=='string')&&date.constructor==String){
					if(date.indexOf('T') != -1){
						 return date.split('T')[0]
					}else{
>>>>>>> 5ef9773a8d03da77cce514a06ddbaedf7d79f7f7
						return date.split(' ')[0]
					}
				} else {
					let a = new Date(date)
					var m, d;
					a.getMonth() + 1 >= 10 ? m = a.getMonth() + 1 : m = '0' + (a.getMonth() + 1)
					a.getDate() >= 10 ? d = a.getDate() : d = '0' + a.getDate()
					return a.getFullYear() + '-' + m + '-' + d
				}
			},
			dateArrToAll(arr) {
				let date1 = new Date(arr[0])
				let date2 = new Date(arr[1])
				let diff = (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)
				let returnArr = []
				for (let i = 0; i < diff; i++) {
					date1.setDate(date1.getDate() + 1)
					let m, d;
					(date1.getMonth() + 1) >= 10 ? m = (date1.getMonth() + 1) : m = '0' + (date1.getMonth() + 1)
					date1.getDate() >= 10 ? d = date1.getDate() : d = '0' + date1.getDate()
					returnArr.push(`${date1.getFullYear()}-${m}-${d} 00:00:00`)
				}
				return returnArr
			},
			chartAxPointerStop() {
				if (this.timer != null) {
					clearInterval(this.timer)
				}
				this.timeStamp.judge = true
				this.chart.setOption({
					xAxis: {
						axisPointer: this.axisPointer(this.timeStamp.nowTime, false)
					}
				});
				this.$emit('hiddenStopBtn', true)
			},
			chartAxPointerReset() {
				this.chart.setOption({
					xAxis: {
						axisPointer: this.axisPointer(null, false)
					}
				});
				if (this.timer) {
					clearInterval(this.timer)
					this.timeStamp.judge = false
				}
			},
			formatTableData(date,judge,setColorJudge){
				let newDate = new Date()
				if(date){
					newDate = date
					this.tableTitleDate = this.common.dateInit(date)
				}
				let lists = []
				this.tableData = []
				this.$props.ganttData.forEach(d=>{
					if(this.common.isDateBetween(newDate,d.TaskStartTime,d.TaskEndTime) || this.common.isDateBetween(newDate,d.TaskPlanStartTime,d.TaskPlanEndTime)){
						lists.push(d)
					}
				})
				if(judge){
					if(window.parent.BIMe && this.$props.show3d){
						let elementID = window.parent.BIMe.modelData.BIMeElementData.getAllElementIds()
							window.parent.BIMe.control.BIMeUtility.resetElementColor(elementID)
					}
				}
				
				lists.forEach(list=>{
					let store = null
					if(list.Percentage){//已完成
						store = this.common.DateDiff(list.TaskEndTime,list.TaskPlanEndTime)
					}else{
						store = this.common.DateDiff(new Date(),list.TaskPlanEndTime)
					}
					if(store > 0){
						store = `延误${store}天`
					}else{
						store = '正常'
					}
					this.tableData.push({
						procedure:list.Category,
						plan1:`第${list.TaskOrder}层`,
						Actual1:`第${list.TaskOrder}层`,
						plan2:`${(((this.NumberOfDays(list.TaskPlanEndTime,newDate)/this.common.DateDiff(list.TaskPlanEndTime,list.TaskPlanStartTime)))*100).toFixed(2)}%`,
						Actual2:`${(((this.NumberOfDays(list.TaskEndTime,newDate)/this.common.DateDiff(list.TaskEndTime,list.TaskStartTime)))*100).toFixed(2)}%`,
						state:store
					})
					if(setColorJudge){
						if(window.parent.BIMe && this.$props.show3d){
							let a = list.ElementIDS.split(',')
							let b = []
							a.forEach(element => {
								b.push(
									window.ModelID + '^' + element
								)
							});
							let color = this.colorRbg(list.Color)
							color = color.split('RGB')[1].split('(')[1].split(')')[0].split(',')
							window.parent.BIMe.control.BIMeUtility.setElementColor(b,color[0],color[1],color[2],.4)
						}
					}
					 
				})
			},
			NumberOfDays(planDate, newDate) {
				return Math.abs(this.common.DateDiff(newDate, planDate))
			},
			//////////////////////////////////////////////////////////////////
			createPlannedArrowRenderItem  (data, color)  {
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
					}, ]));
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
			},
			createArrowRenderItem (data, color) {
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
							y: arrowSize / 2 - 14,
							width: arrowSize,
							height: arrowSize
						},
						position: point,
						style: api.style({
							stroke: color,
							fill: color,
							lineWidth: 1,
						})
					}, ])
					return {
						type: 'group',
						children: graphics
					}
				}
			},
			getDateRange (array = []) {
				let result = [];
				let max = new Date()
				let min = new Date();
				array.map(function(data) {
					data.data.map(function(d) {
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
			},
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
			},
			axisPointer(time, hideMaker) {
				time ? time : time = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
				if (hideMaker) {
					return {
						lineStyle: {
							opacity: 0
						}
					}
				}
				return {
					value: time,
					snap: true,
					lineStyle: {
						color: 'red',
						opacity: 1,
						width: 2
					},
					label: {
						show: true,
						formatter: function(params) {
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
			},
			async getPlannedScheduleAsync(ganttData) {
				var a = [];
				let response = ganttData
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
			},
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
			},
			async render(actural, planned, ganttData) {
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
					xAxisData = this.getDateRange(response[1]);
				}
				if (planned) {
					let response = await this.createPlannedSeries(ganttData.planned);
					
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
						triggerOn: 'none',
						position: function(pt) {
							return [pt[0] + 30, '10%'];
						},
						axisPointer: {
							type: 'cross',
							snap: true
						},
						formatter: function(params) {
							
							_this.formatTableData(params[0].data[0],false,false)
							/**模型 */
							if(_this.setModelTimer){
								clearTimeout(_this.setModelTimer)
							}
							_this.setModelTimer = setTimeout(() => {
								if(_this.$props.show3d && window.parent.BIMe){
									let forEachData = []
									if (_this.dragDataJudge != forEachData && _this.dragDataJudge != '') {
										window.parent.BIMe.control.BIMeUtility.resetElementColor(_this.dragDataJudge)
									}
									_this.$props.ganttData.forEach(g => {
										
										if (new Date(_this.dateInit(g.TaskStartTime)).getTime() == new Date(params[0].data[0]).getTime()) {
												let a = g.ElementIDS.split(',')
												let b = []
												a.forEach(element => {
													b.push(
														window.ModelID + '^' + element
													)
												});
												let color = _this.colorRbg(g.Color)
												color = color.split('RGB')[1].split('(')[1].split(')')[0].split(',')
												if(forEachData.length>0){
													forEachData = forEachData.concat(b)
												}else{
													forEachData = b
												}
												
												window.parent.BIMe.control.BIMeUtility.setElementColor(b, color[0], color[1], color[2], .4)
											
										}
										
									})
									_this.dragDataJudge = forEachData
								}
							}, 1000);
							
							let newList = _this.common.arrUnique(params, 'data')
							let res = `${params[0].data[0]}`
							newList.forEach(list => {
								res += `<br/><span style="width:10px;border-radius:50%;background-color:${list.color};height:10px;display:inline-block;margin-right:5px;"></span>${list.seriesName}:${list.data[1]}`
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
						name: '', //x轴文字
						nameRotate: 45,
						axisPointer: this.axisPointer(null, false),
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
						axisLabel: {
							formatter: function(value) {
								if (value <= 0) {
									return value
								} else {
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
			},
			async createActuralSeries(ganttData) {
				await this.getActuralScheduleAsync(ganttData);
				let data = this.acturalSchedule;
				let legend_data = [];
				let series = [];
				data.forEach((schedule, index) => {
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
				});
				this.acturalLinkedSchedule = this.acturalLinkedSchedule
				this.acturalLinkedSchedule.forEach((schedule) => {
					legend_data.push(schedule.business);
					series.push({
						name: schedule.business,
						type: 'custom',
						color: schedule.color,
						renderItem: this.createArrowRenderItem(schedule.schedule, schedule.color),
						data: schedule.schedule,
						z: 10,
					});
				})
				return [legend_data, series];
			},
			async createPlannedSeries(ganttData) {
				await this.getPlannedScheduleAsync(ganttData);
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
						renderItem: this.createPlannedArrowRenderItem(schedule.schedule, schedule.color),
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
				return [legend_data, series];
			}
			/////////////////////////////////////
		},
		mounted() {
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
			this.render(this.acturalSchedule, this.plannedSchedule, this.initGanttDataToCharts());
			loading.close()
			//节点点击事件
			this.chart.on('click', function(params) {
				for (let i = 0; i < _this.$props.ganttData.length; i++) {
					if (params.data[2] == _this.$props.ganttData[i].TaskID) {
						if (_this.$props.show3d) {
							if (window.parent.BIMe) {
								if (_this.$props.ganttData[i].ElementIDS == '') {
									_this.$message('无关联的构件');
								} else {
									var a = _this.$props.ganttData[i].ElementIDS.split(',')
									var b = []
									a.forEach(element => {
										b.push(
											window.ModelID + '^' + element
										)
									});
									// let color = this.colorRbg(_this.$props.ganttData[i].Color)
									// color = color.split('RGB')[1].split('(')[1].split(')')[0].split(',')
									// window.parent.BIMe.control.BIMeUtility.setElementColor(b,color[0],color[1],color[2],1)
<<<<<<< HEAD
									window.parent.BIMe.control.BIMeSelector.selectorElementByElementId(b)
=======
									 window.parent.BIMe.control.BIMeSelector.selectorElementByElementId(b)
>>>>>>> 5ef9773a8d03da77cce514a06ddbaedf7d79f7f7
								}
							}
						}
					}
				}
			});
			this.chart.on('dblclick', function(params) {
				var judgeArr = params.seriesId.split('')
				if (judgeArr[judgeArr.length - 1] == 2) { //防止点击计划节点
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
			})
			this.chart.on('dataZoom', function(params) {
				// 这里获取的是x轴0-100的截取值，并不是我们想要的数据
				if (params.batch) {
					
					var opt = _this.chart.getOption()
					console.log(opt)
					_this.dataZoomDate.startTime = opt.xAxis[0].rangeStart;
					_this.dataZoomDate.endTime = opt.xAxis[0].rangeEnd;
					console.log(_this.dataZoomDate)
				}
			});
			this.formatTableData(null,false,true)
			this.tableTitleDate = this.dateInit(new Date())
			//数据给modelMockjs 用于拖拽模型高亮
			// modelApi.default.initRootData(this.$props.ganttData)
			// modelApi.default.initCommon(this.common)
			// modelApi.default.formatTableData().then(res => {
			// 	this.tableTitleDate = res.tableTitleDate
			// 	this.tableData = res.tableData
			// })
		}
	};
</script>
