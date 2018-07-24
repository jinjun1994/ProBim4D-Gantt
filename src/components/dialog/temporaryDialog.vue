<template>
    <div class="temporary-dialog" v-if="temporaryDialog">
        <div class="temporary-center position-center" v-show="!reviseDialogShow && !addMultipleBuild">
            <h1>项目信息设置（项目级）</h1>
            <el-row class="mt20">
                <el-col :span="5" class="label">
                    进度名称：
                </el-col>
                <el-col :span="18">
                    <!-- <el-input  placeholder="请输入项目开工日期" v-model="temData.startTime" clearable></el-input> -->
                    <el-input v-model="temData.name" prefix-icon="" size="small" placeholder="输入名称">
                    </el-input>
                </el-col>
            </el-row>
            <el-row class="mt20">
                <el-col :span="5" class="label">
                    . 项目开工日期：
                </el-col>
                <el-col :span="18">
                    <!-- <el-input  placeholder="请输入项目开工日期" v-model="temData.startTime" clearable></el-input> -->
                    <el-date-picker v-model="temData.startTime" prefix-icon="" size="small" type="date" placeholder="选择日期" style="width:100%">
                    </el-date-picker>
                </el-col>
            </el-row>
            <el-row class="mt20">
                <el-col :span="5" class="label">
                    是否使用爬架：
                </el-col>
                <el-col :span="18" class="radio-wp">
                    <!-- <el-input size="small" placeholder="请输入是否使用爬架" v-model="temData.useClimbing" clearable></el-input> -->
                    <el-radio v-model="temData.useClimbing" label="1" size="small">是</el-radio>
                    <el-radio v-model="temData.useClimbing" label="0" size="small">否</el-radio>
                </el-col>
            </el-row>
            <el-row class="mt20">
                <el-col :span="5" class="label">
                    基础形式：
                </el-col>
                <el-col :span="18">
                    <el-input size="small" placeholder="请输入基础形式" v-model="temData.basics" clearable></el-input>
                </el-col>
            </el-row>
            <el-row class="mt20 border-top">
                <el-col :span="24">
                    <el-table :data="floorTableData" stripe style="overflow-y: auto" @row-dblclick='wzw' max-height="200">
                        <el-table-column prop="floorID" label="楼层编号" width="100">
                        </el-table-column>
                        <el-table-column prop="floorName" label="楼层名称" width="100">
                        </el-table-column>
                        <el-table-column prop="floorType" label="楼层类型" width="100">
                        </el-table-column>
                        <el-table-column prop="describe" label="描述" width="100">
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="100">
                            <template slot-scope="scope">
                                    <el-button
                                    @click.native.prevent="deleteRow(scope.$index)"
                                    type="text"
                                    size="small">
                                    移除
                                    </el-button>
                            </template>
                            </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <el-row class='mt20'>
                <el-col :span="24">
                    <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link add-btn">
                            添加<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="item in navOptions" :key="item.floorTyoe" :command=item.floorType>{{item.floorType}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
            <div class="sub-btn">
                
                <ul>
                    <li @click="buildSelectNub">批量添加</li>
                    <li @click="submitClick" class="ml20">确定</li>
                    <li class="ml20" @click="temporaryDialog = false">取消</li>
                </ul>
            </div>
        </div>
        <div class="revise-dialog position-center" v-show="reviseDialogShow">
            <h1>楼层详细信息（更改）</h1>
            <el-row class="mt20">
                <el-col :span="5" class="label">
                    楼层编号：
                </el-col>
                <el-col :span="18">
                    <el-input size="small" placeholder="请输入楼层编号" v-model="reviseDialogData.floorID" clearable :disabled="true"></el-input>
                </el-col>
            </el-row>
            <el-row class="mt20">
                <el-col :span="5" class="label">
                    楼层名称：
                </el-col>
                <el-col :span="18">
                    <el-input size="small" placeholder="楼层名称" v-model="reviseDialogData.floorName" clearable></el-input>
                </el-col>
            </el-row>
            <el-row class="mt20">
                <el-col :span="5" class="label">
                    楼层类型：
                </el-col>
                <el-col :span="18">
                    <el-input size="small" placeholder="请输入楼层类型" v-model="reviseDialogData.floorType" clearable></el-input>
                </el-col>
            </el-row>
            <el-row class="mt20">
                <el-col :span="5" class="label">
                    描述：
                </el-col>
                <el-col :span="18">
                    <el-input size="small" placeholder="请输入描述" v-model="reviseDialogData.describe" clearable></el-input>
                </el-col>
            </el-row>
            <div class="sub-btn">
                <ul>
                    <li @click="reviserSubmit">确定</li>
                </ul>
            </div>
        </div>
        <div class="position-center add-multip" v-show="addMultipleBuild" style="height:200px;"> 
            <h1>批量操作</h1>
            <el-row class="mt20">
                <el-col :span="6" class="label">
                    选择楼层类型：
                </el-col>
                <el-col :span="18" class="label">
                       <el-select v-model="batchInputVal" placeholder="请选择">
                            <el-option
                              v-for="item in navOptions"
                              :key="item.floorType"
                              :label="item.floorType"
                              :value="item.floorType">
                            </el-option>
                          </el-select>
                </el-col>
            </el-row>
            <el-row class="mt20">
                <el-col :span="6" class="label">
                    添加标准层个数：
                </el-col>
                <el-col :span="18" class="label">
                     <el-input-number size="small" v-model="num6" :min="1"></el-input-number>
                </el-col>
            </el-row>
            
            <div class="sub-btn">
                <ul>
                    <li @click="addMultipSubmit">确定</li>
                    <!-- <li>确定</li> -->
                </ul>
            </div>
        </div>
    </div>
</template>
<style scope>
    .el-input-number--small{
        width: 95%;
    }
    .el-table__fixed-right::before,
    .el-table__fixed::before {
        background-color: transparent;
    }
    .el-button--mini.is-circle {
        border: none;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
        width: 100%;
    }
    .el-table th>.cell {
        text-align: center;
    }
    .radio-wp {
        line-height: 32px;
        text-align: left;
        padding-left: 10px;
    }
    .el-radio {
        margin-top: 0
    }
    .el-date-editor.el-input {
        width: 100%;
    }
    .revise-dialog,
    .add-multip {
        width: 500px;
        height: 300px;
        padding: 20px;
        background: #fff;
        border-radius: 10px;
    }
    .el-input--suffix .el-input__inner {
        background: #fff
    }
    .add-btn {
        text-align: right;
        color: #666;
        cursor: pointer;
    }
    ul,
    li {
        list-style: none;
    }
    .sub-btn ul {
        display: flex;
        flex-direction: row;
        cursor: pointer;
    }
    .sub-btn {
        position: absolute;
        right: 20px;
        bottom: 20px;
        color: #666;
    }
    .ml20 {
        margin-left: 20px;
    }
    .border-top {
        border-top: 1px solid #ccc
    }
    .el-table::before {
        height: 0;
    }
    .label {
        color: #666;
        line-height: 32px;
        text-align: center;
    }
    .mt20 {
        margin-top: 20px;
    }
    .position-center {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
    }
    .temporary-dialog {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9;
    }
    .temporary-center {
        width: 550px;
        height: 550px;
        padding: 20px;
        background: #fff;
        border-radius: 10px;
    }
    .temporary-center h1 {
        font-size: 14px;
    }
</style>
<script>
    export default {
        data() {
            return {
                num6: 0,
                floorTableData: [],
                temData: {
                    name: '',
                    startTime: "",
                    useClimbing: '',
                    basics: ''
                },
                navOptions: [],
                nub: -2,
                addFloorTableData: {
                    floorID: -1,
                    floorName: '-1F',
                    floorType: '',
                    describe: ''
                },
                reviseDialogShow: false,
                reviseDialogData: {
                    describe: '',
                    floorID: '',
                    floorName: '',
                    floorType: ''
                },
                temporaryDialog: false,
                addMultipleBuild: false,
                batchInputVal:'',
                floorConfig:''
            };
        },
        methods: {
            addMultipSubmit() {
                if(this.batchInputVal == ''){
                    this.$message({
                        message: '请选择添加类型',
                        type: 'warning'
                    });
                    return false
                }
                for (var i = 0; i < this.num6; i++) {
                    this.nub += 1
                    if (this.nub == 0) {
                        this.nub = 1
                    }
                    this.addFloorTableData.floorID = this.nub.toString()
                    this.addFloorTableData.floorName = this.addFloorTableData.floorID + 'F'
                    this.addFloorTableData.floorType = this.batchInputVal
                    this.addFloorTableData.describe = ''
                    this.floorTableData.push({
                        floorID: this.nub.toString(),
                        floorName: this.addFloorTableData.floorID + 'F',
                        floorType:  this.batchInputVal,
                        describe: '双击修改描述'
                    })
                }
                this.addMultipleBuild = false
            },
            buildSelectNub() {
                this.addMultipleBuild = true
                console.log(this.addMultipleBuild)
            },
            deleteRow(index) {
                this.floorTableData.splice(index, 1)
            },
            submitClick() {
                // var _this = this
                // var data = {
                //     ScheduleName: this.temData.name,
                //     StartTime: this.temData.startTime,
                //     IsHaveClimbing: this.temData.useClimbing,
                //     BasicForm: this.temData.basics,
                //     ModelLevels: []
                // }
                // this.floorTableData.forEach(item => {
                //     data.ModelLevels.push({
                //         LevelNumber: item.floorID,
                //         LevelName: item.floorName,
                //         LevelCategoryName: item.floorType,
                //         LevelDscription: item.describe == "双击修改描述" ? '' : item.describe
                //     })
                // })
                // var formData = new FormData()
                // formData.append('ModelProcess', JSON.stringify(data))
                // formData.append('ProjectID', window.ProjectID)
                // formData.append('ModelID', window.ModelID)
                // this.$axios.post(` ${window.urlConfig}/api/Prj/AutoCreateSchedule`, formData).then(res => {
                //     if (res.status == 200) {
                //         _this.$emit('listAddItem')
                //         _this.temporaryDialog = false
                //     }
                // })




                //前端算gantt数据
                
                let _this = this
                let data = []
                let userInpitTime = new Date(this.temData.startTime)
                this.floorTableData.forEach((floorTableitem,index)=>{//遍历选择项
                    this.floorConfig.ProcessNode.forEach((process,processIndex)=>{
                        this.floorConfig.Process.forEach((processConfig,processConfigIndex)=>{
                            if(process.ProcessId == processConfig.ProcessId){
                                processConfig.LevelCategory2Cycle.forEach(LevelCategory=>{
                                    if(LevelCategory.LevelCategory == floorTableitem.floorType){
                                            let formatDateStrat = _this.formatDate(userInpitTime)
                                            let formatDateStr = _this.formatDate(new Date(userInpitTime.setDate((userInpitTime.getDate() + LevelCategory.LevelCycle*1))))
                                            data.push({
                                                color:processConfig.ProcessColor,
                                                TaskStartTime:formatDateStrat,
                                                TaskID:_this.GUID(),
                                                TaskEndTime:formatDateStr,
                                                TaskName:process.ProcessNodeName + '_' + floorTableitem.floorName,
                                                TaskPlanStartTime:formatDateStrat,
                                                TaskPlanEndTime:formatDateStr,
                                                Type:process.ProcessNodeName

                                            })
                                    }
                                    
                                   
                                })
                            }
                        })
                    })
                    
                        
                })
                _this.$emit('saveGanttData',data)
                
            },
            formatDate(date){
                var y = date.getFullYear();  
                var m = date.getMonth() + 1;  
                m = m < 10 ? ('0' + m) : m;  
                var d = date.getDate();  
                d = d < 10 ? ('0' + d) : d;  
                var h = date.getHours();  
                var minute = date.getMinutes();  
                minute = minute < 10 ? ('0' + minute) : minute; 
                var second= date.getSeconds();  
                second = minute < 10 ? ('0' + second) : second;  
                return y + '-' + m + '-' + d+' '+h+':'+minute+':'+ second;  
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
            handleCommand(command) {
                this.nub += 1
                if (this.nub == 0) {
                    this.nub = 1
                }
                this.addFloorTableData.floorID = this.nub.toString()
                this.addFloorTableData.floorName = this.addFloorTableData.floorID + 'F'
                this.addFloorTableData.floorType = command
                this.addFloorTableData.describe = ''
                this.floorTableData.push({
                    floorID: this.nub.toString(),
                    floorName: this.addFloorTableData.floorID + 'F',
                    floorType: command,
                    describe: '双击修改描述'
                })
            },
            reviserSubmit() {
                if (this.reviseDialogData.describe == '') {
                    this.reviseDialogData.describe = '双击修改描述'
                }
                this.floorTableData.forEach((item, index) => {
                    if (item.floorID == this.reviseDialogData.floorID) {
                        this.floorTableData[index] = this.reviseDialogData
                    }
                })
                this.reviseDialogShow = false
            },
            initreviseData() {
                this.reviseDialogData.describe = ''
                this.reviseDialogData.floorID = ''
                this.reviseDialogData.floorName = ''
                this.reviseDialogData.floorType = ''
                this.reviseDialogShow = false
            },
            wzw(a, b, c, d) {
                console.log(a)
                this.reviseDialogShow = true
                a.describe = a.describe == '双击修改描述' ? '' : a.describe
                this.reviseDialogData = a
            },
            getQueryString(name){
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]); return null;
            }
        },
        mounted() {
            var _this = this
            this.$axios.get(`${window.urlConfig}/api/sys/GetSchedule`).then(res => {
                console.log(res)
                this.floorConfig = res.data
                res.data.LevelCategory.forEach(item => {
                    _this.navOptions.push({
                        floorType: item.LevelCategory,
                        describe: item.LevelDescription
                    })
                })
                console.log(this.floorConfig)
            })
            // var data = {
            //     ComPanyId:this.getQueryString('ComPanyId'),
            //     JsonData:this.getQueryString('JsonData')
            // }
            // this.$axios.post(`${window.urlConfig}/CompanyData/Save`,data).then(res=>{
                
            // })
            // var a = JSON.parse(window.localStorage.getItem('floorDefube'))
            // if (a) {
            //     this.navOptions = a
            // } else {
            //     this.navOptions = [{
            //         "floorType": "地下室",
            //         "describe": ""
            //     }, {
            //         "floorType": "首层",
            //         "describe": ""
            //     }, {
            //         "floorType": "二层",
            //         "describe": ""
            //     }, {
            //         "floorType": "标准层",
            //         "describe": ""
            //     }]
            // }
        },
        watch: {
            temporaryDialog: function(val, oldval) {
                if (!val) {
                    this.floorTableData.length = 0
                    this.temData.name = ''
                    this.temData.startTime = ''
                    this.temData.useClimbing = ''
                    this.temData.basics = ''
                    this.num6 = 0
                    this.nub = -2
                }
            }
        }
    };
</script>
