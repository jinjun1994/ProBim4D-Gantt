<template>
    <div ref="gantt" style="width:100%;height:100%;">
    </div>
</template>

<script>
    import "dhtmlx-gantt";
    import "dhtmlx-gantt/codebase/locale/locale_cn.js";
    import "dhtmlx-gantt/codebase/ext/dhtmlxgantt_marker.js";
    import './ganttExport.js'
    export default {
        name: "gantt",
        props: {
            tasks: {
                type: Object,
                default () {
                    return {
                        data: [],
                        links: [],
                        todayMarker: null
                    };
                }
            },
            selectScheduleID: String,
            show3d:Boolean,
            timerNumber:Number
        },
        data() {
            return {
                markerDate: '',
                timer: '',
                i: 0,
                date_to_str: '',
                loading: '',
                modelData:{
                    ElementIds:''
                }
            }
        },
        methods: {
            clearGanttDataView() {
                gantt.clearAll()
            },
            isRealNum(val) {
                if (val === "" || val == null) {
                    return false;
                }
                if (!isNaN(val)) {
                    return true;
                } else {
                    return false;
                }
            },
            Repaint() {
                gantt.clearAll()
                gantt.parse(this.$props.tasks);
                gantt.render()
                gantt.setSizes()
            },
            $_initGanttEvents: function() {
                var _this = this
                
                if (gantt.$_eventsInitialized) return;
                gantt.attachEvent("onTaskSelected", id => {
                    
                    if(!_this.$props.show3d) return false
                    let task = gantt.getTask(id);
                    if (task.ElementIDS == '') {
                        _this.$message('无关联的构件');
                    } else {
                        var a = task.ElementIDS.split(',')
                        var b = []
                        a.forEach(element => {
                            b.push(
                                window.ModelID + '^' + element
                            )
                            
                        });
                        // b = b.join(',')
                        console.log(b)
                        window.parent.BIMe.control.BIMeSelector.selectorElementByElementId(b)
                    }
                    // this.$emit("task-selected", task);
                });
                gantt.attachEvent("onBeforeDataRender", () => { //gantt数据前
                    _this.loading = this.$loading({ //loading
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.5)'
                    });
                })
                gantt.attachEvent("onDataRender", () => {
                    _this.loading.close()
                })
                gantt.attachEvent("onTaskCreated", (task) => { //点击加号
                    if (task.parent) {
                        _this.$emit('ganttAddShow', {
                            parentId: task.parent
                        })
                    } else {
                        _this.$emit('ganttAddShow', {
                            parentId: 0
                        })
                    }
                    console.log('点击', task)
                });
                gantt.attachEvent("onTaskDblClick", function(id, el) {
                    _this.$emit('reviseTaskDialog', gantt.getTask(id))
                });
                gantt.attachEvent("onTaskOpened", function(id, a) {
                    console.log(id, a)
                });
                // gantt.attachEvent("onTaskClick", function(id, el) {
                //   _this.$emit('ganttAddShow',{parentId:id})
                //     console.log('点击',id)
                // });
                gantt.attachEvent("onAfterTaskAdd", (id, task) => { //新增回调
                    console.log(task)
                    console.log(gantt.getParent(task))
                    var formData = new FormData()
                    var data = {
                        TaskID: task.id,
                        ScheduleID: _this.$props.selectScheduleID,
                        TaskName: task.text,
                        TaskDesc: '',
                        TaskStartTime: task.start_date,
                        TaskEndTime: task.end_date,
                        TaskPlanStartTime: task.plan_start_date,
                        TaskPlanEndTime: task.plan_end_date,
                        Color: task.color,
                        Category: task.type
                    }
                    if (task.parent == 0) {
                        data.ParentId = ''
                    } else {
                        data.ParentID = task.parent
                    }
                    /*
                        var formData = {
                        ProjectID:window.ProjectID,
                        ScheduleTask:{
                            ScheduleID:this.selectScheduleID,
                            TaskID:task.id,
                            TaskDesc:'',
                            TaskStartTime:task.start_date,
                            TaskEndTime:task.end_date,
                            TaskPlanStartTime:task.start_date,
                            TaskPlanEndTime:task.end_date,
                            TaskName:task.text,
                            Color:task.color,
                            ParentID:task.parent?task.parent:''
                        }
                        
                    }
                    this.$axios.post(`${window.urlConfig}/api/Prj/AddScheduleTask`,formData).then(res=>{
                        console.log(res)
                    })*/
                    formData.append('ProjectID', window.ProjectID)
                    formData.append('ModelID', window.ModelID)
                    formData.append('ScheduleTask', JSON.stringify(data))
                    this.$axios.post(`${window.urlConfig}/api/Prj/AddScheduleTask`, formData).then(res => {
                        // gantt.changeTaskId(id, res.data);
                        // _this.Repaint()
                        gantt.setSizes()
                    }).catch(res => {
                        console.log('甘特图新增任务失败，原因：' + res)
                    })
                    // this.$emit("task-updated", id, "inserted", task);
                    // task.progress = task.progress || 0;
                    // if (gantt.getSelectedId() == id) {
                    //     this.$emit("task-selected", task);
                    // }
                });
                gantt.attachEvent("onGridResize", function(old_width, new_width) {
                    gantt.renderMarkers()
                });
                gantt.attachEvent("onAfterTaskUpdate", (id, task) => { //修改回调
                    console.log(task)
                    var formData = new FormData()
                    var data = {
                        TaskID: task.id,
                        ScheduleID: this.$props.selectScheduleID,
                        TaskName: task.text,
                        TaskStartTime: _this.initCnDate(task.start_date),
                        TaskEndTime: _this.initCnDate(task.end_date),
                        TaskPlanStartTime: _this.initCnDate(task.plan_start_date),
                        TaskPlanEndTime: _this.initCnDate(task.plan_end_date),
                        Color: task.Color,
                        Category: task.Category,
                        Section: task.Section,
                        HasChildren: task.HasChildren,
                        ExternalProperty: task.ExternalProperty,
                        TaskDesc: task.TaskDesc
                    }
                    if (task.parent == 0) {
                        data.ParentID = ''
                    } else {
                        data.ParentID = task.parent
                    }
                    this.$emit('upDatedGanttDateToCharts', data)
                    formData.append('ProjectID', window.ProjectID)
                    // formData.append('ModelID', window.ModelID)
                    formData.append('ScheduleTask', JSON.stringify(data))
                    this.$axios.post(`${window.urlConfig}/api/Prj/UpdateScheduleTask`, formData).then(res => {
                        _this.$emit('operationGanttAddView', false)
                        // gantt.changeTaskId(id, res.data);
                        _this.Repaint()
                    }).catch(res => {
                        console.log('甘特图修改任务失败，原因：' + res)
                    })
                });
                gantt.attachEvent("onAfterTaskDelete", id => {
                    this.$axios.get(`${window.urlConfig}/api/Prj/DeleteScheduleTask?ProjectID=${window.ProjectID}&ModelID=${window.ModelID}&ScheduleID=${this.$props.selectScheduleID}&ScheduleTaskIDs=${id}`).then(res => {
                        console.log('成功删除任务' + res)
                        this.$message({
                            showClose: true,
                            message: '删除任务成功',
                            type: 'success'
                        });
                        _this.$emit('operationGanttAddView', false)
                    }).catch(res => {
                        console.log('甘特图删除错误，原因' + res)
                    })
                });
                // gantt.attachEvent("onAfterLinkAdd", (id, link) => {
                //     console.log(1)
                //     this.$emit("link-updated", id, "inserted", link);
                // });
                // gantt.attachEvent("onAfterLinkUpdate", (id, link) => {
                //     console.log(1)
                //     this.$emit("link-updated", id, "updated", link);
                // });
                // gantt.attachEvent("onAfterLinkDelete", (id, link) => {
                //     console.log(1)
                //     this.$emit("link-updated", id, "deleted");
                // });
                gantt.attachEvent('onBeforeLightbox', (id) => { //禁用系统弹层
                    return false
                })
                gantt.$_eventsInitialized = true;
            },
            initCnDate(time) {
                if (typeof time == 'string') {
                    var newTime = time.split('-')
                    if (newTime[2] * 1 > 2000) {
                        var newArr = [newTime[2], newTime[1], newTime[0]]
                        console.log(newArr.join('-'))
                        return newArr.join('-')
                    } else {
                        return time
                    }
                } else {
                    return time
                }
            },
            reviseTasl(task) {
                task.start_date = this.initDate(task.actualdate[0])
                task.end_date = this.initDate(task.actualdate[1])
                var newTask = gantt.getTask(task.id)
                newTask.text = task.name
                newTask.start_date = task.start_date
                newTask.end_date = task.end_date
                newTask.plan_end_date = task.plandate[1]
                newTask.plan_start_date = task.plandate[0]
                newTask.ExternalProperty = task.additionaltext
                newTask.parent = task.parent
                gantt.updateTask(task.id, newTask)
            },
            delTask(task) {
                gantt.deleteTask(task.id)
            },
            addTask(task) {
                gantt.addTask(task)
            },
            ganttResize() {
                gantt.setSizes()
            },
            initDate(time) {
                if (!time) {
                    return null
                }
                var date = new Date(time)
                return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
            },
            addMarker(date) {
                var _this = this
                this.markerDate = gantt.addMarker({
                    start_date: new Date(date),
                    css: 'today',
                    title: _this.date_to_str(new Date(date))
                })
                gantt.render();
                //对接模型api
                if(window.parent.BIMe){
                    window.parent.BIMe.control.BIMeHide.hideElementByElementId(window.parent.BIMe.modelData.BIMeElementData.getAllElementIds()) //隐藏所有构件
                    
                }
                console.log(window.parent.BIMe)

            },
            delMaker(){
                gantt.deleteMarker(this.markerDate)
                gantt.render()
                this.i = 0
                if(this.timer){
                    clearTimeout(this.timer)
                }
            },
            runMarker(timeDateArr) { //接受date数组
                var _this = this
                let number = this.$props.timerNumber*1000
                this.timer = setTimeout(() => {
                    var dayDate = gantt.getMarker(_this.markerDate)
                    dayDate.start_date = new Date(timeDateArr[_this.i])
                    dayDate.title = _this.date_to_str(dayDate.start_date)
                    gantt.updateMarker(_this.markerDate)
                    let arr = []
                    this.tasks.data.forEach(t=>{
                        if(new Date(t.start_date).getTime() == new Date(timeDateArr[_this.i]).getTime()){
                            if(window.parent.BIMe){
                                let a = t.ElementIDS.split(',')
                                let b = []
                                a.forEach(element => {
                                    b.push(
                                        window.ModelID + '^' + element
                                    )
                                    
                                });
                                window.parent.BIMe.control.BIMeUtility.setElementColor(b,0,255,0,1)

                            }
                            
                            gantt.showTask(t.id)
                        }
                        if(window.parent.BIMe){
                            if(new Date(t.end_date).getTime() == new Date(timeDateArr[_this.i]).getTime()){
                                let a = t.ElementIDS.split(',')
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
                        //判断maker是否在区间
                        if(this.isDateBetween(timeDateArr[this.i],t.start_date,t.end_date)){
                            arr.push(t.text)
                        }
                        
                    })
                    _this.$emit('upDataMockDetail',{date:timeDateArr[this.i],taskName:arr})
                    _this.i += 1
                    if (_this.i != timeDateArr.length) {
                        _this.runMarker(timeDateArr)
                    } else {
                        _this.i = 0
                        gantt.deleteMarker(_this.markerDate)
                        _this.$emit('hiddenStopBtn',true)
                        _this.$emit('resetMockDataArr')
                    }
                }, number/timeDateArr.length);
            },
            /** 
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
            stopMarker() {
                clearTimeout(this.timer)
            },
            initTimer(str) { //时间小时 分钟补0
                if ((typeof str == 'string') && str.constructor == String) {
                    console.log()
                    return str + ' 00:00:00'
                } else {
                    return str
                }
            }
        },
        mounted() {
            
            window.stopMarker = this.stopMarker
            window.addMarker = this.addMarker
            window.runMarker = this.runMarker
            var _this = this;
            gantt.config.scale_unit = "day";
            // gantt.config.date_scale = "%d, %M,%Y";
            gantt.config.date_scale = "%M-%d日";
            this.$_initGanttEvents();
            gantt.config.autoscroll = true;
            gantt.config.autoscroll_speed = 50;
            gantt.config.task_height = 16;
            gantt.config.row_height = 40;
            gantt.addTaskLayer(function draw_planned(task) {
                if (task.plan_start_date && task.plan_end_date) {
                    var sizes = gantt.getTaskPosition(task, new Date(_this.initTimer(task.plan_start_date)), new Date(_this.initTimer(task.plan_end_date)))
                    var el = document.createElement('div')
                    el.innerHTML = task.text + '--计划时间'
                    el.className = 'baseline'
                    el.style.left = sizes.left + 'px'
                    el.style.width = sizes.width + 'px'
                    el.style.top = sizes.top + gantt.config.task_height + 13 + 'px'
                    return el;
                }
            })
            // gantt.exportToPNG();
            // gantt.templates.task_class = function (start, end, task) {
            //     if (task.end_date) {
            //         var classes = ['has-baseline'];
            //         if (end.getTime() > task.end_date.getTime()) {
            //             classes.push('overdue');
            //         }
            //         return classes.join(' ');
            //     }
            // };
            // gantt.templates.rightside_text = function (start, end, task) {
            //     if (task.end_date) {
            //         if (end.getTime() > new Date(task.end_date).getTime()) {
            //             var overdue = Math.ceil(Math.abs((end.getTime() - task.end_date.getTime()) / (24 * 60 * 60 * 1000)));
            //             var text = "<b>间隔: " + overdue + " 天</b>";
            //             return text;
            //         }
            //     }
            // };
            // gantt.config.columns = [
            //     {name: "text", tree: true, width: 150, resize: true},
            //     {name: "start_date", align: "center", width: 150, resize: true},
            //     {name: "duration", align: "center", width: 70, resize: true},
            //     {name: "add", width: 44, resize: true}
            // ];
            gantt.config.show_errors = false;
            gantt.init(this.$refs.gantt);
            gantt.parse(this.$props.tasks);
            this.date_to_str = gantt.date.date_to_str(gantt.config.task_date);
            // var id = gantt.addMarker({
            //   start_date: new Date(),
            //   css: "gantt-today",
            //   title: date_to_str(new Date())
            // });
            // // var i = 0,
            //   arr = ["2018-6-13", "2018-6-14", "2018-6-15", "2018-6-16", "2018-6-17"];
            //   var today = gantt.getMarker(id);
            // var timer = setInterval(function() {
            //     console.log(id)
            //   console.log(today)
            //   today.start_date = new Date(arr[i]);
            //   today.title = date_to_str(today.start_date);
            //   gantt.updateMarker(id);
            //   i += 1;
            //   if (i == arr.length) {
            //     clearInterval(timer);
            //   }
            // }, 1000);
        }
    };
</script>

<style>
    @import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
    .gantt-today {
        height: 300px;
        width: 1px;
        background: red;
    }
    .gantt-add-dialog {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .5);
        z-index: 10;
    }
</style>





