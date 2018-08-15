<template>
    <div class="index-wp">
        <!-- <scheduleList class="scheduleList-wp" @requestData=requestData v-show="!show3d">
            </scheduleList> -->
        <scheduleList class="scheduleList-wp" 
        @requestData=requestData 
        v-show="!show3d" 
        @temporaryDialogShow=temporaryDialogShow 
        @clearGanttDataView=clearGanttDataView 
        @temporaryDialogUpdataShow=temporaryDialogUpdataShow
        ref="scheduleList">
        </scheduleList>
        <div class="gantt-nav" style="height:100%;" :class="{'show-3d':show3d}">
            <div class="gantt-head">
                <div class="gantt-left" v-show="showGantt">任务列表</div>
                <div class="gantt-right">
                    <div class="fl">
                        <ul>
                            <li @click="toggle3D()" :class="{'no-click':selectScheduleID == ''}"> <img src="./model.svg"><span id="show3DText">显示模型</span></li>
                            <li style="margin-left:40px;" :class="{'no-click':!show3d}">附加选中对象</li>
                            <li style="margin-left:40px;" v-show="!showGantt" class="proportion">
                                完成比例
                                <div>
                                    <el-row style="display:flex;align-items: center;" v-for="a in proportionData" :key="a.name">
                                        <el-col :span="10" style="color:#999">
                                            {{a.business}} {{a.molecule}}/{{a.diff}}
                                        </el-col>
                                        <el-col :span="14">
                                             <el-progress :text-inside="true" :stroke-width="18" :percentage="a.proportion" :color=a.color></el-progress>
                                        </el-col>
                                       
                                    </el-row>
                                </div>
                            </li>
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
                            <li @click="MatchElementTask" v-show="selectScheduleID != ''">构件匹配</li>
                            <li :class="{'no-click':!show3d}"><img src="./mock.svg">模拟</li>
                            <li class="no-click"><img src="./import.svg">导入</li>
                            <li @click='toggleGantt' :class="{'no-click':selectScheduleID == ''}"><img src="./table.svg">网络图/甘特图</li>
                            <li class="no-click"><img src="./export.svg">导出</li>

                        </ul>
                    </div>
                </div>
            </div>
            <gantt class="gantt-wp" 
                v-show="showGantt" 
                :tasks="tasks" 
                :selectScheduleID="selectScheduleID" 
                :show3d=show3d
                ref="ganttView" 
                @ganttAddShow=ganttAddShow 
                @reviseTaskDialog=reviseTaskDialog 
                @operationGanttAddView=operationGanttAddView 
                @upDatedGanttDateToCharts=upDatedGanttDateToCharts>
            </gantt>
            <chats v-if="!showGantt" class="chats-wp" ref="chats" 
                :selectScheduleID="selectScheduleID"
                @chartUpDate=chartUpDate 
                @proportionUpData=proportionUpData
                :ganttData=ganttData></chats>
            <matchDialog></matchDialog>
            <ganttAdd ref="ganttAdd" 
                @delGanttTask=delGanttTask 
                :selectSchedule=selectItem 
                @addTaskDialog=addTaskDialog 
                @reviseTaskGantt=reviseTaskGantt 
                :taskDefault=taskDefault 
                :ruleForm=ruleForm>
            </ganttAdd>
        </div>
        <div class="iframe-wp" v-show="show3d"></div>
        <div class="match-loading" v-show="matchLoadingConfig.show">
            <el-progress type="circle" :percentage="matchLoadingConfig.number" class="loading" :width=300 :color="matchLoadingConfig.color"></el-progress>
        </div>
        <temporaryDialog ref="temporaryDialog"
            :selectItem=temporarySelectItem 
            @listAddItem=listAddItem 
            @saveGanttData=saveGanttData 
            @addScheduleListItem=addScheduleListItem>
        </temporaryDialog>
    </div>
</template>
<style>
.el-progress-bar__innerText{
    line-height: 18px
}
    .proportion{
        text-align: left
    }
    .proportion>div{
        padding: 10px;
        width: 300px;
        display: none;
        background: #fff;
        box-shadow: 0px 18px 49px -30px rgba(88, 90, 89, 0.5);
        border-radius: 6px;
        border: 1px solid #ccc;
    }
    .proportion:hover div{
        display: block
    }
    .match-loading{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .5);
        z-index: 999;
    }
    .match-loading .loading{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 300px;
        height: 300px;;
        margin: auto
    }
    .match-loading .el-progress--circle .el-progress__text{
        color: #fff
    }
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
        position: relative;
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
        position: relative;
        z-index: 99
    }
    .gantt-wp,
    .chats-wp {
        height: calc(100% - 30px) !important;
        margin-left: -1px;
        position: relative;
    }
    .scheduleList-wp {
        position: relative;
        z-index: 10;
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
                selectScheduleID: "", //已选中进度id
                selectItem:{},//选中列表传过来的 item
                temporarySelectItem:{},
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
                ganttOrChartsData:'',
                matchLoadingConfig:{
                    color:'#000',
                    number:0,
                    show:false,
                    success:0,
                    fail:0,
                    matchSuccess:0,
                    matchFail:0

                },
                proportionData:[]
            };
        },
        methods: {
            proportionUpData(obj){
                this.proportionData = []
                
                obj.actural.forEach(item=>{
                    let number = 0
                    
                    item.schedule.forEach(s=>{
                        if(s[7] == 100){
                            number += this.$refs.chats.DateDiff(s[5],s[0])
                        }
                    })
                    this.proportionData.push({
                        business:item.business,
                        color:item.color,
                        diff:this.$refs.chats.DateDiff(item.schedule[item.schedule.length-1][5],item.schedule[0][0]),
                        molecule:number,
                        proportion:number == 0?0:Math.floor((number/this.$refs.chats.DateDiff(item.schedule[item.schedule.length-1][5],item.schedule[0][0]))*100)

                    })
                    console.log(number/this.$refs.chats.DateDiff(item.schedule[item.schedule.length-1][5],item.schedule[0][0])*100)

                })
                 console.log(this.proportionData)
            },
            chartUpDate(diff){ 
                let arr = []
                for(let i = 0 ; i<this.ganttData.length;i++){
                    if(this.ganttData[i].TaskID == diff.selectTaskData.TaskID){
                         this.ganttData[i].TaskName = diff.name
                         this.ganttData[i].Percentage = 100
                    }
                    if(this.ganttData[i].Type == diff.selectTaskData.Type){
                        if(this.floorNameToNub(diff.selectTaskData.TaskName) <= this.floorNameToNub(this.ganttData[i].TaskName)){
                           console.log(this.ganttData[i].TaskStartTime,this.initDiffDateTime(this.ganttData[i].TaskStartTime,diff.diff))
                            this.ganttData[i].TaskStartTime = this.initDiffDateTime(this.ganttData[i].TaskStartTime,diff.diff)
                            this.ganttData[i].TaskEndTime = this.initDiffDateTime(this.ganttData[i].TaskEndTime,diff.diff )
                            arr.push( this.ganttData[i])
                        }
                    }
                    this.$refs.chats.dialogData.show = false
                }
               
                this.$refs.chats.renderer.render( this.$refs.chats.acturalSchedule,  this.$refs.chats.plannedSchedule,  this.$refs.chats.initGanttDataToCharts(this.ganttData));
            },
            initDiffDateTime(date,diff){//根据插值算出新时间
                date = new Date(date)
                date.setDate(date.getDate() + diff);
                return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
            },
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
                    if(item.TaskID == task.TaskID){
                        item.TaskStartTime = this.serverDateInit(task.TaskStartTime)
                        item.TaskEndTime = this.serverDateInit(task.TaskEndTime)
                    }
                })
                console.log(this.ganttData)
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
            temporaryDialogUpdataShow(item){
                this.temporarySelectItem = item
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
                console.log(task)
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
            floorNameToNub(str){//楼层=>number
                return str.split('_')[1].split('F')[0]*1
            },
            addTaskDialog(task) {
                /**
                 *color:processConfig.ProcessColor,
                                                    TaskStartTime:formatDateStrat,
                                                    TaskID:_this.GUID(),
                                                    TaskEndTime:formatDateEnd,
                                                    TaskName:process.relationName + '_' + floorTableItem.floorName,
                                                    TaskPlanStartTime:formatDateStrat,
                                                    TaskPlanEndTime:formatDateEnd,
                                                    Category:process.ProcessNodeName 
                 */
                let _this = this,index=0;
                console.log(this.ganttData)
                console.log(task.floorNumber)
                for(let i = 0;i<this.ganttData.length;i++){
                    if(_this.floorNameToNub(_this.ganttData[i].TaskName) == task.floorNumber){
                        index = i
                    }
                }
                let data = {
                    TaskStartTime:task.start_date,
                    TaskEndTime:task.end_date,
                    TaskPlanStartTime:task.start_date,
                    TaskPlanEndTime:task.end_date,
                    TaskName:task.text,
                    color:task.color,
                    Category:task.type
                }
                this.ganttData.splice(index, 0, data);
                
                task.start_date = this.initDate(task.start_date);
                task.end_date = this.initDate(task.end_date);
                this.$refs.ganttView.addTask(task);
            },
            GUID(){
                let guid = '';
                for (let i = 1; i <= 32; i++) {
                let n = Math.floor(Math.random() * 16.0).toString(16);
                guid += n;
                if ((i === 8) || (i === 12) || (i === 16) || (i === 20))
                    guid += '-';
                }
                return guid;
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
                if((typeof time !='string')&&time.constructor!=String){
                    let date = new Date(time)
                    return  `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
                }
                time = time.split('T')[0]
                var date = new Date(time);
                return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
            },
            requestData(item) {
                if (!item) {
                    return;
                }
                let loading = this.$loading({//loading
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.5)'
                });
                
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
                    this.ganttData = this.ganttData.sort((a,b)=>{
                        return a.TaskName.split('_')[1].split('F')[0]*1 - b.TaskName.split('_')[1].split('F')[0]*1
                    })
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
                         additionaltext: this.FilterValue,
                         Category:item.Category,
                         Color:item.Color,
                         ScheduleID:item.ScheduleID,
                         TaskDesc:item.TaskDesc,
                         ExternalProperty:item.ExternalProperty,
                         HasChildren:item.HasChildren,
                         Section:item.Section,
                         ElementIDS:item.ElementIDS
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
            },
            
            recursionMatchElementTask(index){
                if(this.matchLoadingConfig.number == 100){
                    this.matchLoadingConfig.show = false
                    this.$alert('共'+this.ganttData.length + '条数据 <br> 成功'+this.matchLoadingConfig.success+'条  <br>  失败'+this.matchLoadingConfig.fail+'条 <br> 匹配上' + this.matchLoadingConfig.matchSuccess + '条 <br> 未匹配上' + this.matchLoadingConfig.matchFail + '条', '匹配完成',
                    {
                        dangerouslyUseHTMLString:true,
                        callback: action => {
                            this.matchLoadingConfig.success = 0
                            this.matchLoadingConfig.fail = 0
                            this.requestData(this.selectItem)
                        }
                    });
                    this.matchLoadingConfig.number = 0
                    return false
                }
                let formData = new FormData()
                let i = index?index:0
                let data = this.ganttData[i]
                formData.append('ProjectID',window.ProjectID)
                formData.append('ModelID',window.ModelID)
                formData.append('VersionNo','')
                formData.append('ScheduleTaskID',data.TaskID)
                formData.append('Section',data.TaskName.split('_')[1])
                formData.append('MatchValueField',this.selectItem.MatchValueField)
                if(this.selectItem.MatchType == 0){
                    formData.append('MatchValue',(data.TaskName.split('_')[0]))
                }else if(this.selectItem.MatchType == 1){
                    formData.append('MatchValue',data.ExternalProperty)
                }
                this.$axios.post(`${window.urlConfig}/api/Model/MatchElement2Task`,formData).then(res=>{
                        console.log(res)
                        if(res.data == ''){
                            this.matchLoadingConfig.matchFail += 1

                        }else{
                            this.matchLoadingConfig.matchSuccess += 1
                        }
                        i += 1
                        this.matchLoadingConfig.number = Math.floor(i/this.ganttData.length *100)
                        this.matchLoadingConfig.color = '#'+Math.floor(Math.random()*0xffffff).toString(16);
                        
                        this.matchLoadingConfig.success += 1
                        this.recursionMatchElementTask(i)
                    
                }).catch(res=>{
                    console.log('匹配规则报错 原因' + res)
                        i += 1
                        this.matchLoadingConfig.number = Math.floor(i/this.ganttData.length *100)
                        this.matchLoadingConfig.color = '#'+Math.floor(Math.random()*0xffffff).toString(16);
                        
                        this.matchLoadingConfig.fail += 1
                        this.recursionMatchElementTask(i)
                })
            },
            MatchElementTask(){//测试匹配规则
                console.log(this.selectItem)
                if(this.selectItem.MatchValueField != ''){
                    this.recursionMatchElementTask()
                    this.matchLoadingConfig.show = true
                }else{
                    this.$message.error('请选择匹配规则');
                }
                
                // var formData = new FormData()
                // formData.append('ProjectID',window.ProjectID)
                // formData.append('ModelID',window.ModelID)
                // formData.append('VersionNo','')
                // let data = this.ganttData[4]
                
                // formData.append('Section',data.TaskName.split('_')[1])
                // formData.append('MatchValueField',this.selectItem.MatchValueField)
                // if(this.selectItem.MatchType == 0){
                //     formData.append('MatchValue',(data.TaskName.split('_')[0]))
                // }else if(this.selectItem.MatchType == 1){
                //     formData.append('MatchValue',data.ExternalProperty)
                // }
                // this.$axios.post(`${window.urlConfig}/api/Model/MatchElement2Task`,formData).then(res=>{
                //     console.log(res)
                // }).catch(res=>{
                //     console.log('匹配规则报错 原因' + res)
                // })
            }
        },
        created() {
            
            window.urlConfig = "https://bimcomposer.probim.cn";
            if (this.getQueryString('ProjectID') == null) {
                window.ProjectID = "18a9e792-6b0d-2bc6-2595-2de55708e58e";
                window.ModelID = "09db5c33-41c6-4bdc-8921-fc9df2dd625d"
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
