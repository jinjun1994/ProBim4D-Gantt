<template>
    <div class="index-wp">
        
        <scheduleList class="scheduleList-wp"
        :selectSchedule=selectItem 
        :ganttOrChartsData = ganttData
        @requestData=requestData 
        v-show="!show3d" 
        @temporaryDialogShow=temporaryDialogShow 
        @clearGanttDataView=clearGanttDataView 
        @temporaryDialogUpdataShow=temporaryDialogUpdataShow
        @getSheduleAllData=getSheduleAllData
        @listAddItem=listAddItem 
        ref="scheduleList">
        </scheduleList>
        <div class="gantt-nav" style="height:100%;" :class="{'show-3d':show3d}">
            <div class="gantt-head">
                <div class="gantt-left" v-show="showGantt" :style="{'width':ganttHeaderWidth}">任务列表</div>
                <div class="gantt-right">
                    <div class="fl">
                        
                        <ul>
                            <li @click="toggle3D()" :class="{'no-click':selectScheduleID == ''}" class="sign"> <img src="./model.svg"><span id="show3DText">显示模型</span></li>
                            <li style="margin-left:40px;" :class="{'no-click':!show3d}" v-show="show3d && showGantt" @click="linkElementsTaskClick" >附加选中对象</li>
                            <li v-show="!showGantt" class="proportion">
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
                            <li> <div style="color:#fff;display:inline-block;margin-right:20px" v-if="!mockDialogData.startShow" @click="mockDetailDataClick">{{mockDetailData.btnText}}</div></li>
                             <li style="position: relative;">
                                 <el-date-picker
                                    @blur=hiddenInputBlur
                                    align='right'
                                    ref="hiddenDateInput"
                                    style="position: absolute;z-index:-1;opacity: 0;"
                                    v-model="hiddenInputDate"
                                    type="daterange"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                                <el-date-picker
                                    @blur=radioHiddenInputBlur
                                    ref="radioHiddenDateInput"
                                    v-model="radioHiddenInputDate"
                                    align="right"
                                    type="date"
                                    placeholder="选择日期"
                                    style="position: absolute;z-index:-1;opacity: 0;"
                                    :picker-options="pickerOptions1">
                                </el-date-picker>
                                <el-dropdown @command="reportForm">
                                    <span class="el-dropdown-link">
                                        报表<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown" >
                                        <el-dropdown-item command='day' v-if="!showGantt">日报表</el-dropdown-item>
                                        <el-dropdown-item command='actual' :disabled="selectScheduleID == ''">实际执行报表</el-dropdown-item>
                                        <el-dropdown-item command='plan' :disabled="selectScheduleID == ''">计划执行报表</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </li>
                        </ul>
                    </div>
                    <div class="fr">
                        
                        <ul>
                           
                            <li v-show="showGantt">
                                 <el-radio v-model="ganttRadio" label="1">年</el-radio>
                                  <el-radio v-model="ganttRadio" label="2">月</el-radio>
                                   <el-radio v-model="ganttRadio" label="3">日</el-radio>
                            </li>
                            <li @click="MatchElementTask" v-show="selectScheduleID != '' && !show3d">构件匹配</li>
                            <li v-if="mockDialogData.showVedioBtn" :class="{mr10:mockDialogData.showVedioBtn}" class="mock-vedio">
                               
                                <img src="./reset.svg" alt="" @click.stop="mockReset"><!--重置-->
                                <img src="./start.svg" alt="" v-if="mockDialogData.startShow" @click.stop="mockStart" style="transform: rotate(180deg)"><!--开始-->
                                <img src="./stop.svg" v-if="!mockDialogData.startShow" @click.stop="mockStop"><!--暂停-->
                                
                            </li>
<<<<<<< HEAD
                            <li :class="{'no-click':!show3d}" v-if="!mockDialogData.showVedioBtn" @click="mockShowDialog" class="sign" title="模拟"><img src="./mock.svg"></li>
                             <li v-if="mockDialogData.showVedioBtn" @click="closeMock" class="sign" title="关闭模拟"><img src="./mock.svg"></li>
=======
                            <li :class="{'no-click':!show3d}" v-if="!mockDialogData.showVedioBtn" @click="mockShowDialog" class="sign"><img src="./mock.svg">模拟</li>
                             <li v-if="mockDialogData.showVedioBtn" @click="closeMock" class="sign"><img src="./mock.svg">关闭模拟</li>
>>>>>>> 5ef9773a8d03da77cce514a06ddbaedf7d79f7f7
                            <!-- <li class="no-click sign" v-show="!show3d"><img src="./import.svg">导入</li> -->
                            <li @click='toggleGantt' :class="{'no-click':selectScheduleID == ''}" class="sign"><img src="./table.svg"><span id="toggleGanttText"></span></li>
                            <!-- <li class="no-click sign" v-show="!show3d"><img src="./export.svg">导出</li> -->

                        </ul>
                    </div>
                </div>
            </div>
            <div class="mock-details" v-show='mockDetailData.show && !mockDialogData.startShow'>
                <h1>模拟详情</h1>
                <el-row class="mt20">
                    <el-col :span="8" class="title">模拟日期：</el-col>
                    <el-col :span="16">{{mockDetailData.date}}</el-col>
                </el-row>
                <div v-if="mockDetailData.taskName.length > 0">
                     <el-row class="mt20"  v-for="(a,index) in mockDetailData.taskName" :key="a">
                        <el-col :span="8" class="title" v-if="index == 0">进行任务名称：</el-col>
                        <el-col :span="8" class="title" v-else></el-col>
                        <el-col :span="16">{{a}}</el-col>
                    </el-row>
                </div>
                
                <el-row class="mt20" v-else-if="mockDetailData.taskName.length == 0">
                    <el-col :span="8" class="title">进行任务名称：</el-col>
                    <el-col :span="16">无</el-col>
                </el-row>

            </div>
            <reportForm
                class="reportFrom"
                :reportFormData=reportFormData
                v-show="reportFormData.showOrHide"
            ></reportForm>
            <gantt class="gantt-wp" 
                @upStyleHeader=upStyleHeader
                v-show="showGantt && !reportFormData.showOrHide" 
                :tasks="tasks" 
                :selectScheduleID="selectScheduleID" 
                :show3d=show3d
                :timerNumber = mockDialogData.number*1
                ref="ganttView"
                @saveSelectGanttTaskData=saveSelectGanttTaskData
                @upDataMockDetail=upDataMockDetail 
                @ganttAddShow=ganttAddShow 
                @reviseTaskDialog=reviseTaskDialog 
                @resetMockDataArr=resetMockDataArr
                @operationGanttAddView=operationGanttAddView
                @hiddenStopBtn=hiddenStopBtn 
                @ganttUpData=ganttUpData
                @upDatedGanttDateToCharts=upDatedGanttDateToCharts>
            </gantt>
            <chats v-if="!showGantt && !reportFormData.showOrHide" class="chats-wp" ref="chats" 
                :selectScheduleID="selectScheduleID"
                @upDataMockDetail=upDataMockDetail
                @chartUpDate=chartUpDate 
                @proportionUpData=proportionUpData
                @hiddenStopBtn=hiddenStopBtn
                :timerNumber = mockDialogData.number*1
                :show3d = show3d
                :reportFormDataTitle = reportFormData.title
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
        <div class="select-time" v-if="mockDialogData.show">
            <div class="center">
                <h1>选择动画持续时间</h1>
                <el-row class="mt20">
                    <el-col :span="5" class="label">
                        时间：
                    </el-col>
                    <el-col :span="18">
                        <el-input placeholder="请输入时间" v-model="mockDialogData.number">
							<template slot="append">秒</template>
						</el-input>
                    </el-col>
                </el-row>
                <div class="sub-btn">
                    <ul>
                        <li class="ml20" @click="mocksubmit">确定</li>
                        <li class="ml20" @click="mockDialogData.show=false">取消</li>
                    </ul>
                </div>
            </div>
        </div>
        <temporaryDialog ref="temporaryDialog"
            :selectItem=temporarySelectItem 
            :scheduleMenuItems=scheduleMenuItems
            @listAddItem=listAddItem 
            @saveGanttData=saveGanttData 
            @addScheduleListItem=addScheduleListItem>
        </temporaryDialog>
    </div>
</template>
<style>
.gantt-nav .el-dropdown{
    color: #fff;
}
.gantt-nav .el-radio__input.is-checked+.el-radio__label{
    color: #f7a500;
}
.gantt-nav .el-radio__input.is-checked .el-radio__inner{ 
    border-color: #f7a500;
    background: #f7a500;
}
.el-radio+.el-radio{
    margin-left: 10px;
}
.gantt-nav .el-radio__label{
    color: #fff;
}
.mock-details{
    position: fixed;
    top: 30px;
    left: 180px;
    width:400px;
    height: 200px;
    border-radius: 10px;
    border: 1px solid #ccc;
    background: #fff;
    z-index: 99;
    padding: 20px;
    overflow-y: auto
}
.mock-details .title{
    text-align: right;
    height: 20px;
    line-height: 20px;
}
.mr10{margin-right: 10px !important;}
.mock-vedio img:hover{
    opacity: .5;
}
.gantt-head .gantt-right div:nth-child(2) li.sign:hover,.gantt-head .gantt-right div:nth-child(1) li.sign:hover{
    opacity: .5;
}
.select-time{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, .5);
    z-index: 10;
}
.select-time .center .el-input__inner{
	border: 1px solid #dcdfe6 !important;
}
.select-time .center{
    width: 300px;
    height: 150px;
    background: #fff;
    border-radius: 10px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    padding: 20px;
}
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
        z-index: 9
    }
    .gantt-wp,
    .chats-wp {
        height: calc(100% - 30px) !important;
        margin-left: -1px;
        position: relative;
    }
    .chats-wp{
        display: flex;
        flex-direction: column-reverse;
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
    ::-webkit-scrollbar{
            width: 4px;
            height: 6px;
            background-color: #f6f9fc;
        }
        ::-webkit-scrollbar-thumb{
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, 0);
            background-color: #c6c6c6;
        }
        ::-webkit-scrollbar-track{
            -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0);
            border-radius: 10px;
            background-color: #f6f9fc;
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
    import reportForm from './reportForm/reportForm.vue'
    export default {
        components: {
            scheduleList,
            gantt,
            chats,
            ganttAdd,
            reportForm,
            // matchDialog:resolve => {require(['./dialog/delDialogMatch'], resolve)},
            matchDialog,
            temporaryDialog
        },
        data() {
            return {
                 pickerOptions1: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                        picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                        }
                    }]
                },
                radioHiddenInputDate:'',
                hiddenInputDate:'',
                ganttRadio:'3',
                 activeIndex: '1',
                activeIndex2: '1',
                //
                ganttHeaderWidth:'359px',
                checkedCharts:[],
                ganttData:[],
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
                proportionData:[],
                mockDialogData:{
                    show:false,
                    number:10,
                    showVedioBtn:false,
                    startShow:true,
                    mockStartOrEndDate:[0,0]
                },
                mockDetailData:{
                    date:'',
                    taskName:[],
                    show:false,
                    btnText:'详情'
                },
                scheduleMenuItems:[],
                selectGanttTask:'',
                reportFormData:{
                    tableHeaderData:[],
                    tableBodyData:[],
                    title:'',
                    showOrHide:false,
                    selectTime:[]
                },
                reportFormSelect:''
            };
        },
        methods: {
            hiddenInputBlur(){
                if(!this.hiddenInputDate) return
                let lists = []
                this.reportFormData.tableBodyData = []
                this.ganttData.forEach(g=>{
                    if(this.common.isDateBetween(g.TaskStartTime,this.hiddenInputDate[0],this.hiddenInputDate[1]) || this.common.isDateBetween(g.TaskEndTime,this.hiddenInputDate[0],this.hiddenInputDate[1]) || this.common.isDateBetween(g.TaskPlanStartTime
,this.hiddenInputDate[0],this.hiddenInputDate[1]) || this.common.isDateBetween(g.TaskPlanEndTime
,this.hiddenInputDate[0],this.hiddenInputDate[1])){
                        lists.push(g)
                    }
                })
                if(window.parent.BIMe && this.show3d){
					
						let elementID = window.parent.BIMe.modelData.BIMeElementData.getAllElementIds()
						window.parent.BIMe.control.BIMeUtility.resetElementColor(elementID)
				}
                this.reportFormData.selectTime = this.hiddenInputDate
                 if(this.reportFormSelect == 'actual'){
                    this.reportFormData.tableHeaderData = [
                        {label:'任务',prop:'task'},
                        {label:'基准计划开始时间',prop:'planTimeStart'},    
                        {label:'基准计划结束时间',prop:'planTimeEnd'},    
                        {label:'预估开始时间',prop:'estimeTimeStart'},   
                        {label:'预估结束时间',prop:'estimeTimeEnd'},   
                        {label:'实际开始时间',prop:'actualTimeStart'},   
                        {label:'实际结束时间',prop:'actualTimeEnd'},   
                        {label:'本阶段状态',prop:'thisState'},   
                        {label:'总体状态',prop:'massinState'},   
                    ]
                    lists.forEach(list => {
                        
                        let diff = null,diff1 = null;
                        let diffMsg = '',diffMsg1 = '';
                        if(list.Percentage){
                            diff = this.common.DateDiff(list.TaskEndTime,list.TaskPlanEndTime)
                            diff1 = this.common.DateDiff(list.TaskEndTime,list.TaskPlanEndTime)
                        }else{
                            diff = this.common.DateDiff(new Date(),list.TaskPlanEndTime)
                            diff1 = this.common.DateDiff(new Date(),list.TaskPlanEndTime)
                        }
                        if(diff > 0){
                            diffMsg = `延迟${diff}天`
                        }else{
                            diffMsg = '正常'
                        }
                        if(diff1 > 0){
                            diffMsg1 = `延迟${Math.ceil(diff1)}天`
                        }else{
                            diffMsg1 = `正常`
                        }
                        if(list.Percentage){//已完成
                            this.reportFormData.tableBodyData.push({
                                task:list.TaskName,
                                planTimeStart:this.common.dateSplit(list.TaskPlanStartTime,'T'),
                                planTimeEnd:this.common.dateSplit(list.TaskPlanEndTime,'T'),
                                estimeTimeStart:'',
                                estimeTimeEnd:'',
                                actualTimeStart:this.common.dateSplit(list.TaskStartTime,'T'),
                                actualTimeEnd:this.common.dateSplit(list.TaskEndTime,'T'),
                                thisState:diffMsg,
                                massinState:diffMsg1
                            })
                        }else{
                            this.reportFormData.tableBodyData.push({
                                task:list.TaskName,
                                planTimeStart:this.common.dateSplit(list.TaskPlanStartTime,'T'),
                                planTimeEnd:this.common.dateSplit(list.TaskPlanEndTime,'T'),
                                estimeTimeStart:this.common.dateSplit(list.TaskStartTime,'T'),
                                estimeTimeEnd:this.common.dateSplit(list.TaskEndTime,'T'),
                                actualTimeStart:'',
                                actualTimeEnd:'',
                                thisState:diffMsg,
                                massinState:diffMsg1
                            })
                        }
                        if(window.parent.BIMe && this.show3d){

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
                        
                    });
                    

                }else if(this.reportFormSelect == 'plan'){
                    this.reportFormData.tableHeaderData = [
                        
                        {label:'任务',prop:'task'},
                        {label:'基准计划开始时间',prop:'planTimeStart'},    
                        {label:'基准计划结束时间',prop:'planTimeEnd'},    
                        {label:'预估开始时间',prop:'estimeTimeStart'},   
                        {label:'预估结束时间',prop:'estimeTimeEnd'}, 
                    ]
                    lists.forEach(list=>{
                        this.reportFormData.tableBodyData.push({
                            task:list.TaskName,
                            planTimeStart:this.common.dateSplit(list.TaskPlanStartTime,'T'),
                            planTimeEnd:this.common.dateSplit(list.TaskPlanEndTime,'T'),
                            estimeTimeStart:this.common.dateSplit(list.TaskStartTime,'T'),
                            estimeTimeEnd:this.common.dateSplit(list.TaskEndTime,'T')
                        })
                        if(window.parent.BIMe && this.show3d){

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
                    })
                }
                this.reportFormData.showOrHide = true
            },
            colorRbg(a){
				var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
				var sColor = a.toLowerCase();
				if(sColor && reg.test(sColor)){
					if(sColor.length === 4){
						var sColorNew = "#";
						for(var i=1; i<4; i+=1){
							sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));	
						}
						sColor = sColorNew;
					}
					//处理六位的颜色值
					var sColorChange = [];
					for(var i=1; i<7; i+=2){
						sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));	
					}
					return "RGB(" + sColorChange.join(",") + ")";
				}else{
					return sColor;	
				}
			},
            radioHiddenInputBlur(){
                if(!this.radioHiddenInputDate) return
                this.$refs.chats.formatTableData(this.radioHiddenInputDate,true,true)
            },
            //下拉报表
            reportForm(command){
                if(command == 'day'){
                    this.$refs.radioHiddenDateInput.focus()
                }else{
                    this.$refs.hiddenDateInput.focus()

                }
                this.reportFormSelect = command
               
            },
            saveSelectGanttTaskData(a){
                this.selectGanttTask = a
            },
            linkElementsTaskClick(){
               
                if(this.selectGanttTask == ''){
                    this.$message.error('请选择gantt数据');
                    return false
                }
                let elementIds = [1];
                if(window.parent.BIMe){
                    elementIds = window.parent.BIMe.control.BIMeSelector.getSelectorElementIds();
                    
                }
                if(elementIds.length == 0){
                    this.$message.error('请选中模型');
                    return false
                }
                if(!this.selectGanttTask.ElementIDS){ //新增
                    let loading = this.$loading({//loading
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.5)'
                    });
                    let formatArr = []
                    elementIds.forEach(e=>{
                        formatArr.push(e.split('^')[1])
                    })
                    let formData = new FormData()
                    formData.append('ProjectID',window.ProjectID)
                    formData.append('ScheduleTaskID',this.selectGanttTask.id)
                    formData.append('ElementIDs',formatArr)
                    this.$axios.post(`${window.urlConfig}/api/Prj/LinkElements2Task`,formData).then(res=>{
                        loading.close()
                        this.$message('附加成功');
                        this.requestData(this.selectItem)
                    }).catch(res=>{
                        loading.close()
                        console.log('附加选中对象报错' + res)
                        this.$message.error('附加失败');
                    })
                }else{
                    this.$alert(`<label for="w1"><input type="radio" name='select' id="w1" value="0" class="selectRadio"><span>附加</span></label><label for="w2" style="margin-left:30px"><input class="selectRadio" type="radio" value="1" name='select' id="w2">替换</label>`, '提示', {
                        dangerouslyUseHTMLString: true,
                        showClose:false,
                        beforeClose: (action, instance, done) =>{
                            let loading = this.$loading({//loading
                                lock: true,
                                text: 'Loading',
                                spinner: 'el-icon-loading',
                                background: 'rgba(0, 0, 0, 0.5)'
                            });
                           let radioArr = document.getElementsByClassName('selectRadio')
                            if(radioArr[0].checked){//附加
                                let formData = new FormData()
                                formData.append('ProjectID',window.ProjectID)
                                formData.append('ScheduleTaskID',this.selectGanttTask.id)
                                let formatArr = []
                                elementIds.forEach(e=>{
                                    formatArr.push(e.split('^')[1])
                                })
                                formatArr = this.selectGanttTask.ElementIDS.split(',').concat(formatArr)
                                formData.append('ElementIDs',formatArr)
                                 this.$axios.post(`${window.urlConfig}/api/Prj/LinkElements2Task`,formData).then(res=>{
                                     done()
                                     this.$message('附加成功');
                                      this.requestData(this.selectItem)
                                 }).catch(res=>{
                                    console.log('附加选中对象报错' + res)
                                    this.$message.error('附加失败');
                                })

                            }else if(radioArr[1].checked){//替换
                                let formData = new FormData()
                                formData.append('ProjectID',window.ProjectID)
                                formData.append('ScheduleTaskID',this.selectGanttTask.id)
                                let formatArr = []
                                elementIds.forEach(e=>{
                                    formatArr.push(e.split('^')[1])
                                })
                                formData.append('ElementIDs',formatArr)
                                 this.$axios.post(`${window.urlConfig}/api/Prj/LinkElements2Task`,formData).then(res=>{
                                      this.requestData(this.selectItem)

                                     done()
                                     this.$message('附加成功');
                                 }).catch(res=>{
                                    console.log('附加选中对象报错' + res)
                                    this.$message.error('附加失败');
                                })
                            }else{
                                this.$message.error('请选择附加类型');
                                loading.close()
                            }
                        }
                    });
                }

                
            },
             handleSelect(key, keyPath) {
            },
            upStyleHeader(a){
                this.ganttHeaderWidth = a + 'px'
            },
            getSheduleAllData(arr){
                this.scheduleMenuItems = arr
            },
            mockDetailDataClick(){
                this.mockDetailData.show = !this.mockDetailData.show
                if(this.mockDetailData.show){
                    this.mockDetailData.btnText = '关闭详情'
                }else{
                     this.mockDetailData.btnText = '详情'
                }
            },
            upDataMockDetail(obj){
                if(this.showGantt){
                    this.mockDetailData.date = obj.date.split(' ')[0]
                }else{
                    this.mockDetailData.date = this.serverDateInit(obj.date).split('T')[0]
                }
                
                this.mockDetailData.taskName = obj.taskName

            },
            mockShowDialog(){
                if(!this.show3d) {return false};
                this.mockDialogData.show=true;
                this.mockDialogData.number=10
            },
            dataRemoveLast(date){
                if(date.length != 19) return false
                if(date.indexOf('T') != -1){
                    return date.split('T')[0]
                }
                if(data.indexOf(' ') !=-1){
                    return date.split(' ')[0]
                }
            },
            dateArrToAll(arr){
                let date1 = new Date(arr[0])
                let date2 = new Date(arr[1])
                let diff  = (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)
                let returnArr = []
                for(let i = 0;i<diff;i++){
                    date1.setDate(date1.getDate()+1)
                    let m , d;
                    (date1.getMonth() +1) >=10? m = (date1.getMonth() +1): m ='0'+ (date1.getMonth() +1)
                    date1.getDate()>=10?d = date1.getDate():d ='0'+date1.getDate()
                    returnArr.push(`${date1.getFullYear()}-${m}-${d} 00:00:00`)
                }
                return returnArr

            },
            hiddenStopBtn(judge){
                if(judge){
                    this.mockDialogData.startShow = true
                }else{
                    this.mockDialogData.startShow = false
                }
            },
            resetMockDataArr(){
                mockStartOrEndDate[0] = 0
            },
            mockStart(){
                this.mockDialogData.startShow = false
                if(this.showGantt){
                    let judge;//0开始 //继续
                    this.mockDialogData.mockStartOrEndDate[0] == 0 ?judge = true : judge = false
                    this.ganttData.forEach((data,index)=>{
                        if(index ==  0){
                            this.mockDialogData.mockStartOrEndDate[0] = data.TaskStartTime
                             this.mockDialogData.mockStartOrEndDate[1] = data.TaskEndTime
                        }else{
                            
                            if(new Date( this.mockDialogData.mockStartOrEndDate[0]).getTime() > new Date(data.TaskStartTime).getTime()){
                                 this.mockDialogData.mockStartOrEndDate[0] = data.TaskStartTime
                            }
                            if(new Date( this.mockDialogData.mockStartOrEndDate[1]).getTime() < new Date(data.TaskEndTime).getTime()){
                                 this.mockDialogData.mockStartOrEndDate[1] = data.TaskEndTime
                            }
                            
                        }
                    })
                    if(judge){
                         this.$refs.ganttView.addMarker( this.mockDialogData.mockStartOrEndDate[0])
                        this.$refs.ganttView.runMarker(this.dateArrToAll(this.mockDialogData.mockStartOrEndDate))
                    }else{
                        this.$refs.ganttView.runMarker(this.dateArrToAll(this.mockDialogData.mockStartOrEndDate))
                    }
                       
                    
                }else{
                    this.$refs.chats.chartAxPointerStart()
                }
                
            },
            mockReset(){
                if(this.showGantt){
                    this.$refs.ganttView.delMaker()
                    this.mockDialogData.mockStartOrEndDate = [0,0]
                }else{
                    this.$refs.chats.chartAxPointerReset()
                }
                 this.mockDialogData.startShow = true
                 if(window.parent.BIMe){
                     let elementID = window.parent.BIMe.modelData.BIMeElementData.getAllElementIds()
                    window.parent.BIMe.control.BIMeUtility.resetElementColor(elementID)
                    window.parent.BIMe.control.BIMeHide.removeHideElementByElementId(elementID)
                 }
                 
                 
            },
            mockStop(){
                if(this.showGantt){ 
                    this.$refs.ganttView.stopMarker()
                }else{
                    this.$refs.chats. chartAxPointerStop()
                   
                }
                 this.mockDialogData.startShow = true
                 
            },
            closeMock(){
                this.mockDialogData.showVedioBtn = false
                this.mockDialogData.number = 10
                this.mockDialogData.startShow = true
                if(this.showGantt){
                    if(this.$refs.ganttView.timer){
                        this.$refs.ganttView.delMaker()
                        this.mockDialogData.mockStartOrEndDate = [0,0]
                    }
                }else{
                    this.$refs.chats.chartAxPointerReset()
                }
                 if(window.parent.BIMe && this.show3d){
                     let elementID = window.parent.BIMe.modelData.BIMeElementData.getAllElementIds()
                    window.parent.BIMe.control.BIMeUtility.resetElementColor(elementID)
                    window.parent.BIMe.control.BIMeHide.removeHideElementByElementId(elementID)
                 }
                
            },
            mocksubmit(){
                if(isNaN(this.mockDialogData.number*1) || this.mockDialogData.number == null || this.mockDialogData.number == ' '){
                    this.$message.error('请输入数字');
                }
                if(this.mockDialogData.number < 10){
                    this.$message.error('持续时间不能小于10秒');
                }
                this.mockDialogData.showVedioBtn = true
                this.mockDialogData.show = false
                
            },
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

                })
            },
            ganttUpData(task){
                console.log(task)
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
                            this.ganttData[i].TaskStartTime = this.initDiffDateTime(this.ganttData[i].TaskStartTime,diff.diff)
                            this.ganttData[i].TaskEndTime = this.initDiffDateTime(this.ganttData[i].TaskEndTime,diff.diff )
                            arr.push( this.ganttData[i])
                        }
                    }
                    this.$refs.chats.dialogData.show = false
                }
                let formData = new FormData()
                formData.append('ProjectID',window.ProjectID)
                formData.append('ScheduleTasks',JSON.stringify(arr))
               this.$axios.post(`${window.urlConfig}/api/Prj/BatchUpdateScheduleTask`,formData).then(res=>{
                    this.$refs.chats.renderer.render( this.$refs.chats.acturalSchedule,  this.$refs.chats.plannedSchedule,  this.$refs.chats.initGanttDataToCharts(this.ganttData));
               }).catch(res=>{
                   cosnole.log('/api/Prj/BatchUpdateScheduleTask 报错' + res)
               })
               
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
                this.ganttData.forEach(item=>{
                    if(item.TaskID == task.TaskID){
                        item.TaskStartTime = this.serverDateInit(task.TaskStartTime)
                        item.TaskEndTime = this.serverDateInit(task.TaskEndTime)
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
                    message: '操作进度方案成功',
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
                this.$set(task,'TaskOrder',this.selectGanttTask.TaskOrder)
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
                this.ruleForm.additionaltext = task.ExternalProperty
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
                
                for(let i = 0;i<this.ganttData.length;i++){
                    if(_this.ganttData[i].TaskOrder == task.floorNumber){
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
                    Category:task.type,
                    TaskOrder:task.floornumber,
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
                    
                    this.ganttData = res.data
                    // let type = [],
                    // obj={};
                    // this.ganttData.forEach(item=>{
                    //     type.push(item.Category)
                    // })
                    // type = [...new Set(type)]
                    // type.forEach((t,index)=>{
                    //     this.ganttData.forEach((d,index1)=>{
                    //         if(d.Category == t){
                    //                 if(!obj[index]){
                    //                     obj[index] = [d]
                    //                 }else{
                    //                     obj[index].push(d)
                    //                 }
                    //         }
                    //     })
                    // })
                    // let newArr = []
                    // for (let x in obj){
                    //     newArr = newArr.concat(obj[x].sort((a,b)=>{
                    //      return a.TaskOrder - b.TaskOrder
                    //  }))
                    // }
                    // this.ganttData = newArr
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
                  //层级关系
                let typeArr = []
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
                         ElementIDS:item.ElementIDS,
                         TaskOrder:item.TaskOrder
                     }
                     this.tasks.data.push(data)

                     typeArr.push({
                        Category:item.Category,
                        id:this.GUID(),
                        text:item.Category,
                        ScheduleID:item.ScheduleID,
                        procedureWp:true

                    })
                 })
                 typeArr = this.arrayUnique2(typeArr,'Category')
                typeArr.forEach(type=>{
                    this.tasks.data.forEach(d=>{
                        if(type.Category == d.Category){
                            if(!d.parent){
                            d.parent = type.id

                            }

                        }
                    })
                })
                 this.tasks.data  =  this.tasks.data.concat(typeArr)

                 this.$refs.ganttView.Repaint();
            },
            //根据某一属性去重
            arrayUnique2(arr, name) {
                var hash = {};
                return arr.reduce(function (item, next) {
                    hash[next[name]] ? '' : hash[next[name]] = true && item.push(next);
                    return item;
                }, []);
            },
            toggleGantt() {
                if(this.reportFormData.showOrHide){
                    this.reportFormData.showOrHide = false
                    return 
                }
                if(window.parent.BIMe && this.show3d){
                    let elementID = window.parent.BIMe.modelData.BIMeElementData.getAllElementIds()
                    window.parent.BIMe.control.BIMeUtility.resetElementColor(elementID)
                    window.parent.BIMe.control.BIMeHide.removeAllHideElement();
                    window.parent.BIMe.control.BIMeSelector.removeAllSelectorElements();
                }
                
                if(this.showGantt){
                    this.$refs.ganttView.delMaker()

                }else{
                    this.$refs.chats.chartAxPointerReset()
                }
                this.hiddenStopBtn(true)
                if(this.selectScheduleID != ''){
                    this.showGantt = !this.showGantt;
                }   
                // var btn = document.getElementById('toggleGanttText')
                // if(this.showGantt){
                //     btn.innerHTML = '网络图'
                // }else{
                //     btn.innerHTML = '甘特图'
                // }
                
                 

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
                    this.mockDetailData.show = false
                }
                this.mockDialogData.showVedioBtn = false
                this.mockDialogData.number = 10
                this.mockDialogData.startShow = true
                if(this.showGantt){
                    if(this.$refs.ganttView.timer){
                        this.$refs.ganttView.delMaker()
                        this.mockDialogData.mockStartOrEndDate = [0,0]
                    }
                }else{
                    this.$refs.chats.chartAxPointerReset()
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
                            this.matchLoadingConfig.matchSuccess = 0
                            this.matchLoadingConfig.matchFail = 0
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
                    formData.append('MatchValue',data.TaskName)
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
            if(window.sessionStorage.BimUrl){
                window.urlConfig = window.sessionStorage.BimUrl
            }else{
                 window.urlConfig = "https://bimcomposer.probim.cn:444";
            }
            if(window.sessionStorage.ApiUrl){
                window.apiUrlConfig = window.sessionStorage.ApiUrl
                
            }else{
                window.apiUrlConfig = 'http://42.159.5.178:82'
            }
            // if(window.sessionStorage.urlConfig){
            //     window.urlConfig = window.sessionStorage.BimUrl
            //     window.apiUrlConfig = window.sessionStorage.ApiUrl

            // }else{
            //     window.urlConfig = "https://bimcomposer.probim.cn:444";
            //     window.apiUrlConfig = 'https://api.probim.cn:444/'
            // }
            if (this.getQueryString('ProjectID') == null) {
                window.ProjectID = "18a9e792-6b0d-2bc6-2595-2de55708e58e";
                window.ModelID = "09db5c33-41c6-4bdc-8921-fc9df2dd625d"
            } else {
                window.ProjectID = this.getQueryString('ProjectID')
                window.ModelID = this.getQueryString('ModelID')
            }
            if(this.reportFormData.title == ''){
                    this.$axios.get(`${window.urlConfig}/api/Prj/GetModel?ProjectID=${window.ProjectID}&ModelID=${window.ModelID}`).then(res=>{
                        if(res){
                            this.reportFormData.title = res.data.Name
                        }
                    })
                    // this.$axios.get(`https://bimcomposer.probim.cn:444/api/Prj/GetModel?ProjectID=c14075a2-6c91-1fdb-3fbe-76bf898c24cf&ModelID=50f8553e-2928-461b-b2c5-7bfa3a0f528c`).then(res=>{
                    //     console.log(res)
                    //     if(res){
                    //         this.reportFormData.title = res.data.Name
                    //     }
                    // })
                }
        },
        computed:{
            watchMock(){
                return this.mockDialogData.show
            }
        },
        computed:{
            watchMock(){
                return this.mockDialogData.show
            }
        },
        watch: {
            ganttRadio:function(val,oldval){
                if(val == '1'){//年
                    this.$refs.ganttView.resetGanttConfig("year")
                }else if(val == '2'){//月
                    this.$refs.ganttView.resetGanttConfig("month")
                }else{//日
                    this.$refs.ganttView.resetGanttConfig("day")
                }
            },
            show3d: function(val, oldval) {
                this.$nextTick(function() {
                    this.$refs.ganttView.ganttResize();
                });
                console.log("调用showOrHideComposer 参数为" + val);
                if (window.showOrHideComposer) {
                    window.showOrHideComposer(val);
                }
            },
            showGantt:function(val,oldval){
                if(val){
                    this.requestData(this.selectItem)
                }
                
            },
            watchMock(val,oldval){
                if(val){
                    window.parent.document.getElementsByTagName('iframe')[0].style.zIndex = 0
                }else{
                    window.parent.document.getElementsByTagName('iframe')[0].style.zIndex = 999
                }
            }
        }
    };
</script>
