<template>
    <div class="index-wp">
        <!-- <scheduleList class="scheduleList-wp" @requestData=requestData v-show="!show3d">
            </scheduleList> -->
        <scheduleList class="scheduleList-wp" @requestData=requestData v-show="!show3d" @temporaryDialogShow=temporaryDialogShow @clearGanttDataView=clearGanttDataView ref="scheduleList">
        </scheduleList>
        <div class="gantt-nav" style="height:100%;" :class="{'show-3d':show3d}">
            <div class="gantt-head">
                <div class="gantt-left">任务列表</div>
                <div class="gantt-right">
                    <div class="fl">
                        <ul>
                            <li @click="toggle3D()" :class="{'no-click':selectScheduleID == ''}"> <img src="./model.svg"><span id="show3DText">显示模型</span></li>
                            <li style="margin-left:40px;" :class="{'no-click':!show3d}">附加选中对象</li>
                        </ul>
                    </div>
                    <div class="fr">
                        <ul>
                            <!-- <li>
                                <el-checkbox-group v-model="checkedCharts" @change="cheackedChartsFun">
                                    <el-checkbox :label="'plan'">计划</el-checkbox>
                                    <el-checkbox :label="'actual'">实际</el-checkbox>
                                </el-checkbox-group>
                            </li> -->
                            <li :class="{'no-click':!show3d}"><img src="./mock.svg">模拟</li>
                            <li class="no-click"><img src="./import.svg">导入</li>
                            <li @click='toggleGantt' :class="{'no-click':selectScheduleID == ''}"><img src="./table.svg">网络图/甘特图</li>
                            <li class="no-click"><img src="./export.svg">导出</li>

                        </ul>
                    </div>
                </div>
            </div>
            <gantt class="gantt-wp" v-show="showGantt" :tasks="tasks" :selectScheduleID="selectScheduleID" ref="ganttView" @ganttAddShow=ganttAddShow @reviseTaskDialog=reviseTaskDialog @operationGanttAddView=operationGanttAddView @upDatedGanttDateToCharts=upDatedGanttDateToCharts>
            </gantt>
            <chats v-if="!showGantt" class="chats-wp" ref="chats" :selectScheduleID="selectScheduleID" :ganttData=ganttData></chats>
            <matchDialog></matchDialog>
            <ganttAdd ref="ganttAdd" @delGanttTask=delGanttTask :selectScheduleID=selectScheduleID @addTaskDialog=addTaskDialog @reviseTaskGantt=reviseTaskGantt :taskDefault=taskDefault :ruleForm=ruleForm></ganttAdd>
        </div>
        <div class="iframe-wp" v-show="show3d"></div>
        <temporaryDialog ref="temporaryDialog" @listAddItem=listAddItem @saveGanttData=saveGanttData @addScheduleListItem=addScheduleListItem></temporaryDialog>
    </div>
</template>
<style>
    .el-checkbox{
        color: #fff
    }
    body{
        user-select: none;
    }
    .gantt_task_line,
    .gantt_line_wrapper {
        margin-top: -9px;
    }
    .gantt_side_content {
        margin-bottom: 7px;
    }
    .gantt_task_link .gantt_link_arrow {
        margin-top: -12px;
    }
    .gantt_side_content.gantt_right {
        bottom: 0;
    }
    .gantt_task_link .gantt_link_arrow_right,
    .gantt_task_link .gantt_link_arrow_left {
        margin-top: -12px !important;
    }
    .baseline {
        position: absolute;
        border-radius: 2px;
        opacity: 0.6;
        margin-top: -7px;
        height: 14px;
        background: #ffd180;
        border: 1px solid rgb(255, 153, 0);
        line-height: 14px;
        color: #000;
    }
    .show-3d {
        width: calc(100% - 600px);
    }
    .iframe-wp {
        display: inline-block;
        min-width: 600px;
        height: 100%;
    }
    .gantt-head .gantt-right div:nth-child(2) li {
        color: #fff;
        cursor: pointer;
        line-height: 30px;
        margin-right: 24px;
    }
    .gantt-head .gantt-right div:nth-child(1) li {
        line-height: 30px;
        margin-right: 24px;
    }
    .gantt-head .gantt-right div:nth-child(1) li:first-child {
        margin-left: 24px;
    }
    .gantt-head .gantt-right div ul {
        display: flex;
        cursor: pointer;
    }
    .gantt-head .gantt-right div img {
        vertical-align: middle;
        margin-right: 10px;
    }
    .index-wp {
        height: 100%;
        display: flex;
    }
    .gantt-nav {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .gantt-head {
        height: 30px;
        background-color: #5e6a86;
        line-height: 30px;
        color: #fff;
        width: 100%;
        min-height: 30px;
        display: flex;
    }
    .gantt-head .gantt-left {
        width: 359px;
    }
    .gantt-head .gantt-right {
        flex: 1;
    }
    .gantt-wp,
    .chats-wp {
        height: calc(100% - 30px) !important;
        margin-left: -1px;
        position: relative;
        z-index: 2;
    }
    .scheduleList-wp {
        position: relative;
        z-index: 9;
    }
    .no-click {
        color: #ccc !important;
        cursor: no-drop !important;
    }
    .el-loading-spinner i,.el-loading-spinner .el-loading-text{
        color: #fff;
    }
</style>
<script>
    // window.urlConfig = "https://bimcomposer.probim.cn";
    // window.ProjectID = "7e951a17-556b-46ee-9fb8-634d97940635";
    // window.ModelID = "c1e76e74-220c-4bee-93ce-b1779fa3e70c"
    import scheduleList from "./scheduleList/scheduleList";
    import gantt from "./gantt/gantt";
    import chats from "./chats/chats";
    import matchDialog from "./dialog/delDialogMatch";
    import ganttAdd from "./dialog/ganttAddDialog";
    import temporaryDialog from './dialog/temporaryDialog'
    export default {
        components: {
            scheduleList,
            gantt,
            chats,
            ganttAdd,
            // matchDialog:resolve => {require(['./dialog/delDialogMatch'], resolve)},
            matchDialog,
            temporaryDialog
        },
        data() {
            return {
                checkedCharts:[],
                ganttData:'',
                showGantt: true,
                tasks: {
                    data: [],
                    links: []
                },
                show3d: false,
                selectScheduleID: "1", //已选中进度id
                selectItem:'',//选中列表传过来的 item
                taskDefault: {
                    queueGanttTask: null, //待处理队列task
                    taskParentId: ""
                },
                ruleForm: {
                    //新增修改甘特数据
                    name: "",
                    plandate: "",
                    actualdate: "",
                    additionaltext: "",
                    judgeAdd: null,
                    parent: 0,
                    id: ""
                },
                ganttOrChartsData:''
            };
        },
        methods: {
            cheackedChartsFun(val){
            },
            serverDateInit(time){
                var date = new Date(time)
                 var year = date.getFullYear(),
                    month = date.getMonth() + 1,
                    day = date.getDate(),
                    hour = date.getHours(),
                    min = date.getMinutes(),
                    sec = date.getSeconds();
                
                return year + '-' + month + '-' +day + 'T' +hour + ':' +min + ':' +sec;
            },
            upDatedGanttDateToCharts(task){
                // this.tasks.data.forEach(taskArrData=>{
                //     if(taskArrData.id == task.id){
                //         console.log(this.ganttOrChartsData)
                //         taskArrData = task
                //     }
                // })
                this.ganttData.forEach(item=>{
                    if(item.TaskID == task.id){
                        item.TaskStartTime = this.serverDateInit(task.start_date)
                        item.TaskEndTime = this.serverDateInit(task.end_date)
                    }
                })
            },
            randomColor(){
                return '#'+Math.floor(Math.random()*0xffffff).toString(16);
            },
            saveGanttData(data){
                this.ganttData = data
                this.requestData()
                
            },
            addScheduleListItem(data){
                this.$refs.scheduleList.addItem({
                    ScheduleName:data.ScheduleName,
                    ScheduleID:data.guid
                })
            },
            clearGanttDataView() {
                this.showGantt = true
                this.$refs.ganttView.clearGanttDataView()
            },
            listAddItem(item) {
                 this.$message({
                    showClose: true,
                    message: '新建进度方案成功',
                    type: 'success'
                });
                this.$refs.scheduleList.requestItems()
            },
            temporaryDialogShow() { //临时弹层出发
                this.$refs.temporaryDialog.temporaryDialog = true
            },
            initCnDate(time) {
                if (typeof time == "string") {
                    var newTime = time.split("-");
                    if (newTime[2] * 1 > 2000) {
                        var newArr = [newTime[2], newTime[1], newTime[0]];
                        console.log(newArr.join("-"));
                        return newArr.join("-");
                    } else {
                        return time;
                    }
                } else {
                    return time;
                }
            },
            operationGanttAddView(a) {
                this.$refs.ganttAdd.showDialog = a;
            },
            reviseTaskGantt(task) {
                this.$set(task, "text", task.name);
                this.$refs.ganttView.reviseTasl(task);
            },
            reviseTaskDialog(task) {
                //修改gantt
                if (!task) return false;
                this.ruleForm.id = task.id;
                this.ruleForm.name = task.text;
                this.ruleForm.plandate = [
                    this.initCnDate(task.plan_start_date),
                    this.initCnDate(task.plan_end_date)
                ];
                this.ruleForm.actualdate = [
                    this.initCnDate(task.start_date),
                    this.initCnDate(task.end_date)
                ];
                this.ruleForm.additionaltext = task.FilterValue ? task.FilterValue : "";
                this.ruleForm.judgeAdd = "xiugai";
                this.ruleForm.parent = task.parent;
                this.$refs.ganttAdd.showDialog = true;
            },
            addTaskDialog(task) {
                console.log(task);
                task.start_date = this.initDate(task.start_date);
                task.end_date = this.initDate(task.end_date);
                this.$refs.ganttView.addTask(task);
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
            ganttAddShow(obj) {
                if(this.selectScheduleID == ''){
                    this.$message({
                        showClose: true,
                        message: '请选择进度方案',
                        type: 'error'
                    });
                    return false
                }
                if (obj.id) {
                    this.taskDefault.queueGanttTask = obj.id;
                }
                if (obj.parentId) {
                    this.taskDefault.taskParentId = obj.parentId;
                }
                this.$refs.ganttAdd.showDialog = true;
            },
            delGanttTask(task) {
                this.$refs.ganttView.delTask(task);
                // if (this.isRealNum(this.taskDefault.queueGanttTask)) {
                //     this.$refs.ganttView.delTask(this.taskDefault.queueGanttTask)
                //     this.taskDefault.queueGanttTask = ''
                // } else {}
            },
            additionalClick() {
                var formData = new FormData();
                formData.append("ProjectID", window.ProjectID);
                formData.append("ModelID", window.ModelID);
            },
            initDate(time) {
                if (!time) {
                    return null;
                }
                time = time.split('T')[0]
                var date = new Date(time);
                return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
            },
            requestData(item) {
                if (!item) {
                    return;
                }
                const loading = this.$loading({//loading
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.5)'
                });
                loading.close()
                
                this.selectItem = item
                window.ScheduleID = item.ScheduleID;
                var _this = this;
                this.selectScheduleID = item.ScheduleID;
                // var formData = new FormData()
                // formData.append('ProjectID',window.ProjectID)
                // formData.append('ScheduleID',item.ScheduleID)
                this.$axios.get(`${window.urlConfig}/api/Prj/GetScheduleTasks?ProjectID=${window.ProjectID}&ScheduleID=${item.ScheduleID}`).then(res=>{
                    console.log(res)
                    this.ganttData = res.data
                    this.ganttData.forEach(item=>{
                        item.Type = item.Category
                        item.color = item.Color
                    })
                    if(this.showGantt){
                        this.initGantt()
                    }else{
                        this.$refs.chats.chartRender(_this.ganttData)
                    }
                    loading.close()
                }).catch(res=>{
                    console.log('gantt接口报错，原因' + res)
                    loading.close()
                })
                
            },
            initGantt(){
                 this.tasks.data.length = 0;
                 this.ganttData.forEach((item,index)=>{
                     var data ={
                         id: item.TaskID,
                         text: item.TaskName,
                         start_date: this.initDate(item.TaskStartTime),
                         end_date: this.initDate(item.TaskEndTime),
                         parent: item.ParentID,
                         plan_start_date: this.initDate(item.TaskPlanStartTime) ? item.TaskPlanStartTime.split('T')[0] : "",
                         plan_end_date: this.initDate(item.TaskPlanEndTime) ?item.TaskPlanEndTime.split('T')[0] : "",
                         additionaltext: this.FilterValue
                     }
                     this.tasks.data.push(data)
                 })
                 this.$refs.ganttView.Repaint();
            },
            toggleGantt() {
                if(this.selectScheduleID != ''){
                    this.showGantt = !this.showGantt;
                }   
            },
            toggle3D() {
                if(this.selectScheduleID == ''){
                    return false
                }
                this.show3d = !this.show3d;
                var show3DBtn = document.getElementById("show3DText");
                if (this.show3d) {
                    show3DBtn.innerText = "隐藏模型";
                } else {
                    show3DBtn.innerText = "显示模型";
                }
                if (this.$refs.chats) {
                    this.$nextTick(function() {
                        this.$refs.chats.reLoadChat();
                    });
                }
            },
            getQueryString(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            }
        },
        created() {
            
            window.urlConfig = "https://bimcomposer.probim.cn";
            if (this.getQueryString('ProjectID') == null) {
                window.ProjectID = "7e951a17-556b-46ee-9fb8-634d97940635";
                window.ModelID = "c1e76e74-220c-4bee-93ce-b1779fa3e70c"
            } else {
                window.ProjectID = this.getQueryString('ProjectID')
                window.ModelID = this.getQueryString('ModelID')
            }
        },
        watch: {
            show3d: function(val, oldval) {
                this.$nextTick(function() {
                    this.$refs.ganttView.ganttResize();
                });
                console.log("调用showOrHideComposer 参数为" + val);
                if (window.showOrHideComposer) {
                    window.showOrHideComposer(val);
                }
            },
            // showGantt:function(val,oldval){
            //     if(val){
            //         this.requestData(this.selectItem)
            //     }
                
            // }
        }
    };
</script>
